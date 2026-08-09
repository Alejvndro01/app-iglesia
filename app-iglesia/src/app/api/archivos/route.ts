import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret_key');
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.id as string;

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No se subió ningún archivo' }, { status: 400 });
    }

    const filename = file.name;
    const filePath = `/uploads/${filename}`;

    const nuevoArchivo = await prisma.archivo.create({
      data: {
        nombre: filename,
        path: filePath,
        mimeType: file.type || 'application/octet-stream',
        tamano: file.size,
        usuarioId: userId,
      },
    });

    return NextResponse.json({ message: 'Archivo guardado', archivo: nuevoArchivo });
  } catch (error) {
    console.error('Error al subir archivo:', error);
    return NextResponse.json({ error: 'Error al procesar archivo' }, { status: 500 });
  }
}