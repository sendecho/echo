import Link from 'next/link'
import { fetchBroadcasts } from '@/lib/supabase/queries/broadcasts'
import { Badge } from './ui/badge'

export async function BroadcastsTable() {
  const broadcasts = await fetchBroadcasts()

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
          <tr key={broadcast.id} className="border-t">
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