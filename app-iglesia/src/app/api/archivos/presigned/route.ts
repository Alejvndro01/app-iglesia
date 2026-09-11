import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { env as envVars } from '@/env';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2Client } from '@/lib/r2';
import { env } from '@/env';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
    try {
      const secret = new TextEncoder().encode(envVars.JWT_SECRET);
      await jwtVerify(token, secret);
    } catch {
      return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 });
    }
    const { fileName, fileType } = await request.json();

    if (!fileName) {
      return NextResponse.json({ error: 'Nombre de archivo requerido' }, { status: 400 });
    }

    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `recursos/${Date.now()}-${cleanFileName}`;
    const contentType = fileType || 'application/octet-stream';

    const command = new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME || process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    // OBLIGATORIO PARA R2: Incluir 'content-type' en los encabezados firmados
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