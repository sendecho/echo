import { acceptInvitation } from "@/lib/supabase/mutations/invitations";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function InvitePage({
	params,
}: { params: { code: string } }) {
	const supabase = createClient();
	const { code } = params;

	// Check if there's a logged-in user
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen bg-background">
				<h1 className="text-2xl font-bold mb-4">Accept Invitation</h1>
				<p className="mb-8">Please log in or sign up to accept the invite</p>
				<div className="space-x-4">
					<Link href={`/login?inviteId=${code}`} passHref>
						<Button>Log In</Button>
					</Link>
					<Link href={`/signup?inviteId=${code}`} passHref>
						<Button variant="outline">Sign Up</Button>
					</Link>
				</div>
			</div>
		);
	}

	if (code) {
		const { success, data, error } = await acceptInvitation(code);

		if (success) {
			// The user cache has been revalidated in the acceptInvitation function
			redirect("/dashboard");
		} else {
			// Handle error
			console.error("Error accepting invitation:", error);
			return (
				<div className="flex flex-col items-center justify-center min-h-screen bg-background">
					<h1 className="text-2xl font-bold mb-4">
						Error Accepting Invitation
					</h1>
					<p>{error || "An unexpected error occurred"}</p>
				</div>
			);
		}
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-background">
			<h1 className="text-2xl font-bold mb-4">Invite Expired</h1>
			<p>Please ask the sender to send you a new invite</p>
		</div>
	);
}
