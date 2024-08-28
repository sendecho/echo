import { JSXElementConstructor, ReactElement } from "react";
import { Resend } from "resend";
import postmark from "postmark";

const USE_POSTMARK = process.env.USE_POSTMARK === 'true';

const resend = new Resend(process.env.RESEND_API_KEY || '');
const postmarkServerClient = new postmark.ServerClient(process.env.POSTMARK_SERVER_API_KEY || '');
const postmarkAccountClient = new postmark.AccountClient(process.env.POSTMARK_ACCOUNT_API_KEY || '');

const TEST_EMAIL = process.env.TEST_EMAIL || process.env.NODE_ENV === 'development';

console.log(TEST_EMAIL)

interface SendEmailProps {
  email: string;
  subject: string;
  react: ReactElement<any, string | JSXElementConstructor<any>>;
}

export const sendEmail = async ({ email, subject, react }: SendEmailProps) => {
  const toEmail = TEST_EMAIL ? "delivered@resend.dev" : email;

  if (USE_POSTMARK) {
    const htmlContent = await renderReactToString(react);
    return await postmarkServerClient.sendEmail({
      From: "Ryan <ryan@voyage.dev>",
      To: toEmail,
      Subject: subject,
      HtmlBody: htmlContent,
    });
  } else {
    return await resend.emails.send({
      from: "Ryan <ryan@voyage.dev>",
      to: [toEmail],
      subject: subject,
      react: react,
    });
  }
};

interface CreateDomainProps {
  domain: string;
}

export async function createDomain({ domain }: CreateDomainProps): Promise<{ success: boolean; message: string }> {
  try {
    if (USE_POSTMARK) {
      const result = await postmarkAccountClient.createDomain({ Name: domain });
      return {
        success: result.DKIMVerified && result.ReturnPathDomainVerified && result.SPFVerified,
        message: `Domain ${domain} created in Postmark. Please verify DNS records.`,
      };
    } else {
      const result = await resend.domains.create({ name: domain });
      if (result.error) {
        throw new Error(result.error.message);
      }
      return {
        success: true,
        message: `Domain ${domain} created in Resend. Please verify DNS records.`,
      };
    }
  } catch (error) {
    console.error('Error creating domain:', error);
    return {
      success: false,
      message: `Failed to create domain ${domain}. ${error instanceof Error ? error.message : 'Unknown error occurred.'}`,
    };
  }
}


// Helper function to render React component to string (you'll need to implement this)
async function renderReactToString(component: ReactElement): Promise<string> {
  // Implement the logic to render React component to string
  // You might want to use a library like react-dom/server for this

  throw new Error("Not implemented");
}
