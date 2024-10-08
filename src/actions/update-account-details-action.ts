'use server'

import { z } from 'zod'
import { authSafeAction } from "@/lib/safe-action"
import { createClient } from '@/lib/supabase/server'
import { revalidateTag } from 'next/cache'

const schema = z.any(); // We'll validate manually since we're using FormData

export const updateAccountDetailsAction = authSafeAction
  .schema(schema)
  .metadata({
    name: 'update-account-details',
  })
  .action(async ({ parsedInput, ctx: { user } }) => {
    if (!(parsedInput instanceof FormData)) {
      throw new Error('Invalid input');
    }

    const full_name = parsedInput.get('full_name');
    const avatar = parsedInput.get('avatar');

    if (typeof full_name !== 'string' || full_name.length === 0) {
      throw new Error('Name is required');
    }

    const supabase = createClient()

    let avatar_url = undefined

    if (avatar instanceof File) {
      const fileExt = avatar.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`

      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatar)

        if (uploadError) {
          console.error("Avatar upload error:", uploadError);
          throw new Error('Failed to upload avatar');
        }

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName)

        avatar_url = publicUrl
      } catch (error) {
        throw new Error('Failed to process avatar');
      }
    }

    try {
      const updateData: { full_name: string; avatar_url?: string } = { full_name };
      if (avatar_url) {
        updateData.avatar_url = avatar_url;
      }

      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        throw new Error('Failed to update account details');
      }

      // Revalidate the user cache
      revalidateTag(`user_${user.id}`);

      return data;
    } catch (error) {
      throw new Error('Failed to update user data');
    }
  })