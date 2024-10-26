"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateAccountDetailsAction } from "@/actions/update-account-details-action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAction } from "next-safe-action/hooks";
import { SettingsCard } from "@/components/settings/settings-card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

const schema = z.object({
	full_name: z.string().min(1, "Name is required"),
	avatar: z.any().optional(),
	email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof schema>;

interface AccountDetailsProps {
	initialData: {
		full_name: string;
		avatar_url?: string | null;
		email: string;
	};
}

export function AccountDetails({ initialData }: AccountDetailsProps) {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(
		initialData.avatar_url || null,
	);

	const { executeAsync, status } = useAction(updateAccountDetailsAction, {
		onSuccess: (data) => {
			toast({
				title: "Success",
				description: "Your account details have been updated.",
			});
			router.refresh();
		},
		onError: (error) => {
			toast({
				title: "Error",
				description: error.error.serverError || "An error occurred",
				variant: "destructive",
			});
		},
	});

	const form = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			full_name: initialData.full_name,
			email: initialData.email,
		},
	});

	const onSubmit = async (data: FormData) => {
		const formData = new FormData();
		formData.append("full_name", data.full_name);
		if (data.avatar instanceof File) {
			formData.append("avatar", data.avatar);
		}
		await executeAsync(formData);
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			form.setValue("avatar", file);
			const reader = new FileReader();
			reader.onloadend = () => {
				const result = reader.result as string;
				setPreviewUrl(result);
			};
			reader.readAsDataURL(file);
		}
	};

	const triggerFileInput = () => {
		fileInputRef?.current?.click();
	};

	return (
		<SettingsCard
			name="Account Details"
			description="View and manage your account details"
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<div>
						<FormField
							control={form.control}
							name="avatar"
							render={({ field: { value, onChange, ...field } }) => (
								<FormItem>
									<FormLabel>Avatar</FormLabel>
									<FormControl>
										<div className="flex items-center space-x-4">
											<Avatar className="w-20 h-20">
												<AvatarImage
													src={previewUrl || undefined}
													alt="Avatar"
												/>
												<AvatarFallback>
													{initialData.full_name?.charAt(0).toUpperCase() || ""}
												</AvatarFallback>
											</Avatar>
											<Button
												type="button"
												variant="outline"
												onClick={triggerFileInput}
											>
												Change Avatar
											</Button>
											<input
												type="file"
												ref={fileInputRef}
												className="hidden"
												accept="image/*"
												onChange={(e) => {
													handleFileChange(e);
													onChange(e.target.files?.[0] || null);
												}}
											/>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div>
						<FormField
							control={form.control}
							name="full_name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input {...field} disabled readOnly />
									</FormControl>
									<FormDescription>
										If you need to change your email address, please contact{" "}
										<a
											href="mailto:hello@sendecho.co?subject=Change%20Email%20Address"
											className="text-primary underline"
										>
											support
										</a>
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="flex justify-end space-x-2">
						<SubmitButton type="submit" isSubmitting={status === "executing"}>
							Save
						</SubmitButton>
					</div>
				</form>
			</Form>
		</SettingsCard>
	);
}
