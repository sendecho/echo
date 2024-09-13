import { getUser } from '@/lib/supabase/queries/user.cached';
import { fetchAccountSettings } from '@/lib/supabase/queries/account-settings';
import { redirect } from 'next/navigation';
import MailingAddressForm from './mailing-address-form';

export default async function MailingAddressPage() {
  const user = await getUser();
  const accountData = await fetchAccountSettings(user?.data?.account_id || undefined);

  if (!accountData) {
    redirect('/onboarding/domain-verification');
  }

  const {
    street_address,
    city,
    state,
    postal_code,
    country
  } = accountData;

  const initialMailingAddress = {
    street_address: street_address || '',
    city: city || '',
    state: state || '',
    postal_code: postal_code || '',
    country: country || ''
  };

  return <MailingAddressForm initialMailingAddress={initialMailingAddress} />;
}