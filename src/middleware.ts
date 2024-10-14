import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { APP_URL, TRACKING_HOSTNAMES } from '@/lib/constants/main'
export async function middleware(request: NextRequest) {
  const domain = request.headers.get("host") as string;

  // Handle tracking requests
  if (TRACKING_HOSTNAMES.has(domain)) {
    if (request.nextUrl.pathname.startsWith("/o")) {
      return NextResponse.rewrite(new URL("/api/track-email-open", request.url))
    }

    if (request.nextUrl.pathname.startsWith("/l")) {
      return NextResponse.rewrite(new URL("/api/track-email-link", request.url))
    }
    return NextResponse.redirect(new URL(APP_URL))
  }


  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - unsubscribe (unsubscribe path)
     * - api (API routes)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|unsubscribe|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}