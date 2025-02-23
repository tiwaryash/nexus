import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

    // Protected routes
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/profile')) {
      if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

  // Auth routes (login, register)
  if ((pathname === '/login' || pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 