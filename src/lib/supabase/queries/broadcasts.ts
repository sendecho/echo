import { createClient } from '@/lib/supabase/server'

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