"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import AccountDetails from "@/components/account-details";
import {
	accountDetailsSchema,
	type AccountDetailsData,
} from "@/lib/schemas/onboarding-schema";
import { accountDetailsAction } from "@/actions/onboarding-actions";
import { toast } from "@/components/ui/use-toast";

interface AccountDetailsFormProps {
	initialData: AccountDetailsData | null;
}

export default function AccountDetailsForm({
	initialData,
}: AccountDetailsFormProps) {
	const router = useRouter();
	const methods = useForm<AccountDetailsData>({
		resolver: zodResolver(accountDetailsSchema),
		defaultValues: initialData || { name: "", domain: "" },
	});

	const { execute, status } = useAction(accountDetailsAction, {
		onSuccess: () => {
			toast({ title: "Account details completed successfully" });
			router.push("/onboarding/domain-verification");
		},
		onError: (error) =>
			toast({
				title: "Error",
				description: error?.error.serverError,
				variant: "destructive",
			}),
	});

	const onSubmit = methods.handleSubmit((data) => execute(data));

	return (
		<FormProvider {...methods}>
			<Card className="w-full max-w-2xl mx-auto bg-transparent border-none">
				<CardHeader>
					<CardTitle>Account Details</CardTitle>
				</CardHeader>
				<CardContent>
					<AccountDetails />
				</CardContent>
				<CardFooter className="flex justify-end">
					<Button onClick={onSubmit} disabled={status === "executing"}>
						{status === "executing" ? "Submitting..." : "Next"}
					</Button>
				</CardFooter>
			</Card>
		</FormProvider>
	);
}
