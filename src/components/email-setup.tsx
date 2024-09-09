import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EmailSetupData } from '@/lib/schemas/onboarding-schema'
import { FormDescription } from './ui/form'

export default function EmailSetup() {
  const { register, formState: { errors } } = useFormContext<EmailSetupData>()

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Account name</Label>
        <Input id="name" {...register('name')} placeholder="Echo" />
        <FormDescription>This is the name of your account that will be used in the emails.</FormDescription>
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="fromName">From name</Label>
        <Input id="fromName" {...register('fromName')} placeholder="Ryan at Echo" />
        <FormDescription>This is the name that will be used in the &quot;from&quot; field of the emails.</FormDescription>
        {errors.fromName && <p className="text-sm text-red-500">{errors.fromName.message}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="domain">Domain name</Label>
        <Input id="domain" type="email" {...register('domain')} placeholder="sendecho.co" />
        <FormDescription>This is the domain name that will be used to send the emails.</FormDescription>
        {errors.domain && <p className="text-sm text-red-500">{errors.domain.message}</p>}
      </div>
    </div>
  )
}