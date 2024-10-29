"use client";

import { signOutAction } from "@/actions/sign-out-action";
import { useState } from "react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
/**
 * SignOut component for the dropdown menu
 * @returns
 */
export function SignOut() {
	const [isLoading, setLoading] = useState(false);

	const handleSignOut = async () => {
		setLoading(true);
		signOutAction();
	};

	return (
		<DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
			<LogOut className="mr-2 h-4 w-4" />
			<span>{isLoading ? "Loading..." : "Sign out"}</span>
		</DropdownMenuItem>
	);
}

/**
 * LogoutButton component for the header
 * @returns
 */
export function LogoutButton() {
	const [isLoading, setLoading] = useState(false);

	const handleSignOut = async () => {
		setLoading(true);
		await signOutAction();
	};

	return (
		<Button
			variant="ghost"
			size="sm"
			onClick={handleSignOut}
			disabled={isLoading}
		>
			{isLoading ? "Signing out..." : "Sign out"}
		</Button>
	);
}
