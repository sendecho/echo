import { Html, Text, Container, Hr, Section, Body, Head, Preview, Tailwind, Heading, Link } from '@react-email/components'



interface BroadcastEmailProps {
  subject: string;
  content: string;
}

export const BroadcastEmail = ({ subject, content }: BroadcastEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>

      <Tailwind>
        <Body className='font-sans px-2 my-auto mx-auto'>
          <Container>
            <Section>
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </Section>
            <Hr />
            <Section>
              <Text>To unsubscribe, click <Link href='https://voyage.dev'>here</Link></Text>
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