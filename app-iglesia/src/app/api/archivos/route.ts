import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'ClaveSecretaParaTokens_IASD_2026_UltraSegura'
    );
    const { payload } = await jwtVerify(token, secret);
    const userId = (payload.id || payload.sub) as string;

    const { titulo, path, mimeType, tamano } = await request.json();

    if (!path || !titulo) {
      return NextResponse.json(
        { error: 'Título y ruta de archivo requeridos' },
        { status: 400 }
      );
    }

    // Registra la URL enviada por el cliente directamente en Neon PostgreSQL
    const registroArchivo = await prisma.archivo.create({
      data: {
        titulo,
        path,
        mimeType: mimeType || 'application/octet-stream',
        tamano: Number(tamano) || 0,
        usuarioId: userId,
      },
    });

    return NextResponse.json(registroArchivo, { status: 201 });
  } catch (error) {
    console.error('Error al registrar archivo en DB:', error);
    return NextResponse.json(
      { error: 'Error interno en el servidor al registrar el recurso' },
      { status: 500 }
    );
  }
}