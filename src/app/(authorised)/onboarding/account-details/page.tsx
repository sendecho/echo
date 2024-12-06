import { Suspense } from "react";
import { fetchAccountSettings } from "@/lib/supabase/queries/account-settings";
import AccountDetailsForm from "./account-details-form";
import { getUser } from "@/lib/supabase/queries/user.cached";

export default async function AccountDetailsPage() {
	const user = await getUser();
	const accountData = await fetchAccountSettings(
		user?.data?.account_id || undefined,
	);

	const initialData = {
		name: null,
		domain: user?.data?.email?.split("@")[1],
	};

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<AccountDetailsForm
				initialData={
					accountData
						? {
								name: accountData.name,
								domain: accountData.domain,
							}
						: initialData
				}
			/>
		</Suspense>
	);
}
