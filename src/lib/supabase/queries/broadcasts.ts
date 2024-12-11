import { createClient } from '@/lib/supabase/server'
import type { Client } from '@/types'

export async function fetchBroadcasts(accountId: string) {
  const supabase = createClient()

  const { data: broadcasts, error } = await supabase
    .from('emails')
    .select('*')
    .eq('account_id', accountId)
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

interface LinkEngagement {
  link_url: string;
  unique_clicks: number;
  total_clicks: number;
  click_rate: number;
}

interface EmailEngagement {
  contact_email: string;
  first_name: string | null;
  last_name: string | null;
  sent_at: string;
  open_count: number;
  click_count: number;
  last_engaged_at: string | null;
}

export async function getBroadcastStats(supabase: Client, broadcastId: string) {
  // Get the broadcast details
  const { data: broadcast } = await supabase
    .from('emails')
    .select('sent_at')
    .eq('id', broadcastId)
    .single();

  // Get engagement data with contact information
  const { data: engagementData } = await supabase
    .from('outbound_emails')
    .select(`
      id,
      contacts (
        first_name,
        last_name,
        email
      ),
      sent_at,
      email_opens (
        opened_at
      ),
      email_link_clicks (
        clicked_at
      )
    `)
    .eq('email_id', broadcastId);

  // Process engagement data
  const opens = engagementData?.map(email => {
    const openEvents = email.email_opens || [];
    const clickEvents = email.email_link_clicks || [];
    const allEngagements = [
      ...openEvents.map(o => o.opened_at),
      ...clickEvents.map(c => c.clicked_at)
    ].sort();

    return {
      contact_email: email.contacts?.email,
      first_name: email.contacts?.first_name,
      last_name: email.contacts?.last_name,
      sent_at: email.sent_at,
      open_count: openEvents.length,
      click_count: clickEvents.length,
      last_engaged_at: allEngagements.length ? allEngagements[allEngagements.length - 1] : null,
    };
  }) || [];

  // Calculate statistics
  const totalSent = opens.length;
  const totalOpens = opens.reduce((sum, email) => sum + email.open_count, 0);
  const uniqueOpens = opens.filter(email => email.open_count > 0).length;
  const totalLinkClicks = opens.reduce((sum, email) => sum + email.click_count, 0);
  const uniqueLinkClicks = opens.filter(email => email.click_count > 0).length;

  // Get link click statistics
  const { data: linkClicksData } = await supabase
    .from('email_link_clicks')
    .select(`
      link_url,
      tracking_id,
      outbound_emails!inner(email_id)
    `)
    .eq('outbound_emails.email_id', broadcastId);

  // Process link clicks data
  const linkStats = linkClicksData?.reduce((acc, click) => {
    if (!acc[click.link_url]) {
      acc[click.link_url] = {
        link_url: click.link_url,
        unique_clicks: new Set(),
        total_clicks: 0,
      };
    }
    acc[click.link_url].unique_clicks.add(click.tracking_id);
    acc[click.link_url].total_clicks++;
    return acc;
  }, {} as Record<string, { link_url: string; unique_clicks: Set<string>; total_clicks: number; }>);

  const linkEngagement = Object.values(linkStats || {}).map(stat => ({
    link_url: stat.link_url,
    unique_clicks: stat.unique_clicks.size,
    total_clicks: stat.total_clicks,
    click_rate: (stat.unique_clicks.size / totalSent) * 100,
  }));

  return {
    totalSent,
    sentAt: broadcast?.sent_at,
    totalOpens,
    uniqueOpens,
    totalLinkClicks,
    uniqueLinkClicks,
    opens: opens.sort((a, b) =>
      ((b.open_count + b.click_count) - (a.open_count + a.click_count)) ||
      ((a.last_engaged_at || '') < (b.last_engaged_at || '') ? 1 : -1)
    ),
    links: linkEngagement.sort((a, b) => b.total_clicks - a.total_clicks),
  };
}