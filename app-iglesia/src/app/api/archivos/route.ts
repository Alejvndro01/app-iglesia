import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { jwtVerify } from 'jose';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_key_change_me'
);

// Obtener ID de usuario desde la Cookie JWT
async function getUserIdFromRequest(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const token = cookieHeader
    .split('; ')
    .find((row) => row.startsWith('auth_token='))
    ?.split('=')[1];

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.id as string;
  } catch {
    return null;
  }
}

// GET: Obtener lista de archivos del usuario
export async function GET(request: Request) {
  const usuarioId = await getUserIdFromRequest(request);
  if (!usuarioId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const archivos = await prisma.archivo.findMany({
      where: { usuarioId },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ archivos });
  } catch (error) {
    console.error('Error al obtener archivos:', error);
    return NextResponse.json({ error: 'Error al consultar archivos' }, { status: 500 });
  }
}

// POST: Subir archivo
export async function POST(request: Request) {
  const usuarioId = await getUserIdFromRequest(request);
  if (!usuarioId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No se subió ningún archivo' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Definir directorio de destino en servidor local/contenedor
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const filePath = path.join(uploadDir, filename);

    // Guardar en disco
    await writeFile(filePath, buffer);


        // Guardar registro en base de datos
    const nuevoArchivo = await prisma.archivo.create({
        data: {
            nombre: file.name, 
            path: `/uploads/${filename}`,
            mimeType: file.type || 'application/octet-stream',
            tamano: file.size,
            usuarioId,
        },
    });

    return NextResponse.json({ message: 'Archivo subido correctamente', archivo: nuevoArchivo });
  } catch (error) {
    console.error('Error al subir archivo:', error);
    return NextResponse.json({ error: 'Error al procesar el archivo' }, { status: 500 });
  }
}