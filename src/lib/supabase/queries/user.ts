import { Client } from '@/types';

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
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return;
  }

  return getUserQuery(supabase, session.user?.id);
}