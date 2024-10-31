"use client";

import * as React from "react";
import { ChevronsUpDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import {
	getCurrentUserAccountQuery,
	getUserAccountsQuery,
} from "@/lib/supabase/queries/user";
import { CreateAccountDialog } from "@/components/create-account-dialog";
import { useAction } from "next-safe-action/hooks";
import { switchAccountAction } from "@/actions/account-actions";

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

	const { execute: switchAccount, status: switchAccountStatus } = useAction(
		switchAccountAction,
		{
			onSuccess: () => {
				// Do a hard reload to the /dashboard route to ensure the new account is loaded
				window.location.href = "/dashboard";
			},
		},
	);

	React.useEffect(() => {
		const fetchAccounts = async () => {
			const supabase = createClient();

			const { data: user } = await getCurrentUserAccountQuery(supabase);

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

				// Find the account that matches the user's account_id
				const userAccount = formattedAccounts.find(
					(account) => account.id === user.account_id,
				);
				if (userAccount) {
					setSelectedAccount(userAccount);
				} else if (formattedAccounts.length > 0) {
					// Fallback to the first account if the user's account is not found
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

	const handleSelectAccount = async (account: Account) => {
		if (account.id !== selectedAccount?.id) {
			await switchAccount({ accountId: account.id });
		}
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
				<div className="space-y-1 p-1">
					<div className="text-xs text-muted-foreground font-medium px-2 pt-2">
						Accounts
					</div>
					{accounts.map((account) => (
						<Button
							key={account.id}
							variant="ghost"
							className={cn(
								"w-full justify-start px-2",
								selectedAccount?.id === account.id &&
									"bg-accent text-accent-foreground",
							)}
							onClick={() => handleSelectAccount(account)}
							disabled={switchAccountStatus === "executing"}
						>
							<Avatar className="h-6 w-6 mr-2">
								<AvatarImage
									src={`https://avatar.vercel.sh/${account.id}.png`}
								/>
								<AvatarFallback>{account.name.charAt(0)}</AvatarFallback>
							</Avatar>
							<div className="flex flex-col items-start flex-grow">
								<span className="flex-grow text-left text-sm font-normal text-grey-800">
									{account.name}
								</span>
								<span className="text-xs text-muted-foreground">
									{account.plan_name || "Free plan"}
								</span>
							</div>
							{selectedAccount?.id === account.id && (
								<Check className="h-4 w-4 ml-2 flex-shrink-0" />
							)}
						</Button>
					))}
					<CreateAccountDialog />
				</div>
			</PopoverContent>
		</Popover>
	);
}
