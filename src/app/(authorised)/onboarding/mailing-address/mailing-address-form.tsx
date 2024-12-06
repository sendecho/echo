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
import { mailingAddressSchema } from "@/lib/schemas/onboarding-schema";
import { mailingAddressAction } from "@/actions/onboarding-actions";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";

interface MailingAddressFormProps {
	initialMailingAddress: {
		street_address: string;
		city: string;
		state: string;
		postal_code: string;
		country: string;
	};
}

export default function MailingAddressForm({
	initialMailingAddress,
}: MailingAddressFormProps) {
	const router = useRouter();
	const methods = useForm({
		resolver: zodResolver(mailingAddressSchema),
		defaultValues: initialMailingAddress,
	});

	const { execute, status } = useAction(mailingAddressAction, {
		onSuccess: () => {
			toast({ title: "Mailing address updated successfully" });
			router.push("/dashboard");
		},
		onError: (error) => {
			if (error && typeof error === "object" && "message" in error) {
				toast({
					title: "Error",
					description: error.message as string,
					variant: "destructive",
				});
			} else {
				toast({
					title: "Error",
					description: "An unknown error occurred",
					variant: "destructive",
				});
			}
		},
	});

	const onSubmit = methods.handleSubmit((data) => execute(data));

	return (
		<FormProvider {...methods}>
			<Card className="w-full max-w-2xl mx-auto bg-transparent border-none">
				<CardHeader>
					<CardTitle>Mailing Address</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={onSubmit} className="space-y-4">
						<FormField
							control={methods.control}
							name="street_address"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Street Address</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={methods.control}
							name="city"
							render={({ field }) => (
								<FormItem>
									<FormLabel>City</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={methods.control}
							name="state"
							render={({ field }) => (
								<FormItem>
									<FormLabel>State</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={methods.control}
							name="postal_code"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Postal Code</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={methods.control}
							name="country"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Country</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button
						variant="outline"
						onClick={() => router.push("/onboarding/domain-verification")}
					>
						Back
					</Button>
					<SubmitButton
						onClick={onSubmit}
						disabled={status === "executing"}
						isSubmitting={status === "executing"}
					>
						{status === "executing" ? "Submitting..." : "Next"}
					</SubmitButton>
				</CardFooter>
			</Card>
		</FormProvider>
	);
}
