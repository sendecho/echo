'use server'

import { sendEmail } from '@/emails'
import BroadcastEmail from '@/emails/broadcast-email'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types'
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient()

type Email = Database['public']['Tables']['emails']['Row']


export async function createEmail({ account_id, from_name, from_email }: { account_id: string, from_name: string, from_email: string }) {
  // Otherwise create a new email
  const { data, error } = await supabase
    .from('emails')
    .insert({ account_id, from_name, from_email })
    .select()
    .single()
    .throwOnError()

  if (error) throw new Error(`Failed to create email: ${error.message}`)
  return data.id
}

interface updateEmailMutationProps {
  id: string
  subject?: string | null
  content?: string | null
  preview?: string | null
  from_name?: string | null
  from_email?: string | null
}

export async function updateEmailMutation({ id, subject, content, preview, from_name, from_email }: updateEmailMutationProps) {
  const { data, error } = await supabase
    .from('emails')
    .update({ subject, content, preview, from_name, from_email })
    .eq('id', id)
    .select()
    .single()
    .throwOnError()

  if (error) throw new Error(`Failed to update email: ${error.message}`)
  return data
}

interface SendBroadcastMutationProps {
  emailId: string
  listIds?: string[]
  contactIds?: string[]
}

export async function sendBroadcastMutation({ emailId, listIds, contactIds }: SendBroadcastMutationProps) {
  // Fetch the email content
  const { data: emailData, error: emailError } = await supabase
    .from('emails')
    .select('subject, content, preview, from_name, from_email')
    .eq('id', emailId)
    .single()

  if (emailError) throw new Error(`Failed to fetch email content: ${emailError.message}`)

  // Fetch contacts from individual contactIds
  const { data: individualContacts, error: individualContactsError } = await supabase
    .from('contacts')
    .select('id, first_name, last_name, email')
    .in('id', contactIds ?? [])

  if (individualContactsError) throw new Error(`Failed to fetch individual contacts: ${individualContactsError.message}`)

  // Fetch contacts from listIds
  const { data: listContacts, error: listContactsError } = await supabase
    .from('list_contacts')
    .select('contacts(id, first_name, last_name, email)')
    .in('list_id', listIds ?? [])

  if (listContactsError) throw new Error(`Failed to fetch list contacts: ${listContactsError.message}`)

  // Combine and deduplicate contacts
  const allContacts = [
    ...individualContacts,
    ...listContacts.map(lc => lc.contacts).filter(Boolean)
  ].filter((contact, index, self) =>
    index === self.findIndex((t) => t.id === contact.id)
  )

  // Send emails using Resend
  for (const contact of allContacts) {
    try {
      const trackingId = uuidv4(); // Generate a unique tracking ID

      const variables = {
        first_name: contact?.first_name || '',
        last_name: contact?.last_name || '',
        email: contact?.email || '',
        // Add more variables as needed
      };

      const { data: sendData, error: sendError } = await sendEmail({
        from: `${emailData.from_name} <${emailData.from_email}>`,
        email: contact.email,
        subject: emailData.subject,
        react: BroadcastEmail({
          content: emailData.content,
          preview: emailData.preview,
          unsubscribeId: contact.id,
          variables,
          trackingId, // Add the tracking ID here
        }),
      })

      if (sendError) throw new Error(`Failed to send email: ${sendError.message}`)

      // Update the outbound_emails table with the tracking ID
      await supabase
        .from('outbound_emails')
        .insert({
          email_id: emailId,
          contact_id: contact.id,
          sent_at: new Date().toISOString(),
          resend_id: sendData?.id,
          tracking_id: trackingId, // This should now be a UUID
        })
        .select()
        .throwOnError()

    } catch (error) {
      console.error(`Failed to send email to ${contact.email}:`, error)
    }
  }

  // Update the broadcast status to sent
  const { error: updateError } = await supabase
    .from('emails')
    .update({ sent_at: new Date().toISOString() })
    .eq('id', emailId)

  if (updateError) throw new Error(`Failed to update broadcast status: ${updateError.message}`)

  return { success: true, emailId }
}

interface SendPreviewBroadcastMutationProps {
  emailId: string
  emailAddress: string
}

export async function sendPreviewBroadcastMutation({ emailId, emailAddress }: SendPreviewBroadcastMutationProps) {
  console.log('Sending preview broadcast to', emailAddress)
  console.log('Email ID:', emailId)
  // Fetch the email content
  const { data: emailData, error: emailError } = await supabase
    .from('emails')
    .select('subject, content, preview, from_name, from_email')
    .eq('id', emailId)
    .single()

  if (emailError) throw new Error(`Failed to fetch email content: ${emailError.message}`)

  try {
    const { data: sendData, error: sendError } = await sendEmail({
      from: `${emailData.from_name} <${emailData.from_email}>`,
      email: emailAddress,
      subject: emailData.subject,
      react: BroadcastEmail({
        content: emailData.content,
        preview: emailData.preview,
        unsubscribeId: '',
        variables: {}
      }),
    })

    if (sendError) throw new Error(`Failed to send email: ${sendError.message}`)

  } catch (error) {
    console.error(`Failed to send email to ${emailAddress}:`, error)
  }

  return { success: true }
}

export async function duplicateBroadcast(id: string, newSubject: string) {

  // Fetch the original email
  const { data: originalEmail, error: fetchError } = await supabase
    .from('emails')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError) throw fetchError

  // Create a new email with copied data
  const { data: newEmail, error: insertError } = await supabase
    .from('emails')
    .insert({
      ...originalEmail,
      id: undefined, // Let Supabase generate a new ID
      subject: newSubject,
      sent_at: null, // Ensure the new broadcast is not marked as sent
      created_at: new Date().toISOString(), // Set the current timestamp
    })
    .select()
    .single()

  if (insertError) throw insertError

  return newEmail
}