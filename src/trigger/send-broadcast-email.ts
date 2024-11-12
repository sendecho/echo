import { logger, task, wait } from "@trigger.dev/sdk/v3"
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/emails";
import { v4 as uuidv4 } from "uuid";
import BroadcastEmail from "@/emails/broadcast-email";

export const sendBroadcastEmail = task({
  id: "send-broadcast-email",
  queue: {
    concurrencyLimit: 2,
  },
  run: async (payload: { emailId: string, emailData: { from_name: string, from_email: string, subject: string, content: string, preview: string }, contact: { id: string, first_name?: string, last_name?: string, email: string } }, { ctx }) => {

    const { emailId, emailData, contact } = payload;

    const supabase = createAdminClient();

    const trackingId = uuidv4(); // Generate a unique tracking ID

    const variables = {
      first_name: contact?.first_name || '',
      last_name: contact?.last_name || '',
      email: contact?.email || '',
      // Add more variables as needed
    };

    const { data: sendData, error: sendError } = await logger.trace("Send email", async (span) => {
      // Set attributes for trigger
      span.setAttributes({
        id: contact?.id,
        email: contact?.email,
      })

      // Wait for 5 seconds to avoid rate limiting
      await wait.for({ seconds: 5 });

      // Send the email
      return await sendEmail({
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
    });

    if (sendError) throw new Error(`Failed to send email: ${sendError.message}`)

    // Update the outbound_emails table with the tracking ID
    const { data: updateData, error: updateError } = await logger.trace("Update outbound emails", async () => {
      return await supabase
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
    })

    if (updateError) throw new Error(`Failed to update outbound emails: ${updateError.message}`)

    return updateData

  }
})