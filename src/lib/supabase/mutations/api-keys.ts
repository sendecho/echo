import { createClient } from "@/lib/supabase/client";

export async function createAPIKey(accountId: string, name: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("api_keys")
    .insert({ account_id: accountId, name, key: generateAPIKey() })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAPIKey(keyId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("api_keys")
    .delete()
    .eq("id", keyId);

  if (error) throw error;
}

export async function fetchAPIKeys(accountId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("api_keys")
    .select("*")
    .eq("account_id", accountId);

  if (error) throw error;
  return data;
}

function generateAPIKey() {
  return `ak_${Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")}`;
}