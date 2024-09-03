"use server";

import { z } from 'zod';
import { actionClient, authSafeAction } from "@/lib/safe-action";
import { createClient } from '@/lib/supabase/server';
import { revalidatePath, revalidateTag } from 'next/cache';

const supabase = createClient();

const schema = z.object({
  first_name: z.string().min(1, 'First name is required').optional(),
  last_name: z.string().min(1, 'Last name is required').optional(),
  email: z.string().email('Invalid email address'),
});

export const createContactAction = authSafeAction
  .schema(schema)
  .metadata({ name: 'create-contact' })
  .action(
    async ({ parsedInput: { first_name, last_name, email }, ctx: { user } }) => {
      const { data, error } = await supabase
        .from('contacts')
        .insert({ first_name, last_name, email, account_id: user.account_id })
        .select()
        .single();

      if (error) {
        throw new Error('Failed to add contact');
      }

      revalidateTag('contacts');

      return data;
    });
