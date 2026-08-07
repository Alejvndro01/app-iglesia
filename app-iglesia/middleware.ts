import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_key_change_me'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  // Si ya tiene token e intenta ir a /login, redirigir al dashboard
  if (token && pathname === '/login') {
    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch {
      // Token inválido, continuar a login
    }
  }

  // Proteger solo rutas /dashboard y /admin
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login'],
};