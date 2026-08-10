import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2Client } from '@/lib/r2';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'ClaveSecretaParaTokens_IASD_2026_UltraSegura');
    await jwtVerify(token, secret);

    const { fileName, fileType } = await request.json();

    if (!fileName || !fileType) {
      return NextResponse.json({ error: 'Nombre y tipo de archivo requeridos' }, { status: 400 });
    }

    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `recursos/${Date.now()}-${cleanFileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    // Generar URL válida por 15 minutos para subir directo a Cloudflare
    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 900 });
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    return NextResponse.json({ uploadUrl, publicUrl, key }, { status: 200 });
  } catch (error) {
    console.error('Error generando Presigned URL:', error);
    return NextResponse.json({ error: 'Error al autorizar subida' }, { status: 500 });
  }
}