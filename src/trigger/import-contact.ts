import { createAdminClient } from "@/lib/supabase/admin";
import { upsertContactsMutation } from "@/lib/supabase/mutations/contacts";
import { logger, task } from "@trigger.dev/sdk/v3";
import { parse } from 'csv-parse/sync';

export const importContactCSVTask = task({
  id: "import-contacts-csv",
  run: async (payload: { fileContent: Buffer | string, accountId: string }, { ctx }) => {

    const supabase = createAdminClient();

    logger.info("Importing contact CSV", { payload, ctx });
    const { fileContent, accountId } = payload;

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    })

    const contacts = records.map((record: any) => ({
      first_name: record.first_name,
      last_name: record.last_name,
      email: record.email,
      phone_number: record.phone_number,
      account_id: accountId,
      source: 'import',
      lists: record.lists ? record.lists.split(',').map((list: string) => list.trim()) : []
    }))

    const { data, error } = await supabase
      .from('contacts')
      .upsert(contacts.map(({ lists, ...contact }) => contact), {
        onConflict: 'email,account_id',
        ignoreDuplicates: false
      })
      .select()

    if (error) throw new Error(`Failed to upsert contacts: ${error.message}`)

    // Handle list assignments
    for (const contact of contacts) {
      if (contact.lists && contact.lists.length > 0) {
        const contactData = data.find(c => c.email === contact.email)
        if (contactData) {
          const { error: listError } = await supabase
            .from('list_contacts')
            .upsert(
              contact.lists.map(listId => ({
                contact_id: contactData.id,
                list_id: listId
              })),
              { onConflict: 'contact_id,list_id' }
            )
          if (listError) {
            console.error(`Failed to assign lists for contact ${contactData.email}:`, listError)
            // Consider whether to throw an error here or continue with other contacts
          }
        }
      }
    }


    logger.info("Imported contacts", { data, ctx });
    return { success: true, count: data.length }
  },
});
