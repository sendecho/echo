'use server'

import { authSafeAction } from "@/lib/safe-action";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";

const switchAccountSchema = z.object({
  accountId: z.string(),
});

export const switchAccountAction = authSafeAction
  .schema(switchAccountSchema)
  .metadata({ name: "switch-account" })
  .action(async ({ parsedInput: { accountId }, ctx: { user, supabase } }) => {
    // Update the user's current account
    const { error } = await supabase
      .from("users")
      .update({ account_id: accountId })
      .eq("id", user.id);

    if (error) {
      throw new Error("Failed to switch account");
    }

    // revalidate user
    revalidateTag(`user_${user.id}`);

    // Revalidate the paths that might be affected by the account switch
    revalidatePath("/");
    revalidatePath("/dashboard");

    return { success: true };
  });
