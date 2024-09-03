import Link from 'next/link'
import { fetchBroadcasts } from '@/lib/supabase/queries/broadcasts'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

export async function BroadcastsTable() {
  const broadcasts = await fetchBroadcasts()

  if (broadcasts.length === 0) {
    return (
      <div className="text-center text-muted-foreground flex flex-col gap-4 p-36 border border-dashed border-border rounded-md">
        <p>No broadcasts found</p>
        <div>
          <Button asChild>
            <Link href="/dashboard/broadcasts/new">
              Create New Broadcast
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <table className="w-full">
      <thead>
        <tr>
          <th className="text-left p-2">Subject</th>
          <th className="text-left p-2">Date</th>
          <th className="text-left p-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {broadcasts.map((broadcast) => (
          <tr key={broadcast.id} className="border-t border-border">
            <td className="p-2">
              <Link href={`/dashboard/broadcasts/${broadcast.id}`} className="text-blue-600 hover:underline">
                {broadcast.subject}
              </Link>
            </td>
            <td className="p-2">{new Date(broadcast.created_at).toLocaleDateString()}</td>
            <td className="p-2">
              <Badge variant={broadcast.sent_at ? "default" : "secondary"}>
                {broadcast.sent_at ? 'Sent' : 'Draft'}
              </Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}