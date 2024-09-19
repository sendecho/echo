'use server'

import { sendEmail } from '@/emails'
import BroadcastEmail from '@/emails/broadcast-email'
import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types'

const supabase = createClient()

type Email = Database['public']['Tables']['emails']['Row']

interface CreateOrUpdateEmailMutationProps extends Omit<Email, 'id' | 'account_id' | 'created_at' | 'updated_at' | 'sent_at'> {
  id: string | null
  account_id: string
}

export async function createOrUpdateEmailMutation({ id, subject, content, preview, account_id, from_name, from_email }: CreateOrUpdateEmailMutationProps) {
  if (id) {
    const { data, error } = await supabase
      .from('emails')
      .update({ subject, content, preview, from_name, from_email })
      .eq('id', id)
      .select()
      .single()
      .throwOnError()

    if (error) throw new Error(`Failed to update email: ${error.message}`)
    return data
  } else {
    console.log('Creating new email')
    const { data, error } = await supabase
      .from('emails')
      .insert({ subject, content, preview, account_id, from_name, from_email })
      .select()
      .single()
      .throwOnError()

    console.log(data, error)

    if (error) throw new Error(`Failed to create email: ${error.message}`)
    return data
  }
}

interface SendBroadcastMutationProps {
  emailId: string
  contactIds: string[]
}

export async function sendBroadcastMutation({ emailId, contactIds }: SendBroadcastMutationProps) {
  // For each contact, send the emails content to the contact
  // Fetch the email content
  const { data: emailData, error: emailError } = await supabase
    .from('emails')
    .select('subject, content, preview, from_name, from_email')
    .eq('id', emailId)
    .single()

  if (emailError) throw new Error(`Failed to fetch email content: ${emailError.message}`)

  // Fetch the contacts' email addresses
  const { data: contactsData, error: contactsError } = await supabase
    .from('contacts')
    .select('id, email')
    .in('id', contactIds)

  if (contactsError) throw new Error(`Failed to fetch contact emails: ${contactsError.message}`)

  // Send emails using Resend
  for (const contact of contactsData) {
    try {
      const { data: sendData, error: sendError } = await sendEmail({
        from: `${emailData.from_name} <${emailData.from_email}>`,
        email: contact.email,
        subject: emailData.subject,
        react: BroadcastEmail({ subject: emailData.subject, content: emailData.content, preview: emailData.preview, unsubscribeId: contact.id }),
      })

      if (sendError) throw new Error(`Failed to send email: ${sendError.message}`)

      // if sent successfully, update the outbound_emails table
      await supabase
        .from('outbound_emails')
        .insert({ email_id: emailId, contact_id: contact.id, sent_at: new Date().toISOString() })
        .select()
        .throwOnError()

    } catch (error) {
      console.error(`Failed to send email to ${contact.email}:`, error)
      // Consider adding error handling or logging here
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
      react: BroadcastEmail({ subject: emailData.subject, content: emailData.content, preview: emailData.preview, unsubscribeId: '' }),
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