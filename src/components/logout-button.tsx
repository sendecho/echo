"use client";

import { signOutAction } from "@/actions/sign-out-action";
import { useState } from "react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { Button } from "./ui/button";

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
    <DropdownMenuItem onClick={handleSignOut}>
      {isLoading ? "Loading..." : "Sign out"}
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
    <Button variant="ghost" size="sm" onClick={handleSignOut} disabled={isLoading}>
      {isLoading ? "Signing out..." : "Sign out"}
    </Button>
  );
}