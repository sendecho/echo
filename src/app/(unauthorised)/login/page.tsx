"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { env } from "@/env";

interface LoginFormData {
	email: string;
	password: string;
}

export default function LoginPage() {
	const [formData, setFormData] = useState<LoginFormData>({
		email: "",
		password: "",
	});
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	const inviteId = searchParams.get("inviteId");
	const supabase = createClient();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);

		try {
			const { error } = await supabase.auth.signInWithPassword(formData);
			if (error) throw error;
			if (inviteId) {
				router.push(`/invite/${inviteId}`);
			} else {
				router.push("/dashboard");
			}
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "An unexpected error occurred",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="h-screen bg-background flex flex-col">
			<header className="p-4 flex justify-between items-center">
				<Button
					variant="ghost"
					onClick={() => router.push("/")}
					className="flex items-center group"
				>
					<ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
					Back
				</Button>
				{!env.NEXT_PUBLIC_DISABLE_SIGNUP && (
					<Button variant="ghost" onClick={() => router.push("/signup")}>
						Sign up
					</Button>
				)}
			</header>
			<div className="flex-grow flex items-center justify-center px-4">
				<Card className="w-full max-w-md shadow-sm">
					<CardHeader className="text-center space-y-2 items-center">
						<div className="flex items-center justify-center">
							<Image src="/echo.svg" alt="Logo" width={24} height={24} />
						</div>
						<CardTitle>Welcome back</CardTitle>
						<CardDescription>
							Enter your email to sign in to your account
						</CardDescription>
					</CardHeader>
					<CardContent>
						{error && (
							<Alert variant="destructive" className="mb-4">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
						<form onSubmit={handleLogin} className="space-y-2">
							<div className="space-y-2">
								<Label htmlFor="email" className="sr-only">
									Email
								</Label>
								<Input
									type="email"
									id="email"
									name="email"
									placeholder="Email"
									value={formData.email}
									onChange={handleInputChange}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="password" className="sr-only">
									Password
								</Label>
								<Input
									type="password"
									id="password"
									name="password"
									placeholder="Password"
									value={formData.password}
									onChange={handleInputChange}
									required
								/>
							</div>
							{inviteId && (
								<input type="hidden" name="inviteId" value={inviteId} />
							)}
							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Signing in..." : "Sign In"}
							</Button>
						</form>
					</CardContent>
					{!env.NEXT_PUBLIC_DISABLE_SIGNUP && (
						<CardFooter className="justify-center">
							<p className="text-sm text-gray-500">
								<Link
									href="/signup"
									className="text-gray-500 underline hover:text-primary transition-colors"
								>
									Don&apos;t have an account? Sign up
								</Link>
							</p>
						</CardFooter>
					)}
				</Card>
			</div>
		</div>
	);
}
