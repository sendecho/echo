import { getDomainData } from '@/lib/resend'
import DomainVerification from '@/components/domain-verification'
import { getUser } from '@/lib/supabase/queries/user.cached';
import { fetchAccountSettings } from '@/lib/supabase/queries/account-settings';
import { redirect } from 'next/navigation';

export default async function DomainVerificationPage() {
  const user = await getUser();
  const accountData = await fetchAccountSettings(user?.data?.account_id || undefined)
  const domainData = await getDomainData(accountData?.resend_domain_id)

  if (domainData && domainData.status === 'verified') {
    redirect('/onboarding/mailing-address')
  }

  return <DomainVerification domainData={domainData} />
}