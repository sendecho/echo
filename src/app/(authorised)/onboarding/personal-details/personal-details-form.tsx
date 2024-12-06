"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalDetailsSchema } from "@/lib/schemas/onboarding-schema";
import { useRouter } from "next/navigation";
import { personalDetailsAction } from "@/actions/onboarding-actions";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/lib/supabase/client";
import { User2Icon } from "lucide-react";

interface PersonalDetailsFormValues {
	fullName: string;
	avatar?: FileList;
}

export function PersonalDetailsForm() {
	const router = useRouter();
	const { toast } = useToast();
	const [isUploading, setIsUploading] = useState(false);
	const [avatarUrl, setAvatarUrl] = useState<string>("");

	const form = useForm<PersonalDetailsFormValues>({
		resolver: zodResolver(personalDetailsSchema),
		defaultValues: {
			fullName: "",
		},
	});

	async function onSubmit(data: PersonalDetailsFormValues) {
		try {
			setIsUploading(true);
			let finalAvatarUrl = avatarUrl;

			// Handle avatar upload if a new file is selected
			if (data.avatar?.[0]) {
				const supabase = createClient();
				const file = data.avatar[0];
				const fileExt = file.name.split(".").pop();
				const fileName = `${Math.random()}.${fileExt}`;

				const { data: uploadData, error: uploadError } = await supabase.storage
					.from("avatars")
					.upload(fileName, file);

				if (uploadError) throw uploadError;

				const {
					data: { publicUrl },
				} = supabase.storage.from("avatars").getPublicUrl(fileName);

				finalAvatarUrl = publicUrl;
			}

			// Update user details
			await personalDetailsAction({
				fullName: data.fullName,
				avatarUrl: finalAvatarUrl,
			});

			toast({
				title: "Success",
				description: "Your personal details have been updated.",
			});

			router.push("/onboarding/account-details");
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to update personal details. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsUploading(false);
		}
	}

	return (
		<div className="mx-auto max-w-2xl px-4">
			<div className="mb-8 space-y-2">
				<h1 className="text-3xl font-bold">Personal Details</h1>
				<p className="text-muted-foreground">
					Let&apos;s get to know you better
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="avatar"
						render={({ field: { onChange, value, ...field } }) => (
							<FormItem className="flex flex-col gap-4">
								<FormLabel>Profile Picture</FormLabel>
								<FormControl>
									<div className="flex items-center gap-4">
										<Avatar className="h-24 w-24">
											<AvatarImage
												src={avatarUrl || ""}
												alt="Profile picture preview"
											/>
											<AvatarFallback>
												<User2Icon className="h-12 w-12" />
											</AvatarFallback>
										</Avatar>
										<div className="flex flex-col gap-2">
											<Input
												type="file"
												accept="image/*"
												onChange={(e) => {
													onChange(e.target.files);
													if (e.target.files?.[0]) {
														setAvatarUrl(
															URL.createObjectURL(e.target.files[0]),
														);
													}
												}}
												{...field}
											/>
											<p className="text-xs text-muted-foreground">
												Files up to 1MB, .png, .jpg, .jpeg. Recommended size is
												150x150px
											</p>
										</div>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="fullName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Full Name</FormLabel>
								<FormControl>
									<Input placeholder="John Doe" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" className="w-full" disabled={isUploading}>
						{isUploading ? "Submitting..." : "Continue"}
					</Button>
				</form>
			</Form>
		</div>
	);
}
