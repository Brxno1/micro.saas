import { NextRequest, NextResponse } from 'next/server'

import { getUrl } from './lib/get-url'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authjs.session-token')
  const pathname = request.nextUrl.pathname

  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL(getUrl('/app')))
  }

  if (pathname === '/' && !token) {
    return NextResponse.redirect(new URL(getUrl('/auth')))
  }

  if (['/api/auth', '/auth'].includes(pathname)) {
    return NextResponse.next()
  }

  if (['/auth', '/login'].includes(pathname) && token) {
    return NextResponse.redirect(new URL(getUrl('/app')))
  }

  if (pathname.includes('/app') && !token) {
    return NextResponse.redirect(new URL(getUrl('/auth')))
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
