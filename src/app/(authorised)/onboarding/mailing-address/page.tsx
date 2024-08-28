'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import MailingAddress from '@/components/mailing-address'
import { mailingAddressSchema } from '@/lib/schemas/onboarding-schema'
import { mailingAddressAction } from '@/actions/onboarding-actions'
import { toast } from '@/components/ui/use-toast'

export default function MailingAddressPage() {
  const router = useRouter()
  const methods = useForm({
    resolver: zodResolver(mailingAddressSchema),
    defaultValues: { streetAddress: '', city: '', state: '', postalCode: '', country: '' },
  })

  const { execute, status } = useAction(mailingAddressAction, {
    onSuccess: () => {
      toast({ title: 'Mailing address saved successfully' })
      // Redirect to dashboard or next step after onboarding
      router.push('/dashboard')
    },
    onError: (error) => toast({ title: 'Error', description: error.message, variant: 'destructive' }),
  })

  const onSubmit = methods.handleSubmit((data) => execute(data))

  return (
    <FormProvider {...methods}>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Onboarding: Mailing Address</CardTitle>
        </CardHeader>
        <CardContent>
          <MailingAddress />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={() => router.push('/onboarding/domain-verification')}>Back</Button>
          <Button onClick={onSubmit} disabled={status === 'executing'}>
            {status === 'executing' ? 'Submitting...' : 'Finish'}
          </Button>
        </CardFooter>
      </Card>
    </FormProvider>
  )
}