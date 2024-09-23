"use client";

import { SettingsCard } from "./settings-card";
import { Button } from "../ui/button";
import { customerPortalAction } from "@/lib/payments/actions";

export function BillingSettings({ account }: { account: any }) {
	return (
		<SettingsCard name="Subscription" description="Manage your subscription">
			<div className="space-y-4">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
					<div className="mb-4 sm:mb-0">
						<p className="font-medium">
							Current Plan: {account.plan_name || "Free"}
						</p>
						<p className="text-sm text-muted-foreground">
							{account.subscription_status === "active"
								? "Billed monthly"
								: account.subscription_status === "trialing"
									? "Trial period"
									: "No active subscription"}
						</p>
					</div>
					<form action={() => customerPortalAction(null, account)}>
						<Button type="submit" variant="outline">
							Manage Subscription
						</Button>
					</form>
				</div>
			</div>
		</SettingsCard>
	);
}
