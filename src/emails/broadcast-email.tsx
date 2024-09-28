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
} from "@react-email/components";
import parse, {
	domToReact,
	type HTMLReactParserOptions,
	Element,
	type DOMNode,
} from "html-react-parser";

interface BroadcastEmailProps {
	content: string;
	preview?: string;
	unsubscribeId: string;
	variables: Record<string, string>;
}

export const BroadcastEmail = ({
	content,
	preview,
	unsubscribeId,
	variables,
}: BroadcastEmailProps) => {
	const replacedContent = replaceVariables(content, variables);
	const parsedContent = parseHtmlContent(replacedContent);

	return (
		<Html>
			<Head />
			{preview && <Preview>{preview}</Preview>}
			<Tailwind>
				<Body className="font-sans px-2 my-auto mx-auto">
					<Container>
						<Section>{parsedContent}</Section>
						<Hr />
						<Section>
							<Text style={styles.footer}>
								To unsubscribe, click{" "}
								<Link href={`https://sendecho.co/unsubscribe/${unsubscribeId}`}>
									here
								</Link>
							</Text>
						</Section>
						<Section>
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
	return content.replace(
		/{{([^}]+?)(?:\|([^}]*))?}}/g,
		(match, key, fallback) => {
			const trimmedKey = key.trim();
			return variables[trimmedKey] || fallback?.trim() || "";
		},
	);
}

function parseHtmlContent(content: string) {
	const options: HTMLReactParserOptions = {
		replace: (domNode) => {
			if (domNode instanceof Element) {
				switch (domNode.name) {
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
							<Heading as={domNode.name}>
								{domToReact(domNode.children as DOMNode[], options)}
							</Heading>
						);
					case "ul":
						return (
							<ul>{domToReact(domNode.children as DOMNode[], options)}</ul>
						);
					case "ol":
						return (
							<ol>{domToReact(domNode.children as DOMNode[], options)}</ol>
						);
					case "li":
						return (
							<li>
								<Text className="m-0">
									{domToReact(domNode.children as DOMNode[], options)}
								</Text>
							</li>
						);
					default:
						return undefined;
				}
			}
		},
	};

	return parse(content, options);
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
	subject: "Test Subject",
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
		<img src="https://images.unsplash.com/photo-1709884732294-90379fee354c?q=80&w=3028&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Company Logo" style="max-width: 200px;" />
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
