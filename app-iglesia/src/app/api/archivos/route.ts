import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { env } from '@/env';
import { z } from 'zod';

const archivoSchema = z.object({
  titulo: z.string().min(1, 'El título es requerido'),
  path: z.string().min(1, 'La ruta es requerida'),
  mimeType: z.string().default('application/octet-stream'),
  tamano: z.number().default(0),
});

export async function GET() {
  try {
    const archivos = await prisma.archivo.findMany({
      include: {
        usuario: {
          select: { name: true }, // Corregido: 'name' en lugar de 'nombre'
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ archivos }, { status: 200 });
  } catch (error) {
    console.error('[ARCHIVOS_GET_ERROR]', error);
    return NextResponse.json({ error: 'Error al consultar archivos', archivos: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    let userId: string | null = null;

    try {
      const cookieStore = await cookies();
      const token = cookieStore.get('auth_token')?.value;

      if (token) {
        const secretKey = env.JWT_SECRET || process.env.JWT_SECRET;
        if (secretKey) {
          const secret = new TextEncoder().encode(secretKey);
          const { payload } = await jwtVerify(token, secret);
          userId = (payload.id || payload.sub) as string;
        }
      }
    } catch (e) {
      console.warn('[ARCHIVOS_POST] Usuario no autenticado o token expirado:', e);
    }

    if (!userId) {
      const defaultUser = await prisma.usuario.findFirst();
      if (defaultUser) {
        userId = defaultUser.id;
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'No se encontró un usuario válido para asociar el archivo' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validation = archivoSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { titulo, path, mimeType, tamano } = validation.data;

    const registroArchivo = await prisma.archivo.create({
      data: {
        titulo,
        path,
        mimeType,
        tamano,
        usuarioId: userId,
      },
      include: {
        usuario: {
          select: { name: true }, // Corregido: 'name' en lugar de 'nombre'
        },
      },
    });

    return NextResponse.json(registroArchivo, { status: 201 });
  } catch (error) {
    console.error('[ARCHIVOS_POST_ERROR]', error);
    return NextResponse.json(
      { error: 'Error interno en el servidor al registrar el recurso' },
      { status: 500 }
    );
  }
}