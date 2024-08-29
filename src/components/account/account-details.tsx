"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AccountDetails() {

  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-2">
          <div>
            <dt className="font-semibold">Name:</dt>
            <dd>{user?.name}</dd>
          </div>
          <div>
            <dt className="font-semibold">Email:</dt>
            <dd>{user?.email}</dd>
          </div>
          {/* Add more user details as needed */}
        </dl>
      </CardContent>
    </Card>
  )
}