import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EmailSetupData } from '@/lib/schemas/onboarding-schema'

export default function EmailSetup() {
  const { register, formState: { errors } } = useFormContext<EmailSetupData>()

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="fromName">From Name</Label>
        <Input id="fromName" {...register('fromName')} />
        {errors.fromName && <p className="text-sm text-red-500">{errors.fromName.message}</p>}
      </div>
      <div>
        <Label htmlFor="domain">Domain name</Label>
        <Input id="domain" type="email" {...register('domain')} />
        {errors.domain && <p className="text-sm text-red-500">{errors.domain.message}</p>}
      </div>
    </div>
  )
}