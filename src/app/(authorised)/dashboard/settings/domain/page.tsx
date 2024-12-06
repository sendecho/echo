import { getDomainDetails } from "@/lib/resend";
import { DomainSettings } from "@/components/domain-settings";
import { getUser } from "@/lib/supabase/queries/user.cached";
import { fetchDomainSettings } from "@/lib/supabase/queries/account-settings";
import { redirect } from "next/navigation";

export const metadata = {
	title: "Domain Settings",
	description: "Configure your custom domain for sending emails",
};

export default async function DomainSettingsPage() {
	const user = await getUser();

	if (!user?.data?.account_id) {
		redirect("/onboarding/account-details");
	}

	const domainSettings = await fetchDomainSettings(user.data.account_id);

	let domainData = null;
	if (domainSettings?.domain) {
		domainData = await getDomainDetails(domainSettings.resend_domain_id);
	}

	return (
		<DomainSettings
			account={{ id: user?.data?.account_id, ...domainSettings }}
			domainData={domainData?.data}
		/>
	);
}
