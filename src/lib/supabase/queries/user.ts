import { createClient } from '@/lib/supabase/server';
import { Client } from '@/types';

export async function getUserQuery(supabase: Client, userId: string) {
  return supabase
    .from("users")
    .select(
      `
      *
    `,
    )
    .eq("id", userId)
    .single()
    .throwOnError();
}
