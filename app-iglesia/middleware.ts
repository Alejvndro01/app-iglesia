import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, host } = request.nextUrl;
  const canonicalHost = 'iasd-hualqui.vercel.app';

  // 1. Redirección canónica para evitar descalces CSRF/PKCE en Vercel Preview
  if (host && host.includes('vercel.app') && host !== canonicalHost) {
    const url = request.nextUrl.clone();
    url.host = canonicalHost;
    url.protocol = 'https';
    return NextResponse.redirect(url, 301);
  }

  // 2. Extracción de tokens (soporta NextAuth/Auth.js v5 y JWT personalizado)
  const token =
    request.cookies.get('auth_token')?.value ||
    request.cookies.get('authjs.session-token')?.value ||
    request.cookies.get('__Secure-authjs.session-token')?.value ||
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value;

  // 3. Redirección de usuario autenticado lejos del login
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 4. Protección de rutas privadas
  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login'],
};