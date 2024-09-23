import type { Database } from "@/types/supabase";
import { createBrowserClient } from "@supabase/ssr";

import { env } from '@/env'

export const createClient = () =>
  createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
