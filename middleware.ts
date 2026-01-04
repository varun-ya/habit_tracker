import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Let NextAuth handle its own routes
  if (request.nextUrl.pathname.startsWith('/api/auth/')) {
    return NextResponse.next()
  }
  
  // Allow public routes
  if (request.nextUrl.pathname.startsWith('/auth/')) {
    return NextResponse.next()
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}