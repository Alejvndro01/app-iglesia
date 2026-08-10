import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('id');

  if (!fileId) {
    return new NextResponse('Falta el ID del archivo', { status: 400 });
  }

  // URL de descarga directa desde Google Drive
  const driveUrl = `https://docs.google.com/uc?export=download&id=${fileId}`;

  try {
    const audioRes = await fetch(driveUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!audioRes.ok || !audioRes.body) {
      return new NextResponse('Error al obtener el audio desde Google Drive', {
        status: audioRes.status,
      });
    }

    // Retornar la transmisión binaria con las cabeceras multimedia adecuadas
    const headers = new Headers();
    headers.set('Content-Type', 'audio/mpeg');
    headers.set('Cache-Control', 'public, max-age=86400, s-maxage=86400');

    return new NextResponse(audioRes.body as ReadableStream, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error en el proxy de audio:', error);
    return new NextResponse('Error interno al procesar el audio', { status: 500 });
  }
}