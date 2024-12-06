import { getDomainDetails } from "@/lib/resend";
import DomainVerification from "@/components/domain-verification";
import { getUser } from "@/lib/supabase/queries/user.cached";
import { fetchAccountSettings } from "@/lib/supabase/queries/account-settings";
import { redirect } from "next/navigation";

export const metadata = {
	title: "Domain Verification",
	description: "Verify your domain to send emails",
};

export default async function DomainVerificationPage() {
	const user = await getUser();

	const accountData = await fetchAccountSettings(
		user?.data?.account_id || undefined,
	);

	if (!accountData) {
		redirect("/onboarding/account-details");
	}

	const domainData = await getDomainDetails(accountData?.resend_domain_id);

	if (domainData && domainData?.data?.status === "verified") {
		redirect("/onboarding/mailing-address");
	}

	return (
		<div className="space-y-4 max-w-4xl mx-auto">
			<DomainVerification domainData={domainData?.data} />
		</div>
	);
}
