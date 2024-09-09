import { Html, Text, Container, Hr, Section, Body, Head, Preview, Tailwind, Link, Img, Button } from '@react-email/components'

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
              <Text style={styles.footer}>To unsubscribe, click <Link href={`https://sendecho.co/unsubscribe/${unsubscribeId}`}>here</Link></Text>
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
  )
}

const styles = {
  button: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e5e5',
    borderRadius: '4px',
    padding: '6px 8px',
    display: 'inline-block',
    fontFamily: 'sans-serif',
    fontSize: '12px',
    color: '#4b5563'
  },
  footer: {
    fontSize: '12px',
    color: '#4b5563'
  }
}


BroadcastEmail.PreviewProps = {
  subject: "Test Subject",
  content: `<h1>Latest updates</h1><p>Here's the latest news, lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul><p>Regards, <br />Ryan</p>`
}

export default BroadcastEmail;