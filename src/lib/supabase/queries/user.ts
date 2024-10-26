import type { Client } from '@/types';

export async function getUserQuery(supabase: Client, userId: string) {
  return supabase
    .from("users")
    .select(
      `
      *,
      account:account_id(*)
    `,
    )
    .eq("id", userId)
    .single()
    .throwOnError();
}

export async function getCurrentUserAccountQuery(supabase: Client) {
  const {
    data: { session },
    error
  } = await supabase.auth.getSession();

  if (error) throw error;

  if (!session?.user) {
    return;
  }

  return getUserQuery(supabase, session.user?.id);
}

export async function getUserAccountsQuery(supabase: Client, userId: string) {
  const { data, error } = await supabase
    .from('account_users')
    .select(`
      account_id,
      role,
      account:accounts(id, name, plan_name)
    `)
    .eq('user_id', userId)
    .throwOnError();

  if (error) throw error;
  return data;
}
