import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MailingAddressData } from '@/lib/schemas/onboarding-schema'

export default function MailingAddress() {
  const { register, formState: { errors } } = useFormContext<MailingAddressData>()

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="streetAddress">Street Address</Label>
        <Input id="streetAddress" {...register('streetAddress')} />
        {errors.streetAddress && <p className="text-sm text-red-500">{errors.streetAddress.message}</p>}
      </div>
      <div>
        <Label htmlFor="city">City</Label>
        <Input id="city" {...register('city')} />
        {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
      </div>
      <div>
        <Label htmlFor="state">State/Province</Label>
        <Input id="state" {...register('state')} />
        {errors.state && <p className="text-sm text-red-500">{errors.state.message}</p>}
      </div>
      <div>
        <Label htmlFor="postalCode">Postal Code</Label>
        <Input id="postalCode" {...register('postalCode')} />
        {errors.postalCode && <p className="text-sm text-red-500">{errors.postalCode.message}</p>}
      </div>
      <div>
        <Label htmlFor="country">Country</Label>
        <Input id="country" {...register('country')} />
        {errors.country && <p className="text-sm text-red-500">{errors.country.message}</p>}
      </div>
    </div>
  )
}