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

    if (!email || !password) {
      return NextResponse.json({ error: 'Correo y contraseña requeridos' }, { status: 400 });
    }

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const jwtSecret = process.env.JWT_SECRET || 'iasd_central_hualqui_secret_2026';
    const secret = new TextEncoder().encode(jwtSecret);

    const token = await new SignJWT({
      id: usuario.id,
      email: usuario.email,
      rol: usuario.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('8h')
      .sign(secret);

    const response = NextResponse.json({
      message: 'Login exitoso',
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.role,
      },
    });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Error en /api/auth/login:', error);
    return NextResponse.json({ error: 'Error en el servidor al autenticar' }, { status: 500 });
  }
}