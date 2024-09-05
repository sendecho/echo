'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import EmailSetup from '@/components/email-setup'
import { emailSetupSchema } from '@/lib/schemas/onboarding-schema'
import { emailSetupAction } from '@/actions/onboarding-actions'
import { toast } from '@/components/ui/use-toast'

export default function EmailSetupPage() {
  const router = useRouter()
  const methods = useForm({
    resolver: zodResolver(emailSetupSchema),
    defaultValues: { fromName: '', emailAddress: '' },
  })

  const { execute, status } = useAction(emailSetupAction, {
    onSuccess: () => {
      toast({ title: 'Email setup completed successfully' })
      router.push('/onboarding/domain-verification')
    },
    onError: (error) => toast({ title: 'Error', description: error?.error.serverError, variant: 'destructive' }),
  })

  const onSubmit = methods.handleSubmit((data) => execute(data))

  return (
    <FormProvider {...methods}>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Email Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <EmailSetup />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={onSubmit} disabled={status === 'executing'}>
            {status === 'executing' ? 'Submitting...' : 'Next'}
          </Button>
        </CardFooter>
      </Card>
    </FormProvider>
  )
}