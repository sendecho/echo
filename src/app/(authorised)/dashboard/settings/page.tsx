import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { SettingsCard } from '@/components/settings/settings-card'

export default function SettingsPage() {
  return (
    <div className="space-y-12">
      <SettingsCard
        name="Domain"
        description="Set up your custom domain for sending emails"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="domain">Domain</Label>
          <Input id="domain" placeholder="yourdomain.com" />
        </div>
      </SettingsCard>

      <SettingsCard
        name="From Name"
        description="Set the name that will appear in the &quot;From&quot; field of your emails"
      >
        <Label htmlFor="fromName">From Name</Label>
        <Input id="fromName" placeholder="Your Name or Company" />
      </SettingsCard>

      <SettingsCard
        name="Mailing Address"
        description="Provide your mailing address for compliance with anti-spam laws"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="streetAddress">Street Address</Label>
            <Input id="streetAddress" placeholder="123 Main St" />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" placeholder="New York" />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input id="state" placeholder="NY" />
          </div>
          <div>
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input id="postalCode" placeholder="10001" />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input id="country" placeholder="United States" />
          </div>
        </div>
      </SettingsCard>

      <div className="flex justify-end">
        <Button type="submit">Save Changes</Button>
      </div>
    </div>
  )
}