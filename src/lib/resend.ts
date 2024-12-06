import { Resend } from 'resend'
import type { DomainStatus } from "@/types/domain";

const resend = new Resend(process.env.RESEND_API_KEY)

function mapResendStatus(resendStatus: string): DomainStatus {
  switch (resendStatus) {
    case "verified":
      return "verified";
    case "pending":
    case "temporary_failure":
      return "pending";
    case "failed":
      return "failed";
    default:
      return "unverified";
  }
}

export async function triggerDomainVerification(domainId: string) {
  const result = await resend.domains.verify(domainId)
  return result
}

export async function getDomainDetails(domainId: string) {
  const result = await resend.domains.get(domainId)
  return {
    ...result,
    data: result.data ? {
      ...result.data,
      status: mapResendStatus(result.data.status)
    } : null
  };
}