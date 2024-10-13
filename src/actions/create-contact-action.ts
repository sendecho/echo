"use server";

import { z } from "zod";
import { authSafeAction } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";
import { revalidateTag } from "next/cache";
import { getCurrentPlan } from "@/lib/pricing";

const supabase = createClient();

const schema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
  country: z.string().optional(),
});

export const createContactAction = authSafeAction
  .schema(schema)
  .metadata({ name: "create-contact" })
  .action(async ({ parsedInput, ctx: { user } }) => {
    // Check if the account has reached the max number of contacts for their plan
    const { count: usageData } = await supabase
      .from("contacts")
      .select("*", { count: "exact" })
      .eq("account_id", user.account_id);
    const currentPlan = getCurrentPlan(user.account?.plan_name || "Free");

    if (
      currentPlan?.limits.contacts &&
      usageData &&
      usageData >= currentPlan.limits.contacts
    ) {
      throw new Error(
        "You have reached the maximum number of contacts for your plan. Please upgrade to a higher plan to add more contacts.",
      );
    }

    const { data, error } = await supabase
      .from("contacts")
      .insert({ ...parsedInput, account_id: user.account_id })
      .select()
      .single()
      .throwOnError();

    if (error) {
      throw new Error("Failed to add contact");
    }

    revalidateTag(`contacts_${user.account_id}`);

    return data;
  });
