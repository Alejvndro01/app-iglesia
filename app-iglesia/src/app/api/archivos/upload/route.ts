import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client } from '@/lib/r2';
import { env } from '@/env';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No se adjuntó ningún archivo' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Limpiar el nombre de caracteres especiales
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `recursos/${Date.now()}-${cleanFileName}`;

    // Subida directa de Servidor (Vercel) a Cloudflare R2
    const command = new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME || process.env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type || 'application/octet-stream',
    });

    await r2Client.send(command);

    const publicUrl = `${env.R2_PUBLIC_URL || process.env.R2_PUBLIC_URL}/${key}`;

    return NextResponse.json(
      {
        publicUrl,
        key,
        fileName: file.name,
        fileType: file.type || 'application/octet-stream',
        fileSize: file.size,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[UPLOAD_R2_ERROR]', error);
    return NextResponse.json(
      { error: 'Error interno al procesar la subida a Cloudflare R2' },
      { status: 500 }
    );
  }
}