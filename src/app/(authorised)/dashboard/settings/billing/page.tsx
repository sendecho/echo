import { fetchAccountSettings } from "@/lib/supabase/queries/account-settings";
import { getUser } from "@/lib/supabase/queries/user.cached";
import { DomainSettings } from "@/components/settings/domain";
import { FromNameSettings } from "@/components/settings/from-name";
import { MailingAddressSettings } from "@/components/settings/mailing-address";
import { AccountNameSettings } from "@/components/settings/account-name";
import { BillingSettings } from "@/components/settings/billing-settings";
import PricingPage from "./pricing";
import PricingCard from "@/components/pricing-cards";

export default async function BillingPage() {
	const user = await getUser();
	const accountSettings = await fetchAccountSettings(
		user?.data?.account_id as string,
	);

	if (
		!accountSettings?.stripe_customer_id ||
		!accountSettings?.stripe_product_id
	) {
		return (
			<>
				<PricingCard
					user={user}
					accountId={user?.account_id}
					planName={accountSettings?.plan_name}
				/>
				{/* <PricingPage /> */}
			</>
		);
	}

	return (
		<div className="space-y-12">
			<BillingSettings account={accountSettings} />
		</div>
	);
}
