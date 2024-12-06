import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AccountDetailsData } from "@/lib/schemas/onboarding-schema";
import { FormDescription } from "./ui/form";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircleIcon } from "lucide-react";

export default function AccountDetails() {
	const {
		register,
		formState: { errors },
	} = useFormContext<AccountDetailsData>();

	return (
		<div className="space-y-8">
			<div className="flex flex-col gap-2">
				<Label htmlFor="name">Account name</Label>
				<Input id="name" {...register("name")} placeholder="Echo" />
				<FormDescription>
					This is the name of your account that will be used in the emails.
				</FormDescription>
				{errors.name && (
					<p className="text-sm text-red-500">{errors.name.message}</p>
				)}
			</div>
			<div className="flex flex-col gap-2">
				<Label htmlFor="domain">Domain name</Label>
				<Input id="domain" {...register("domain")} placeholder="sendecho.co" />
				<FormDescription>
					This is the domain name that will be used to send the emails.
				</FormDescription>

				<Alert className="mt-4 text-muted-foreground border-muted">
					<AlertCircleIcon className="h-4 w-4" />
					<AlertDescription>
						We recommend using a subdomain for your account to avoid any issues
						with email providers.
					</AlertDescription>
				</Alert>

				{errors.domain && (
					<p className="text-sm text-red-500">{errors.domain.message}</p>
				)}
			</div>
		</div>
	);
}
