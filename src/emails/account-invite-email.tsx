import {
	Html,
	Body,
	Section,
	Text,
	Link,
	Head,
	Preview,
	Tailwind,
	Container,
	Heading,
	Button,
} from "@react-email/components";
import * as React from "react";

interface EmailTemplateProps {
	inviterName: string;
	accountName: string;
	accountId: string;
	inviteLink: string;
}

export const AccountInviteEmail = ({
	inviterName,
	accountName,
	accountId,
	inviteLink,
}: EmailTemplateProps) => {
	return (
		<Html>
			<Head />
			<Preview>Join {inviterName} on Echo</Preview>

			<Tailwind>
				<Body className="font-sans px-2 my-auto mx-auto">
					<Container>
						<Heading>
							Join <strong>{inviterName}</strong> on <strong>Echo</strong>
						</Heading>
						<Text>
							You&apos;ve been invited to join <strong>{accountName}</strong> on <strong>Echo</strong>
						</Text>
						<Section>
							<Button
								className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors font-semibold no-underline"
								href={inviteLink}
							>
								Join Workspace
							</Button>
						</Section>
						<Text>
							or copy and paste the URL into your browser:
							<Link href={inviteLink}>{inviteLink}</Link>
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

AccountInviteEmail.PreviewProps = {
	accountId: "123122",
	accountName: "Echo",
	inviterName: "Ryan",
	inviteLink: "https://project.com/invite/123",
} as EmailTemplateProps;

export default AccountInviteEmail;
