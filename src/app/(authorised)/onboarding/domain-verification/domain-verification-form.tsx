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

interface DomainVerificationFormProps {
  initialStatus: boolean
  domainData: any | null
}

export default function DomainVerificationForm({ initialStatus, domainData }: DomainVerificationFormProps) {
  const router = useRouter()
  const methods = useForm({
    resolver: zodResolver(domainVerificationSchema),
    defaultValues: { domainVerified: initialStatus },
  })

  const { execute, status } = useAction(domainVerificationAction, {
    onSuccess: () => {
      toast({ title: 'Domain verification completed successfully' })
      router.push('/onboarding/mailing-address')
    },
    onError: (error) => {
      if (error && typeof error === 'object' && 'message' in error) {
        toast({ title: 'Error', description: error.message as string, variant: 'destructive' })
      } else {
        toast({ title: 'Error', description: 'An unknown error occurred', variant: 'destructive' })
      }
    },
  })

  const onSubmit = methods.handleSubmit((data) => execute(data))

  return (
    <FormProvider {...methods}>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Domain Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <DomainVerification domainData={domainData} />
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