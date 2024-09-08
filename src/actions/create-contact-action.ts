"use server";

import { z } from 'zod';
import { actionClient, authSafeAction } from "@/lib/safe-action";
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const supabase = createClient();

const schema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
  country: z.string().optional(),
});

export const createContactAction = authSafeAction
  .schema(schema)
  .metadata({ name: 'create-contact' })
  .action(
    async ({ parsedInput, ctx: { user } }) => {
      const { data, error } = await supabase
        .from('contacts')
        .insert({ ...parsedInput, account_id: user.account_id })
        .select()
        .single()
        .throwOnError();

      if (error) {
        throw new Error('Failed to add contact');
      }

      revalidatePath('/dashboard/contacts');

      return data;
    });
