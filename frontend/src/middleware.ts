import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  const token = request.cookies.get('token');

  // Service protection
  if (request.nextUrl.pathname.startsWith('/service') && !token) {
    return NextResponse.redirect(new URL('/login?redirect=/service', request.url));
  }

  return NextResponse.next();
}

// Csak ezeken az útvonalakon fusson le a middleware
export const config = {
  matcher: ['/service/:path*'],
};