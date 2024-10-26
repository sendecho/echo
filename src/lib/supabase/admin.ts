import type { Database } from "@/types/supabase";
import { createClient } from "@supabase/supabase-js";

export const createAdminClient = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_KEY || "",
  );
