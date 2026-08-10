import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client } from '@/lib/r2';

// Configurar límite de tamaño para la API Route en Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'ClaveSecretaParaTokens_IASD_2026_UltraSegura');
    const { payload } = await jwtVerify(token, secret);
    const userId = (payload.id || payload.sub) as string;

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const tituloCustom = formData.get('titulo') as string;

    if (!file) {
      return NextResponse.json({ error: 'No se adjuntó archivo' }, { status: 400 });
    }

    // Convertir archivo a Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Formatear nombre único para el bucket
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `recursos/${Date.now()}-${cleanFileName}`;

    // Subir a Cloudflare R2
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type || 'application/octet-stream',
    });

    await r2Client.send(uploadCommand);

    // Generar la URL pública
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    // Guardar la URL en Neon PostgreSQL
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
    console.error('Error al subir archivo a R2:', error);
    return NextResponse.json({ error: 'Error al procesar archivo en Cloudflare R2' }, { status: 500 });
  }
}