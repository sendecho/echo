import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./supabase";

export type Client = SupabaseClient<Database>;

export * from "./supabase";