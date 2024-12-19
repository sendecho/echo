"use client";

import { useEffect, useState } from "react";
import BroadcastEmail from "@/emails/broadcast-email";
import { render } from "@react-email/render";

interface BroadcastPreviewProps {
	subject: string;
	content: string;
}

const defaultPreviewVariables = {
	first_name: "John",
	last_name: "Doe",
	email: "john@example.com",
	company_name: "Echo",
	support_email: "support@sendecho.co",
	unsubscribe_url: "#",
};

export function BroadcastPreview({ subject, content }: BroadcastPreviewProps) {
	const [html, setHtml] = useState<string>("");

	useEffect(() => {
		async function renderEmail() {
			const rendered = await render(
				<BroadcastEmail
					content={content}
					preview={subject}
					variables={defaultPreviewVariables}
				/>,
				{
					pretty: true,
				},
			);
			setHtml(rendered);
		}
		renderEmail();
	}, [subject, content]);

	if (!html) {
		return (
			<div className="w-full h-[800px] bg-white border border-border border-[4px] rounded-md p-4 flex items-center justify-center">
				<div className="text-muted-foreground">Loading preview...</div>
			</div>
		);
	}

	return (
		<div className="w-full h-full bg-white border border-border border-[4px] rounded-md p-4">
			<iframe
				srcDoc={html}
				className="w-full h-[800px]"
				title="Email preview"
			/>
		</div>
	);
}
