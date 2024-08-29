'use server'

import { z } from 'zod'
import { actionClient } from "@/lib/safe-action"
import { createClient } from '@/lib/supabase/server'

const listSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  contactIds: z.array(z.number()).optional(),
})

export const createListAction = actionClient
  .schema(listSchema)
  .action(async ({ parsedInput: { contactIds, ...listData } }) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('lists')
      .insert(listData)
      .select()
      .single()
      .throwOnError()


    console.log(data, error)
    if (error) throw new Error(error.message)

    // If contactIds are provided, update the list_contacts table
    if (contactIds) {
      const listContactsInserts = contactIds.map(contactId => ({
        list_id: data.id,
        contact_id: contactId
      }));

      const { data: listContactsData, error: listContactsError } = await supabase
        .from('list_contacts')
        .insert(listContactsInserts)
        .select()
        .throwOnError();

      if (listContactsError) {
        throw new Error(listContactsError.message);
      }
    }

    return data
  })

export const updateListAction = actionClient
  .schema(listSchema.extend({ id: z.number() }))
  .action(async ({ parsedInput: { id, contactIds, ...updateData } }) => {

    const supabase = createClient()
    const { data, error } = await supabase
      .from('lists')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
      .throwOnError();

    if (error) throw new Error(error.message)

    // If contactIds are provided, update the list_contacts table
    if (contactIds) {
      // Fetch existing contact IDs for the list
      const { data: existingContacts, error: fetchError } = await supabase
        .from('list_contacts')
        .select('contact_id')
        .eq('list_id', id);

      if (fetchError) throw new Error(fetchError.message);

      const existingContactIds = new Set(existingContacts.map(c => c.contact_id));
      const newContactIds = new Set(contactIds);

      // Determine which contacts to add and remove
      const contactsToAdd = contactIds.filter(id => !existingContactIds.has(id));
      const contactsToRemove = Array.from(existingContactIds).filter(id => !newContactIds.has(id));

      // Add new contacts
      if (contactsToAdd.length > 0) {
        const { error: addError } = await supabase
          .from('list_contacts')
          .insert(contactsToAdd.map(contactId => ({ list_id: id, contact_id: contactId })));

        if (addError) throw new Error(addError.message);
      }

      // Remove contacts no longer in the list
      if (contactsToRemove.length > 0) {
        const { error: removeError } = await supabase
          .from('list_contacts')
          .delete()
          .eq('list_id', id)
          .in('contact_id', contactsToRemove);

        if (removeError) throw new Error(removeError.message);
      }
    }

    return data
  })

export const deleteListAction = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput }) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('lists')
      .delete()
      .eq('id', parsedInput.id)

    if (error) throw new Error(error.message)
    return { success: true }
  })
