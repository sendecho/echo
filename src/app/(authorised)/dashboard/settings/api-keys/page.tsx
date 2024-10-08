import { PageHeader } from "@/components/page-header";
import APIKeyItem from "@/components/settings/api-key-item";
import CreateAPIKeyButton from "@/components/settings/create-api-key-button";
import { fetchAPIKeys } from "@/lib/supabase/queries/account-settings";
import { getUser } from "@/lib/supabase/queries/user.cached";

export default async function APIKeysPage() {
	const user = await getUser();
	const apiKeys = await fetchAPIKeys(user?.data?.account_id as string);

	return (
		<div className="space-y-12">
			<PageHeader
				title="API Keys"
				actions={[<CreateAPIKeyButton key="create-api-key-button" />]}
			/>

			{apiKeys.length === 0 ? (
				<div>
					<p>No API Keys found</p>
					<p>Let&apos;s create your first key</p>
				</div>
			) : (
				<ul>
					{apiKeys
						.sort((a, b) => b.created_at.localeCompare(a.created_at))
						.map((apiKey) => (
							<li key={apiKey.id}>
								<APIKeyItem apiKey={apiKey} />
							</li>
						))}
				</ul>
			)}
		</div>
	);
}
