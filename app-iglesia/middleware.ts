import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, host } = request.nextUrl;
  const canonicalHost = 'iasd-hualqui.vercel.app';

  // 1. Forzar el dominio de producción si el usuario entra por una URL de preview de Vercel (*.vercel.app)
  if (host && host.includes('vercel.app') && host !== canonicalHost) {
    const url = request.nextUrl.clone();
    url.host = canonicalHost;
    url.protocol = 'https';
    return NextResponse.redirect(url, 301);
  }

  // 2. Extraer los tokens soportados (NextAuth / JWT personalizado)
  const token =
    request.cookies.get('auth_token')?.value ||
    request.cookies.get('authjs.session-token')?.value ||
    request.cookies.get('__Secure-authjs.session-token')?.value ||
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value;

  // 3. Redirigir fuera del login si ya tiene sesión
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 4. Proteger rutas privadas
  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
      Aplica a todas las rutas excepto archivos estáticos (imágenes, CSS, favicon)
    */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};