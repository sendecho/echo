'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function OnboardingPage() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Welcome to Onboarding</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Let&apos;s get you set up with your account. This process will take you through the following steps:</p>
          <ol className="list-decimal list-inside mt-4">
            <li>Email Setup</li>
            <li>Domain Verification</li>
            <li>Mailing Address</li>
          </ol>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={() => router.push('/onboarding/email-setup')}>Start Onboarding</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
