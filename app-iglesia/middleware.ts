import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_key_change_me'
);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  // Si intenta acceder a rutas protegidas sin token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Validar firma y expiración del JWT
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch (error) {
    // Token inválido o expirado -> Redirigir a login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Especificar qué rutas proteger
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};