'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { duplicateBroadcast } from '@/lib/supabase/mutations/broadcasts'

interface BroadcastTableActionsProps {
  id: string
  subject: string
}

export function BroadcastTableActions({ id, subject }: BroadcastTableActionsProps) {
  const router = useRouter()

  const handleDuplicate = async () => {
    await duplicateBroadcast(id, `Copy of ${subject}`)
    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/broadcasts/${id}`}>
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDuplicate}>
          Duplicate
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}