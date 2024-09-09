import { fetchAccountSettings } from '@/lib/supabase/queries/account-settings'
import { getUser } from '@/lib/supabase/queries/user.cached'
import { DomainSettings } from '@/components/settings/domain'
import { FromNameSettings } from '@/components/settings/from-name'
import { MailingAddressSettings } from '@/components/settings/mailing-address'
import { AccountNameSettings } from '@/components/settings/account-name'

export default async function SettingsPage() {
  const user = await getUser()
  const accountSettings = await fetchAccountSettings(user?.data?.account_id as string)

  return (
    <div className="space-y-12">
      <AccountNameSettings name={accountSettings.name} />
      <DomainSettings domain={accountSettings.domain} />
      <FromNameSettings fromName={accountSettings.from_name} />
      <MailingAddressSettings
        streetAddress={accountSettings.street_address}
        city={accountSettings.city}
        state={accountSettings.state}
        postalCode={accountSettings.postal_code}
        country={accountSettings.country}
      />
    </div>
  )
}