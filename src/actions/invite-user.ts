"use server"

import { z } from "zod";
import { authSafeAction } from "@/lib/safe-action";
import { sendEmail } from "@/emails";
import AccountInviteEmail from "@/emails/account-invite-email";
import { getURL } from "@/lib/utils";

const inviteUserSchema = z.object({
  email: z.string().email(),
  role: z.enum(["owner", "member"]),
});

export const inviteUserAction = authSafeAction.schema(inviteUserSchema).metadata({
  name: "invite-user",
}).action(async ({ parsedInput: { email, role }, ctx: { user, supabase } }) => {
  // Check for existing invitation
  const { data: existingInvitation, error: checkError } = await supabase
    .from("invitations")
    .select()
    .eq("account_id", user.account_id)
    .eq("email", email)
    .is("accepted_at", null)
    .single();

  if (checkError && checkError.code !== 'PGRST116') {
    throw new Error("Error checking for existing invitation");
  }

  if (existingInvitation) {
    console.log("An invitation for this email already exists")
    return { success: false, error: "An invitation for this email already exists" };
  }

  // If no existing invitation, create a new one
  const { data, error } = await supabase
    .from("invitations")
    .insert({
      account_id: user.account_id,
      email,
      role,
      invited_by: user.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Failed to create invitation");
  }

  // Send invitation email
  await sendEmail({
    email: email,
    subject: "You've been invited to join a workspace on Echo",
    react: AccountInviteEmail({
      accountId: user.account_id as string,
      accountName: user.account?.name as string,
      inviterName: user.full_name as string,
      inviteLink: `${getURL('invite')}/${data.id}`
    })
  })


  return { success: true, invitation: data };
});
