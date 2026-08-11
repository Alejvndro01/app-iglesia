import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2Client } from '@/lib/r2';
import { env } from '@/env';

export async function POST(request: Request) {
  try {
    const { fileName, fileType } = await request.json();

    if (!fileName) {
      return NextResponse.json({ error: 'Nombre de archivo requerido' }, { status: 400 });
    }

    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `recursos/${Date.now()}-${cleanFileName}`;
    const contentType = fileType || 'application/octet-stream';

    // Se especifica ContentType en el comando para que se incluya en los SignedHeaders
    const command = new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME || process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    // Generar la Presigned URL deshabilitando checksums automáticos de AWS SDK v3
    const uploadUrl = await getSignedUrl(r2Client, command, {
      expiresIn: 900,
      signableHeaders: new Set(['host', 'content-type']),
    });

    const publicUrl = `${env.R2_PUBLIC_URL || process.env.R2_PUBLIC_URL}/${key}`;

    return NextResponse.json({
      uploadUrl,
      publicUrl,
      key,
    });
  } catch (error) {
    console.error('[PRESIGNED_ERROR]', error);
    return NextResponse.json(
      { error: 'Error al generar la URL presignada para R2' },
      { status: 500 }
    );
  }
}