"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidateTag } from "next/cache";


export async function acceptInvitation(code: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .rpc('accept_invitation', { invite_code: code })
    .single();

  if (error) {
    console.error('Error accepting invitation:', error);
    return { success: false, error: error.message };
  }

  // Revalidate the user cache
  if (data?.user_data?.id) {
    revalidateTag(`user_${data.user_data.id}`);
  }

  return { success: true, data };
}
