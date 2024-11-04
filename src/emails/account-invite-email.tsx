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
	Font,
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
			<Tailwind>
				<Head>
					<Font
						fontFamily="Geist"
						fallbackFontFamily="Helvetica"
						webFont={{
							url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-400-normal.woff2",
							format: "woff2",
						}}
						fontWeight={400}
						fontStyle="normal"
					/>

					<Font
						fontFamily="Geist"
						fallbackFontFamily="Helvetica"
						webFont={{
							url: "https://cdn.jsdelivr.net/npm/@fontsource/geist-sans@5.0.1/files/geist-sans-latin-500-normal.woff2",
							format: "woff2",
						}}
						fontWeight={500}
						fontStyle="normal"
					/>
				</Head>
				<Preview>Join {inviterName} on Echo</Preview>

				<Body className="bg-white font-sans px-2 my-auto mx-auto">
					<Container
						className="border-transparent md:border-[#E8E7E1] my-[40px] mx-auto p-[20px] max-w-[600px]"
						style={{ borderStyle: "solid", borderWidth: 1 }}
					>
						<Heading className="text-black text-[24px] font-normal text-center p-0 mx-0">
							Join <strong>{inviterName}</strong> on <strong>Echo</strong>
						</Heading>
						<Text className="text-[14px] leading-[24px] text-black">
							You&apos;ve been invited to join <strong>{accountName}</strong> on{" "}
							<strong>Echo</strong>
						</Text>
						<Section className="mb-[32px] mt-[32px] text-center">
							<Button
								className="bg-[#000000] text-white text-center px-4 py-2 rounded-md hover:bg-[#000000] transition-colors font-semibold no-underline text-[14px] leading-[24px]"
								href={inviteLink}
							>
								Join the team
							</Button>
						</Section>
						<Text className="!text-[14px] leading-[24px] text-black break-all">
							or copy and paste this URL into your browser:{" "}
							<Link
								href={inviteLink}
								className="break-all text-blue-600 no-underline"
							>
								{inviteLink}
							</Link>
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
