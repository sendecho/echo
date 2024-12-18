import "server-only";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { getUserQuery } from "./user";

export const getSession = cache(async () => {
  const supabase = createClient();

  return supabase.auth.getUser();
});

export const getUser = async () => {
  const {
    data: { user },
  } = await getSession();
  const userId = user?.id;

  if (!userId) {
    return null;
  }

  const supabase = createClient();
  return unstable_cache(
    async () => {
      return getUserQuery(supabase, userId);
    },
    ["user", userId],
    {
      tags: [`user_${userId}`],
      revalidate: 180,
    },
  )();
};
