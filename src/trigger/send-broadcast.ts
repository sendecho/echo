import { logger, task, tasks, wait } from "@trigger.dev/sdk/v3";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/emails";
import { v4 as uuidv4 } from "uuid";
import BroadcastEmail from "@/emails/broadcast-email";
import type { sendBroadcastEmail } from "./send-broadcast-email";

export const sendBroadcastTask = task({
  id: "send-broadcast",
  maxDuration: 300, // 5 minutes
  run: async (payload: { emailId: string, listIds?: string[], contactIds?: string[] }, { ctx }) => {

    logger.info("Sending broadcast", { payload, ctx });

    const { emailId, listIds, contactIds } = payload;

    const supabase = createAdminClient();

    // Fetch the email content
    const { data: emailData, error: emailError } = await logger.trace("Fetch email content", async () => {
      return await supabase
        .from('emails')
        .select('subject, content, preview, from_name, from_email')
        .eq('id', emailId)
        .single()
    });

    if (emailError) throw new Error(`Failed to fetch email content: ${emailError.message}`)

    // Fetch contacts from individual contactIds
    const { data: individualContacts, error: individualContactsError } = await logger.trace("Fetch individual contacts", async () => {
      return await supabase
        .from('contacts')
        .select('id, first_name, last_name, email')
        .in('id', contactIds ?? [])
    })

    if (individualContactsError) throw new Error(`Failed to fetch individual contacts: ${individualContactsError.message}`)

    // Fetch contacts from listIds
    const { data: listContacts, error: listContactsError } = await logger.trace("Fetch list contacts", async () => {
      return await supabase
        .from('list_contacts')
        .select('contacts(id, first_name, last_name, email)')
        .in('list_id', listIds ?? [])
    })

    if (listContactsError) throw new Error(`Failed to fetch list contacts: ${listContactsError.message}`)

    // Combine and deduplicate contacts
    const allContacts = [
      ...individualContacts,
      ...listContacts.map(lc => lc.contacts).filter(Boolean)
    ].filter((contact, index, self) =>
      index === self.findIndex((t) => t.id === contact.id)
    )

    if (allContacts.length === 0) throw new Error("No contacts found")

    await tasks.batchTrigger<typeof sendBroadcastEmail>("send-broadcast-email", allContacts.map(contact => ({
      payload: {
        emailId,
        emailData: {
          from_name: emailData.from_name ?? '',
          from_email: emailData.from_email ?? '',
          subject: emailData.subject ?? '',
          content: emailData.content ?? '',
          preview: emailData.preview ?? '',
        },
        contact: {
          id: contact.id,
          first_name: contact?.first_name,
          last_name: contact?.last_name,
          email: contact.email,
        }
      }
    })))

    // Update the broadcast status to sent
    const { error: updateError } = await logger.trace("Update broadcast status", async () => {
      return await supabase
        .from('emails')
        .update({ sent_at: new Date().toISOString() })
        .eq('id', emailId)
    })

    if (updateError) throw new Error(`Failed to update broadcast status: ${updateError.message}`)

    return { success: true, emailId }
  },
});