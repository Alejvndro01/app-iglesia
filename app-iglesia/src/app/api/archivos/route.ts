import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// GET: Listar archivos guardados
export async function GET() {
  try {
    const archivos = await prisma.archivo.findMany({
      orderBy: { createdAt: 'desc' },
      include: { usuario: { select: { nombre: true } } },
    });
    return NextResponse.json(archivos);
  } catch (error) {
    return NextResponse.json({ error: 'Error al consultar archivos' }, { status: 500 });
  }
}

// POST: Guardar archivo en disco y registrar en BD
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'iasd_central_hualqui_secret_2026');
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.id as string;

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const tituloCustom = formData.get('titulo') as string;

    if (!file) {
      return NextResponse.json({ error: 'No se adjuntó archivo' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Guardar archivo en carpeta /public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const filePath = path.join(uploadDir, uniqueName);
    await writeFile(filePath, buffer);

    // Apunta al endpoint de la API dinámica para evitar 404 estáticos en Next.js Standalone
    const publicUrl = `/api/archivos/${uniqueName}`;

    const registroArchivo = await prisma.archivo.create({
      data: {
        titulo: tituloCustom || file.name,
        path: publicUrl,
        mimeType: file.type || 'application/octet-stream',
        tamano: file.size,
        usuarioId: userId,
      },
    });

    return NextResponse.json(registroArchivo, { status: 201 });
  } catch (error) {
    console.error('Error al subir archivo:', error);
    return NextResponse.json({ error: 'Error al procesar archivo en el servidor' }, { status: 500 });
  }
}