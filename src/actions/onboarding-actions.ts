"use server";

import { authSafeAction } from "@/lib/safe-action";
import {
  accountDetailsSchema,
  mailingAddressSchema,
} from "@/lib/schemas/onboarding-schema";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import { fetchAccountSettings, fetchDomainSettings } from "@/lib/supabase/queries/account-settings";
import { getDomainDetails, triggerDomainVerification } from "@/lib/resend";
import { z } from "zod";
import { setDomainVerificationStatus } from "./domain-actions";

export const accountDetailsAction = authSafeAction
  .schema(accountDetailsSchema)
  .metadata({
    name: "account-details",
  })
  .action(async ({ parsedInput: { name, domain }, ctx: { user } }) => {
    const supabase = createClient();

    // Create a new account and link the user
    const { data: newAccountId, error: newAccountError } = await supabase
      .rpc("create_account_and_link_user", {
        name: name,
        domain: domain,
        user_id: user.id,
      })
      .throwOnError();

    console.log("newAccountId", newAccountId);

    if (newAccountError)
      throw new Error("Failed to create account and link user");

    // Create a domain in Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    const domains = await resend.domains.list();

    // Check if the domain already exists
    const domainExists = domains?.data?.data.find((d) => d.name === domain);
    if (domainExists) {
      // In dev mode, we'll allow the domain to be used
      if (process.env.NODE_ENV === "development") {
        console.log("Domain already exists in dev mode, skipping creation");

        console.log(domainExists);

        // Add the domain to the account
        const { error: addDomainError } = await supabase
          .from("accounts")
          .update({ resend_domain_id: domainExists.id })
          .eq("id", newAccountId)
          .throwOnError();

        if (addDomainError) throw new Error("Failed to add domain to account");

        // Return the domain details in the response
        return { success: true, data: newAccountId };
      }

      // TODO: Should we update the domain instead of throwing an error?
      // What's the privacy concern here?
      throw new Error("Domain already exists");
    }

    const resendDomain = await resend.domains.create({ name: domain });

    // If there was an error creating the domain, throw an error unless it's a 403
    if (resendDomain.error) {
      if (resendDomain.error.name !== "validation_error") {
        throw new Error("Failed to create domain in Resend");
      }
    }

    // Add the domain to the account
    const { error: addDomainError } = await supabase
      .from("accounts")
      .update({ resend_domain_id: resendDomain.data?.id })
      .eq("id", newAccountId)
      .throwOnError();

    if (addDomainError) throw new Error("Failed to add domain to account");

    // Return the domain details in the response
    return { success: true, data: newAccountId };
  });

export const mailingAddressAction = authSafeAction
  .schema(mailingAddressSchema)
  .metadata({
    name: "mailing-address",
  })
  .action(
    async ({
      parsedInput: { street_address, city, state, postal_code, country },
      ctx: { user },
    }) => {
      const supabase = createClient();
      // Now update the account with the mailing address
      const { error } = await supabase
        .from("accounts")
        .update({ street_address, city, state, postal_code, country })
        .eq("id", user.account_id)
        .throwOnError();

      if (error) throw new Error("Failed to save mailing address data");
      return { success: true };
    },
  );

export const verifyDomain = authSafeAction
  .metadata({
    name: "verify-domain",
  })
  .action(async ({ ctx: { user } }) => {
    if (!user) {
      return { success: false, error: "User not found" };
    }

    const accountData = await fetchAccountSettings(
      user?.account_id || undefined,
    );

    if (!accountData?.resend_domain_id) {
      return { success: false, error: "No domain found for verification" };
    }

    try {
      const result = await triggerDomainVerification(accountData.resend_domain_id);

      if (result.status === "verified") {
        return { success: true };
      }

      return {
        success: false,
        error:
          "Domain not verified yet. Please check your DNS settings and try again.",
      };
    } catch (error) {
      console.error("Error verifying domain:", error);
      return {
        success: false,
        error: "An error occurred while verifying the domain",
      };
    }
  });

export const personalDetailsAction = authSafeAction
  .schema(z.object({
    fullName: z.string().min(1, "Full name is required"),
    avatarUrl: z.string().optional(),
  }))
  .metadata({
    name: "personal-details",
  })
  .action(async ({ parsedInput: { fullName, avatarUrl }, ctx: { user } }) => {
    const supabase = createClient();

    const { error } = await supabase
      .from("users")
      .update({
        full_name: fullName,
        avatar_url: avatarUrl,
      })
      .eq("id", user.id)
      .throwOnError();

    if (error) throw new Error("Failed to update personal details");
    return { success: true };
  });

// Initiates the domain verification process
export const initiateDomainVerification = authSafeAction
  .metadata({
    name: "initiate-domain-verification",
  })
  .action(async ({ ctx: { user } }) => {
    if (!user) {
      return { success: false, error: "User not found" };
    }

    const accountData = await fetchDomainSettings(user?.account_id || undefined);

    if (!accountData?.resend_domain_id) {
      return { success: false, error: "No domain found for verification" };
    }

    try {
      // Check current status
      const status = await triggerDomainVerification(accountData.resend_domain_id);

      // Update the verification status to pending
      await setDomainVerificationStatus(
        accountData.id,
        'pending',
        accountData.resend_domain_id,
        accountData.domain
      );

      return {
        success: true,
        data: {
          status: 'pending',
          message: "Domain verification process initiated"
        }
      };
    } catch (error) {
      console.error("Error initiating domain verification:", error);
      return {
        success: false,
        error: "An error occurred while initiating domain verification",
      };
    }
  });

// Checks the current status of domain verification
export const checkVerificationStatus = authSafeAction
  .metadata({
    name: "check-verification-status",
  })
  .action(async ({ ctx: { user } }) => {
    if (!user) {
      return { success: false, error: "User not found" };
    }

    const accountData = await fetchDomainSettings(user?.account_id || undefined);
    if (!accountData?.resend_domain_id) {
      return { success: false, error: "No domain found" };
    }

    try {
      // First get the current status
      const currentStatus = await getDomainDetails(accountData.resend_domain_id);

      // If the domain is verified or pending, return the status
      // We don't want to trigger a new verification check if the domain is already verified or awaiting verification
      if (['pending', 'verified'].includes(currentStatus.data?.status)) {

        await setDomainVerificationStatus(
          accountData.id,
          currentStatus.data?.status,
          accountData.resend_domain_id,
          accountData.domain
        );

        return {
          success: true,
          data: { status: currentStatus.data?.status }
        };
      }


      // If pending or failed, trigger a new verification check
      if (['pending', 'failed'].includes(currentStatus.data?.status)) {
        // Trigger a new verification check
        await triggerDomainVerification(accountData.resend_domain_id);

        // Update the verification status to pending
        await setDomainVerificationStatus(
          accountData.id,
          'pending',
          accountData.resend_domain_id,
          accountData.domain
        );

        return {
          success: true,
          data: {
            status: 'pending'
          }
        };
      }

      return {
        success: false,
        error: "Unable to verify domain status"
      };
    } catch (error) {
      console.error("Error checking verification status:", error);
      return {
        success: false,
        error: "An error occurred while checking verification status",
      };
    }
  });
