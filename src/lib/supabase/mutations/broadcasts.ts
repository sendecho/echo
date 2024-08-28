'use server'

import { sendEmail } from '@/emails'
import { createClient } from '@/lib/supabase/server'

const supabase = createClient()

export async function createOrUpdateEmailMutation(id: number | null, subject: string, content: string) {
  if (id) {
    const { data, error } = await supabase
      .from('emails')
      .update({ subject, content })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(`Failed to update email: ${error.message}`)
    return data
  } else {
    const { data, error } = await supabase
      .from('emails')
      .insert({ subject, content })
      .select()
      .single()
      .throwOnError()

    console.log(data, error)

    if (error) throw new Error(`Failed to create email: ${error.message}`)
    return data
  }
}

export async function sendBroadcastMutation(emailId: number, contactIds: number[]) {
  // For each contact, send the emails content to the contact
  // Fetch the email content
  const { data: emailData, error: emailError } = await supabase
    .from('emails')
    .select('subject, content')
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
        email: contact.email,
        subject: emailData.subject,
        react: emailData.content,
      })

      if (sendError) throw new Error(`Failed to send email: ${sendError.message}`)

      console.log(sendData)

      // if sent successfully, update the outbound_emails table
      await supabase
        .from('outbound_emails')
        .update({ sent_at: new Date().toISOString() })
        .eq('id', contact.id)


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
