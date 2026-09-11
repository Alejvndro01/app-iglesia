import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { env } from '@/env';

async function requireAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return null;
    const secret = new TextEncoder().encode(env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== 'ADMIN') return null;
    return payload;
  } catch {
    return null;
  }
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  try {
    const oraciones = await prisma.oracion.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ oraciones });
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener oraciones' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  try {
    const body = await request.json();
    const { id, status } = body;

    const oracion = await prisma.oracion.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ oracion });
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar oración' }, { status: 500 });
  }
}