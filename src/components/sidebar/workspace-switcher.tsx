"use client";

import * as React from "react";
import { ChevronsUpDown, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getUserAccountsQuery } from "@/lib/supabase/queries/user";

interface Account {
	id: string;
	name: string;
	plan_name: string | null;
}

export function WorkspaceSwitcher() {
	const [open, setOpen] = React.useState(false);
	const [accounts, setAccounts] = React.useState<Account[]>([]);
	const [selectedAccount, setSelectedAccount] = React.useState<Account | null>(
		null,
	);
	const triggerRef = React.useRef<HTMLButtonElement>(null);
	const [triggerWidth, setTriggerWidth] = React.useState<number | undefined>(
		undefined,
	);
	const router = useRouter();

	React.useEffect(() => {
		const fetchAccounts = async () => {
			const supabase = createClient();
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (user) {
				const accountsData = await getUserAccountsQuery(supabase, user.id);
				const formattedAccounts = accountsData
					.filter((item) => item.account != null)
					.map((item) => ({
						id: item.account?.id ?? "",
						name: item.account?.name ?? "",
						plan_name: item.account?.plan_name ?? null,
					}));
				setAccounts(formattedAccounts);
				if (formattedAccounts.length > 0) {
					setSelectedAccount(formattedAccounts[0]);
				}
			}
		};
		fetchAccounts();
	}, []);

	React.useEffect(() => {
		if (triggerRef.current && selectedAccount) {
			setTriggerWidth(triggerRef.current.offsetWidth);
		}
	}, [selectedAccount]);

	const handleSelectAccount = (account: Account) => {
		setSelectedAccount(account);
		setOpen(false);
		console.log(`Selected account: ${account.name}`);
		// Implement account switching logic here
	};

	const handleCreateAccount = () => {
		console.log("Create new account");
		// Implement account creation logic here
	};

	if (!selectedAccount) return null;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					ref={triggerRef}
					variant="ghost"
					role="combobox"
					aria-expanded={open}
					className={cn(
						"w-full justify-between p-1.5 h-auto",
						open && "bg-accent text-accent-foreground",
					)}
				>
					<div className="flex items-center gap-x-2 pr-2">
						<Avatar className="h-8 w-8">
							<AvatarImage
								src={`https://avatar.vercel.sh/${selectedAccount.id}.png`}
							/>
							<AvatarFallback>{selectedAccount.name.charAt(0)}</AvatarFallback>
						</Avatar>
						<div className="flex flex-col items-start">
							<div className="truncate text-sm font-medium">
								{selectedAccount.name}
							</div>
							<div className="text-xs capitalize text-muted-foreground leading-tight">
								{selectedAccount.plan_name || "Free plan"}
							</div>
						</div>
					</div>
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="p-0" style={{ width: triggerWidth }}>
				<div className="space-y-1">
					{accounts.map((account) => (
						<Button
							key={account.id}
							variant="ghost"
							className="w-full justify-start"
							onClick={() => handleSelectAccount(account)}
						>
							<Avatar className="h-6 w-6 mr-2">
								<AvatarImage
									src={`https://avatar.vercel.sh/${account.id}.png`}
								/>
								<AvatarFallback>{account.name.charAt(0)}</AvatarFallback>
							</Avatar>
							{account.name}
						</Button>
					))}
					<Button
						variant="ghost"
						className="w-full justify-start"
						onClick={handleCreateAccount}
					>
						<PlusCircle className="mr-2 h-4 w-4" />
						Create Account
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
