import { JSXElementConstructor, ReactElement } from "react";
import { Resend } from "resend";
import { env } from "@/env";

const resend = new Resend(env.RESEND_API_KEY || '');
const TEST_EMAIL = env.TEST_EMAIL || env.NODE_ENV === 'development';

console.log("TEST_EMAIL", TEST_EMAIL);

interface SendEmailProps {
  from?: string;
  email: string;
  subject: string;
  react: ReactElement<any, string | JSXElementConstructor<any>>;
}

export const sendEmail = async ({ from = "Ryan O'Hara <ryan@voyage.dev>", email, subject, react }: SendEmailProps) => {
  const toEmail = TEST_EMAIL ? "delivered@resend.dev" : email;

  return await resend.emails.send({
    from: from,
    to: [toEmail],
    subject: subject,
    react: react,
  });
};
