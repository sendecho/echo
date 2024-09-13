import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function getDomainData(domain: string) {
  try {
    const { data: domainData } = await resend.domains.get(domain)
    return domainData
  } catch (error) {
    console.error('Error checking domain verification status:', error)
    return false
  }
}

export async function verifyDomainResend(domainId: string) {
  const result = await resend.domains.verify(domainId)
  return result
}