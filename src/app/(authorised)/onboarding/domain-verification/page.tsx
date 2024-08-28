'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import DomainVerification from '@/components/domain-verification'
import { domainVerificationSchema } from '@/lib/schemas/onboarding-schema'
import { domainVerificationAction } from '@/actions/onboarding-actions'
import { toast } from '@/components/ui/use-toast'

export default function DomainVerificationPage() {
  const router = useRouter()
  const methods = useForm({
    resolver: zodResolver(domainVerificationSchema),
    defaultValues: { domainVerified: false },
  })

  const { execute, status } = useAction(domainVerificationAction, {
    onSuccess: () => {
      toast({ title: 'Domain verification completed successfully' })
      router.push('/onboarding/mailing-address')
    },
    onError: (error) => toast({ title: 'Error', description: error.message, variant: 'destructive' }),
  })

  const onSubmit = methods.handleSubmit((data) => execute(data))

  return (
    <FormProvider {...methods}>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Onboarding: Domain Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <DomainVerification />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={() => router.push('/onboarding/email-setup')}>Back</Button>
          <Button onClick={onSubmit} disabled={status === 'executing'}>
            {status === 'executing' ? 'Submitting...' : 'Next'}
          </Button>
        </CardFooter>
      </Card>
    </FormProvider>
  )
}