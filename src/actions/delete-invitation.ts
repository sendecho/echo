import { z } from "zod";
import { authSafeAction } from "@/lib/safe-action";

const deleteInvitationSchema = z.object({
  id: z.string().uuid(),
});

export const deleteInvitationAction = authSafeAction(deleteInvitationSchema, async ({ id }, { ctx }) => {
  const { supabase } = ctx;

  const { error } = await supabase
    .from("invitations")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}, {
  name: "deleteInvitation",
  track: {
    event: "delete_invitation",
    name: "Delete Invitation",
  },
});
