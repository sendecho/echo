import {
	Html,
	Text,
	Container,
	Hr,
	Section,
	Body,
	Head,
	Preview,
	Tailwind,
	Link,
	Button,
	Heading,
	Img,
	CodeBlock,
	CodeInline,
	dracula,
} from "@react-email/components";
import parse, {
	domToReact,
	type HTMLReactParserOptions,
	Element,
	type DOMNode,
} from "html-react-parser";
import { getURL, getTrackingURL } from "@/lib/utils";

interface BroadcastEmailProps {
	content: string;
	preview?: string;
	unsubscribeId?: string;
	variables: Record<string, string>;
	trackingId?: string;
}

function parseHtmlContent(
	content: string,
	trackingId?: string,
	unsubscribeId?: string,
) {
	const options: HTMLReactParserOptions = {
		replace: (domNode: DOMNode) => {
			if (!(domNode instanceof Element)) {
				return;
			}

			const href = domNode.attribs?.href;

			const trackedHref =
				href && trackingId
					? `${getTrackingURL()}/l?id=${trackingId}&url=${encodeURIComponent(href)}`
					: href;

			switch (domNode.tagName) {
				case "p":
					return (
						<Text>{domToReact(domNode.children as DOMNode[], options)}</Text>
					);

				case "h1":
				case "h2":
				case "h3":
				case "h4":
				case "h5":
				case "h6":
					return (
						<Heading as={domNode.tagName}>
							{domToReact(domNode.children as DOMNode[], options)}
						</Heading>
					);

				case "ul":
					return <ul>{domToReact(domNode.children as DOMNode[], options)}</ul>;

				case "ol":
					return <ol>{domToReact(domNode.children as DOMNode[], options)}</ol>;

				case "li":
					return (
						<li>
							<Text className="m-0">
								{domToReact(domNode.children as DOMNode[], options)}
							</Text>
						</li>
					);

				case "a": {
					// Handle unsubscribe links
					if (href === "{{{unsubscribe}}}") {
						return (
							<Link href={`${getURL()}/unsubscribe/${unsubscribeId}`}>
								{domToReact(domNode.children as DOMNode[], options)}
							</Link>
						);
					}

					// Handle regular links with tracking
					return (
						<Link href={trackedHref}>
							{domToReact(domNode.children as DOMNode[], options)}
						</Link>
					);
				}

				case "img": {
					const src = domNode.attribs?.src;
					if (!src) return;

					return (
						<Img
							src={src}
							alt={domNode.attribs?.alt || ""}
							style={{ maxWidth: "100%", height: "auto" }}
						/>
					);
				}

				case "code": {
					// Check if parent is <pre> for code blocks
					const isCodeBlock =
						domNode.parent instanceof Element &&
						domNode.parent.tagName === "pre";

					if (isCodeBlock) {
						const code = domToReact(domNode.children as DOMNode[]) as string;
						return (
							<>
								<CodeBlock
									code={code}
									language="javascript"
									theme={dracula}
									style={{ width: "100%", maxWidth: "600px" }}
								/>
							</>
						);
					}

					// Inline code
					return (
						<CodeInline className="rounded-[6px] bg-gray-200 px-[4px] py-[2px]">
							{domToReact(domNode.children as DOMNode[], options)}
						</CodeInline>
					);
				}

				case "pre":
					// Handle pre tag by just returning its children
					// The nested code tag will handle the CodeBlock rendering
					return domToReact(domNode.children as DOMNode[], options);

				case "hr":
					return <Hr />;

				default:
					return undefined;
			}
		},
	};

	return parse(content, options);
}

export const BroadcastEmail = ({
	content,
	preview,
	unsubscribeId,
	variables,
	trackingId,
}: BroadcastEmailProps) => {
	const replacedContent = replaceVariables(content, variables);
	const parsedContent = parseHtmlContent(
		replacedContent,
		trackingId,
		unsubscribeId,
	);
	const trackingUrl = trackingId
		? `${getTrackingURL()}/o?id=${trackingId}`
		: undefined;

	return (
		<Html>
			<Head />
			{preview && <Preview>{preview}</Preview>}
			<Tailwind>
				<Body className="font-sans my-auto mx-auto px-2">
					{trackingUrl && (
						<Img
							src={trackingUrl}
							width="1"
							height="1"
							alt=""
							style={{ display: "block", width: "1px", height: "1px" }}
						/>
					)}
					<Container
						width="600"
						style={{ maxWidth: "100%", width: "600px", display: "block" }}
						className="relative mx-auto my-[20px] p-[20px]"
					>
						<Section>{parsedContent}</Section>
						<Section className="mt-[20px]">
							<Button style={styles.button} href="https://sendecho.co">
								Powered by Echo
							</Button>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

function replaceVariables(
	content: string,
	variables: Record<string, string>,
): string {
	// First preserve the {{{unsubscribe}}} token
	const UNSUBSCRIBE_TOKEN = "{{{unsubscribe}}}";
	const preservedContent = content.replace(
		UNSUBSCRIBE_TOKEN,
		"___UNSUBSCRIBE___",
	);

	// Handle double braces (like {{variable|fallback}})
	const processedContent = preservedContent.replace(
		/{{([^}]+?)(?:\|([^}]*))?}}/g,
		(match, key, fallback) => {
			const trimmedKey = key.trim();
			return variables[trimmedKey] || fallback?.trim() || "";
		},
	);

	// Restore the unsubscribe token
	return processedContent.replace("___UNSUBSCRIBE___", UNSUBSCRIBE_TOKEN);
}

const styles = {
	button: {
		backgroundColor: "#ffffff",
		border: "1px solid #e5e5e5",
		borderRadius: "4px",
		padding: "6px 8px",
		display: "inline-block",
		fontFamily: "sans-serif",
		fontSize: "12px",
		color: "#4b5563",
	},
	footer: {
		fontSize: "12px",
		color: "#4b5563",
	},
};

BroadcastEmail.PreviewProps = {
	content: `
		<h1>Welcome, {{first_name|there}}!</h1>
		<h2>Latest Updates from {{company_name|Our Company}}</h2>
		<p>Hello {{first_name|there}} {{last_name}},</p>
		<p>We hope this email finds you well. Here's a quick summary of what's new:</p>
		<ul>
			<li><strong>Bold news:</strong> We've launched a new product!</li>
			<li><em>Exciting times:</em> Our team is growing rapidly.</li>
			<li><u>Don't miss out:</u> Limited time offer on all services.</li>
		</ul>
		<p>Here's a highlighted message for you: <mark>You're invited to our annual conference!</mark></p>
		<p>Check out our new logo:</p>
		<p>
			<img src="https://images.unsplash.com/photo-1709884732294-90379fee354c?q=80&w=3028&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Company Logo" />
			this is a caption
		</p>
		<p>We've also <s>decreased</s> <strong>increased</strong> our customer satisfaction rate!</p>
		<h3>Quick Links</h3>
		<ol>
			<li><a href="https://example.com/products">Our Products</a></li>
			<li><a href="https://example.com/about">About Us</a></li>
			<li><a href="https://example.com/contact">Contact Support</a></li>
		</ol>
		<div src="https://x.com/ryanohara_/status/1827995187488104914" data-tweet=""></div>
		<p>Feel free to reach out to us at {{support_email|support@example.com}} if you have any questions.</p>
		<p>Best regards,<br />The {{company_name|Our Company}} Team</p>
		<div data-type="unsubscribe" class="text-sm text-muted-foreground mt-8"><hr contenteditable="false"><p>You are receiving this email because you opted in via our site.<br><br>Want to change how you receive these emails? <a target="_blank" rel="noopener noreferrer nofollow" class="text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer" href="{{{unsubscribe}}}">You can unsubscribe from this list</a>.</p><p>Company Name<br>99 Street Address<br>City, STATE 000-000</p></div>
	`,
	preview:
		"Welcome {{first_name|there}}! Latest updates and exciting news inside.",
	unsubscribeId: "123",
	variables: {
		first_name: "John",
		last_name: "Doe",
		support_email: "help@techcorp.com",
	},
};

export default BroadcastEmail;
