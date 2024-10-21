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

interface CreateAccountDialogProps {
	onSubmit: (name: string, domain: string) => void;
}

export function CreateAccountDialog({ onSubmit }: CreateAccountDialogProps) {
	const [open, setOpen] = useState(false);

	const methods = useForm<EmailSetupData>({
		resolver: zodResolver(emailSetupSchema),
		defaultValues: { name: "", domain: "" },
	});

	const handleSubmit = methods.handleSubmit((data) => {
		onSubmit(data.name, data.domain);
		setOpen(false);
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" className="w-full justify-start">
					<PlusCircle className="mr-2 h-4 w-4" />
					Create Account
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
							Create Account
						</Button>
					</form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	);
}
