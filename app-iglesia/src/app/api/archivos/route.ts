import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

// GET: Listar archivos guardados
export async function GET() {
  try {
    const archivos = await prisma.archivo.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        titulo: true,
        path: true,
        mimeType: true,
        tamano: true,
        createdAt: true,
        usuario: { select: { nombre: true } },
      },
    });
    return NextResponse.json(archivos);
  } catch (error) {
    return NextResponse.json({ error: 'Error al consultar archivos' }, { status: 500 });
  }
}

// POST: Procesar archivo en memoria y guardar en Neon PostgreSQL
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'iasd_central_hualqui_secret_2026');
    const { payload } = await jwtVerify(token, secret);
    const userId = (payload.id || payload.sub) as string;

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const tituloCustom = formData.get('titulo') as string;

    if (!file) {
      return NextResponse.json({ error: 'No se adjuntó archivo' }, { status: 400 });
    }

    // Convertir el archivo a Buffer y luego a cadena Base64 Data URL
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Content = `data:${file.type || 'application/octet-stream'};base64,${buffer.toString('base64')}`;

    const registroArchivo = await prisma.archivo.create({
      data: {
        titulo: tituloCustom || file.name,
        path: base64Content, // Se almacena como Data URL para descarga directa desde el navegador
        contenido: base64Content,
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