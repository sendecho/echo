"use client";

import { signOutAction } from "@/actions/sign-out-action";
import { useState } from "react";
import { DropdownMenuItem } from "./ui/dropdown-menu";

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