import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const domain = request.headers.get("host")

  // Handle tracking requests
  if (domain === "t.localhost:3000" && request.nextUrl.pathname.startsWith("/o")) {
    return NextResponse.rewrite(new URL("/api/track-email-open", request.url))
  }

  if (domain === "t.localhost:3000" && request.nextUrl.pathname.startsWith("/l")) {
    return NextResponse.rewrite(new URL("/api/track-email-link", request.url))
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