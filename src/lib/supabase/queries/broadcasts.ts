import { createClient } from '@/lib/supabase/server'
import type { Client } from '@/types'

export async function fetchBroadcasts() {
  const supabase = createClient()

  const { data: broadcasts, error } = await supabase
    .from('emails')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error fetching broadcasts:', error)
    return []
  }

  return broadcasts
}

export async function fetchBroadcastById(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('emails')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching broadcast:', error)
    return null
  }

  return data
}

export async function createBroadcast(broadcast: any) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('emails')
    .insert([broadcast])

  if (error) {
    console.error('Error creating broadcast:', error)
    return null
  }

  return data
}

export async function updateBroadcast(id: string, broadcast: any) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('emails')
    .update(broadcast)
    .eq('id', id)

  if (error) {
    console.error('Error updating broadcast:', error)
    return null
  }

  return data
}

export async function deleteBroadcast(id: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('emails')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting broadcast:', error)
    return null
  }

  return data
}

export async function getBroadcastStats(supabase: Client, broadcastId: string): Promise<{ totalSent: number; totalOpens: number; uniqueOpens: number; sentAt: string | null }> {
  const { count: totalSent, error: countError } = await supabase
    .from('outbound_emails')
    .select('*', { count: 'exact', head: true })
    .eq('email_id', broadcastId)

  const { data: emailData, error: emailError } = await supabase
    .from('emails')
    .select('sent_at')
    .eq('id', broadcastId)
    .single()

  const { count: totalOpens, error: totalOpensError } = await supabase
    .from('email_opens')
    .select('outbound_emails!inner(email_id)', { count: 'exact', head: true })
    .eq('outbound_emails.email_id', broadcastId)

  const { count: uniqueOpens, error: uniqueOpensError } = await supabase
    .from('email_opens')
    .select('outbound_emails!inner(email_id)', { count: 'exact', head: true })
    .eq('outbound_emails.email_id', broadcastId)

  if (countError || emailError || totalOpensError || uniqueOpensError) {
    console.error('Error fetching broadcast stats:', countError || emailError || totalOpensError || uniqueOpensError)
    throw countError || emailError || totalOpensError || uniqueOpensError
  }

  return {
    totalSent: totalSent ?? 0,
    totalOpens: totalOpens ?? 0,
    uniqueOpens: uniqueOpens ?? 0,
    sentAt: emailData?.sent_at ?? null
  }
}