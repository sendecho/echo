"use server";

import { z } from "zod";
import { authSafeAction } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";
import crypto from 'crypto';

const supabase = createClient();

const createAPIKeySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

const deleteAPIKeySchema = z.object({
  keyId: z.string().uuid("Invalid API key ID"),
});

function generateAPIKey() {
  return `ek_${crypto.randomBytes(32).toString('hex')}`;
}

async function hashAPIKey(apiKey: string) {
  // Use PostgreSQL's crypt function to hash the API key
  const { data, error } = await supabase.rpc('hash_api_key', { api_key: apiKey });
  if (error) throw error;
  return data;
}

export const createAPIKey = authSafeAction
  .schema(createAPIKeySchema)
  .metadata({ name: "create-api-key" })
  .action(async ({ parsedInput, ctx: { user } }) => {
    const newKey = generateAPIKey();
    const hashedKey = await hashAPIKey(newKey);

    const { data, error } = await supabase
      .from("api_keys")
      .insert({ account_id: user.account_id, name: parsedInput.name, key: hashedKey, first_chars: newKey.slice(0, 7) })
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Return the unhashed key to the client, but only this one time
    return { ...data, key: newKey };
  });

export const deleteAPIKey = authSafeAction
  .schema(deleteAPIKeySchema)
  .metadata({ name: "delete-api-key" })
  .action(async ({ parsedInput, ctx: { user } }) => {
    const { error } = await supabase
      .from("api_keys")
      .delete()
      .match({ id: parsedInput.keyId, account_id: user.account_id });

    if (error) throw new Error(error.message);
    return { success: true };
  });

export const fetchAPIKeys = authSafeAction
  .schema(z.object({}))
  .metadata({ name: "fetch-api-keys" })
  .action(async ({ ctx: { user } }) => {
    const { data, error } = await supabase
      .from("api_keys")
      .select("id, name, created_at, last_used_at")
      .eq("account_id", user.account_id);

    if (error) throw new Error(error.message);
    return data;
  });