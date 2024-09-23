import type { Database } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";

import { env } from '@/env'

export const createAdminClient = () =>
  createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_KEY,
  );
