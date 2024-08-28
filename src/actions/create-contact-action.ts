"use server";

import { z } from 'zod';
import { actionClient } from "@/lib/safe-action";
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const supabase = createClient();

const schema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
});

export const createContactAction = actionClient
  .schema(schema)
  .action(
    async ({ parsedInput: { first_name, last_name, email } }) => {
      const { data, error } = await supabase
        .from('contacts')
        .insert({ first_name, last_name, email })
        .select()
        .single();

      if (error) {
        throw new Error('Failed to add contact');
      }

      revalidatePath('/dashboard', "layout");

      return data;
    });
