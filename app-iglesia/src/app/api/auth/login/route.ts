import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    // Firmar JWT incluyendo ID y ROL real del usuario
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret_key');
    const token = await new SignJWT({ id: usuario.id, email: usuario.email, role: usuario.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('8h')
      .sign(secret);

    const response = NextResponse.json({
      message: 'Login exitoso',
      user: { nombre: usuario.nombre, email: usuario.email, role: usuario.role },
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}