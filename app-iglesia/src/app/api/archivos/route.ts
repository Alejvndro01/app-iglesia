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
          select: { nombre: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Mapear campos de la BD al contrato utilizado en la UI
    const archivosFormateados = archivos.map((a) => ({
      id: a.id,
      nombre: a.titulo,
      url: a.path,
      key: a.id,
      tipo: a.mimeType,
      tamano: a.tamano,
      createdAt: a.createdAt.toISOString(),
    }));

    return NextResponse.json({ archivos: archivosFormateados }, { status: 200 });
  } catch (error) {
    console.error('[ARCHIVOS_GET_ERROR]', error);
    return NextResponse.json({ error: 'Error al consultar archivos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    let userId: string | null = null;

    // Obtener el usuario mediante la cookie de sesión JWT
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

    // Si no hay token válido, asignar el primer usuario (Admin) registrado en la DB
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
    });

    return NextResponse.json(
      {
        id: registroArchivo.id,
        nombre: registroArchivo.titulo,
        url: registroArchivo.path,
        key: registroArchivo.id,
        tipo: registroArchivo.mimeType,
        tamano: registroArchivo.tamano,
        createdAt: registroArchivo.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[ARCHIVOS_POST_ERROR]', error);
    return NextResponse.json(
      { error: 'Error interno en el servidor al registrar el recurso' },
      { status: 500 }
    );
  }
}