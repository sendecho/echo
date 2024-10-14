import { createAdminClient } from '@/lib/supabase/admin'
import { type NextRequest, NextResponse } from 'next/server'

const supabase = createAdminClient()

export async function GET(request: NextRequest) {

  console.log(request)
  const searchParams = new URL(request.url).searchParams;
  console.log(searchParams)

  const trackingId = searchParams.get('id')
  const url = searchParams.get('url')

  console.log('trackingId', trackingId)
  console.log('url', url)

  if (!trackingId || !url) {
    return new NextResponse('Missing tracking ID or URL', { status: 400 })
  }

  try {
    // Insert a new record for each link click
    const { error } = await supabase
      .from('email_link_clicks')
      .insert({
        tracking_id: trackingId,
        link_url: url,
        clicked_at: new Date().toISOString()
      })

    if (error) throw error

    // Redirect to the original URL
    return NextResponse.redirect(url)
  } catch (error) {
    console.error('Error tracking email link click:', error)
    // If there's an error, still redirect to avoid breaking the user experience
    return NextResponse.redirect(url)
  }
}