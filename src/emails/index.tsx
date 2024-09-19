import { JSXElementConstructor, ReactElement } from "react";
import { Resend } from "resend";
import { env } from "@/env";

const resend = new Resend(env.RESEND_API_KEY || '');

const SEND_TO_TEST_EMAIL = env.USE_TEST_EMAIL === true || (env.NODE_ENV === 'development' && env.USE_TEST_EMAIL !== false);

interface SendEmailProps {
  from?: string;
  email: string;
  subject: string;
  react: ReactElement<any, string | JSXElementConstructor<any>>;
}

export const sendEmail = async ({ from = "Echo <no-reply@sendecho.co>", email, subject, react }: SendEmailProps) => {
  const toEmail = SEND_TO_TEST_EMAIL ? "delivered@resend.dev" : email;

  return await resend.emails.send({
    from: from,
    to: [toEmail],
    subject: subject,
    react: react,
  });
};
