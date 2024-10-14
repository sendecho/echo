import { type NextFetchEvent, type NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "../supabase/admin";

export default async function TrackingMiddleware(request: NextRequest, event: NextFetchEvent) {

  const supabase = createAdminClient()
  const searchParams = new URL(request.url).searchParams;
  console.log(Object.fromEntries(searchParams.entries()))


  const trackingId = searchParams.get("id");
  const url = searchParams.get("url");

  console.log("trackingId", trackingId);
  console.log("url", url);

  // Link tracking
  if (request.nextUrl.pathname.startsWith("/l")) {
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

  // Link tracking
  if (request.nextUrl.pathname.startsWith("/o")) {

    // Insert a new record for each open event
    const { error } = await supabase
      .from('email_opens')
      .insert({
        tracking_id: trackingId as string,
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

    // return NextResponse.rewrite(new URL("/api/track-email-link", request.url))
  }

  return NextResponse.next();
}
