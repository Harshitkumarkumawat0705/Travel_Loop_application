import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/auth';

const protectedRoutes = ['/dashboard', '/trips/create', '/profile', '/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  if (isProtectedRoute) {
    const session = request.cookies.get('session')?.value
    
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // verify session
    const payload = await decrypt(session);
    if (!payload?.userId) {
       return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
