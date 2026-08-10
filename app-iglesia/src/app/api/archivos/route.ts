import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

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

    return NextResponse.json(archivos);
  } catch (error) {
    console.error('Error al obtener archivos:', error);
    return NextResponse.json({ error: 'Error al consultar archivos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    let userId: string | null = null;

    // Intentar obtener el usuario mediante la cookie de sesión JWT
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get('auth_token')?.value;

      if (token) {
        const secret = new TextEncoder().encode(
          process.env.JWT_SECRET || 'ClaveSecretaParaTokens_IASD_2026_UltraSegura'
        );
        const { payload } = await jwtVerify(token, secret);
        userId = (payload.id || payload.sub) as string;
      }
    } catch (e) {
      console.warn('Usuario no autenticado o token expirado, guardando archivo genérico:', e);
    }

    // Si no hay token válido, buscar el primer usuario (ej. Admin) registrado en la DB
    if (!userId) {
      const defaultUser = await prisma.usuario.findFirst();
      if (defaultUser) {
        userId = defaultUser.id;
      }
    }

    const { titulo, path, mimeType, tamano } = await request.json();

    if (!path || !titulo) {
      return NextResponse.json(
        { error: 'Título y ruta de archivo requeridos' },
        { status: 400 }
      );
    }

    // Insertar forzoso en la base de datos Neon
    const registroArchivo = await prisma.archivo.create({
      data: {
        titulo,
        path,
        mimeType: mimeType || 'application/octet-stream',
        tamano: Number(tamano) || 0,
        usuarioId: userId || '',
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