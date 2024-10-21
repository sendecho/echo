import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import EmailSetup from "@/components/email-setup";
import type { EmailSetupData } from "@/lib/schemas/onboarding-schema";
import { emailSetupSchema } from "@/lib/schemas/onboarding-schema";
import { emailSetupAction } from "@/actions/onboarding-actions";
import { useAction } from "next-safe-action/hooks";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface CreateAccountDialogProps {
	onSubmit: (name: string, domain: string) => void;
}

export function CreateAccountDialog() {
	const [open, setOpen] = useState(false);
	const router = useRouter();

	const methods = useForm<EmailSetupData>({
		resolver: zodResolver(emailSetupSchema),
		defaultValues: { name: "", domain: "" },
	});

	const { execute, status } = useAction(emailSetupAction, {
		onSuccess: () => {
			toast({ title: "Email setup completed successfully" });
			router.push("/onboarding/domain-verification");
		},
		onError: (error) =>
			toast({
				title: "Error",
				description: error?.error.serverError,
				variant: "destructive",
			}),
	});

	const handleSubmit = methods.handleSubmit((data) => {
		execute(data);
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					className="w-full justify-start text-sm font-normal text-grey-800"
				>
					<PlusCircle className="mr-2 h-4 w-4" />
					Create new account
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Create New Account</DialogTitle>
				</DialogHeader>
				<FormProvider {...methods}>
					<form onSubmit={handleSubmit} className="space-y-4">
						<EmailSetup />
						<Button type="submit" className="w-full">
							Create new account
						</Button>
					</form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	);
}
