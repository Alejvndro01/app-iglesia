import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { host } = request.nextUrl;
  const canonicalHost = 'iasd-hualqui.vercel.app';

  // 1. Forzar el dominio de producción si el usuario entra por una URL de preview de Vercel (*.vercel.app)
  if (host && host.includes('vercel.app') && host !== canonicalHost) {
    const url = request.nextUrl.clone();
    url.host = canonicalHost;
    url.protocol = 'https';
    return NextResponse.redirect(url, 301);
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