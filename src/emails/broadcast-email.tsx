import { Html, Text, Container, Hr, Section, Body, Head, Preview, Tailwind, Link } from '@react-email/components'

interface BroadcastEmailProps {
  subject: string;
  preview?: string;
  content: string;
  unsubscribeId: string;
}

export const BroadcastEmail = ({ subject, preview, content, unsubscribeId }: BroadcastEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{preview || subject}</Preview>

      <Tailwind>
        <Body className='font-sans px-2 my-auto mx-auto'>
          <Container>
            <Section>
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </Section>
            <Hr />
            <Section>
              {/* TODO: Add unsubscribe link */}
              <Text>To unsubscribe, click <Link href={`https://sendecho.co/unsubscribe/${unsubscribeId}`}>here</Link></Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

BroadcastEmail.PreviewProps = {
  subject: "Test Subject",
  content: `<h1>Latest updates</h1><p>Here's the latest news, lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Regards, <br />Ryan</p>`
}

export default BroadcastEmail;