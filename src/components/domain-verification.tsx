import { useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { DomainVerificationData } from '@/lib/schemas/onboarding-schema'

export default function DomainVerification() {
  const { setValue } = useFormContext<DomainVerificationData>()

  const handleVerify = async () => {
    // Implement domain verification logic here
    const isVerified = await verifyDomain()
    setValue('domainVerified', isVerified)
  }

  const handleSkip = () => {
    setValue('domainVerified', false)
  }

  return (
    <div className="space-y-4">
      <Alert>
        <AlertTitle>Domain Verification</AlertTitle>
        <AlertDescription>
          Add the following DNS records to verify your domain:
          <pre className="mt-2 bg-secondary p-2 rounded">
            {`TXT  @  v=spf1 include:_spf.example.com ~all
CNAME  mail  mail.example.com`}
          </pre>
        </AlertDescription>
      </Alert>
      <div className="flex space-x-4">
        <Button onClick={handleVerify}>Verify Domain</Button>
        <Button variant="outline" onClick={handleSkip}>Skip for now</Button>
      </div>
    </div>
  )
}

async function verifyDomain() {
  // Implement actual domain verification logic here
  return true
}