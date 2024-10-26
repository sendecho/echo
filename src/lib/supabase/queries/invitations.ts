import { createClient } from "@/lib/supabase/server";

export async function fetchInvitations(accountId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("account_id", accountId)
    .is("accepted_at", null);

  if (error) throw error;
  return data;
}
