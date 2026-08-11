import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2Client } from '@/lib/r2';
import { env } from '@/env';
import { z } from 'zod';

const presignedSchema = z.object({
  fileName: z.string().min(1, 'El nombre del archivo es requerido'),
  fileType: z.string().min(1, 'El tipo de archivo es requerido'),
});

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const secretKey = env.JWT_SECRET || process.env.JWT_SECRET;
    if (!secretKey) {
      console.error('[PRESIGNED_ERROR] JWT_SECRET no está configurada');
      return NextResponse.json({ error: 'Error de configuración en el servidor' }, { status: 500 });
    }

    const secret = new TextEncoder().encode(secretKey);
    await jwtVerify(token, secret);

    const body = await request.json();
    const validation = presignedSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos de entrada inválidos', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { fileName, fileType } = validation.data;

    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `recursos/${Date.now()}-${cleanFileName}`;

    const command = new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME || process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    // Generar URL válida por 15 minutos para subir directo a Cloudflare
    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 900 });
    const publicUrl = `${env.R2_PUBLIC_URL || process.env.R2_PUBLIC_URL}/${key}`;

    return NextResponse.json({ uploadUrl, publicUrl, key }, { status: 200 });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
    console.error('[PRESIGNED_ERROR] Error generando Presigned URL:', errorMsg);
    return NextResponse.json({ error: 'Error al autorizar la subida del archivo' }, { status: 500 });
  }
}