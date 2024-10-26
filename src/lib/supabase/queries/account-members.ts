import { createClient } from "@/lib/supabase/server";

export async function fetchAccountMembers(accountId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("account_users")
    .select(`
      user_id,
      role,
      users (
        id,
        full_name,
        email
      )
    `)
    .eq("account_id", accountId);

  if (error) throw error;
  return data;
}
