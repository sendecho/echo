import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BroadcastsTable } from '@/components/broadcasts-table'
import { TableSkeleton } from '@/components/table-skeleton'

export default function BroadcastsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Recent Broadcasts</h1>
        <Link href="/dashboard/broadcasts/new">
          <Button>Create New Broadcast</Button>
        </Link>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <BroadcastsTable />
      </Suspense>
    </div>
  )
}