import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createAdminClient()

export async function GET(request: NextRequest) {
  const trackingId = request.nextUrl.searchParams.get('id')

  if (!trackingId) {
    return new NextResponse('Missing tracking ID', { status: 400 })
  }

  try {
    // Insert a new record for each open event
    const { error } = await supabase
      .from('email_opens')
      .insert({
        tracking_id: trackingId,
        opened_at: new Date().toISOString()
      })

    if (error) throw error

    // Return a 1x1 transparent GIF
    return new NextResponse(Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'), {
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error('Error tracking email open:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}