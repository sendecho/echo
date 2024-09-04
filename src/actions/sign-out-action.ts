"use server";

import { getSession } from "@/lib/supabase/queries/user.cached";
import { createClient } from "@/lib/supabase/server";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function signOutAction() {
  const supabase = createClient();
  const {
    data: { user },
  } = await getSession();

  await supabase.auth.signOut({
    scope: "local",
  });

  revalidateTag(`user_${user?.id}`);

  return redirect("/login");
}