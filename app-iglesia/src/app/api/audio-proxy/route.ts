import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('id');

  if (!fileId) {
    return new NextResponse('Falta el ID del archivo', { status: 400 });
  }

  // URL directa de descarga omitiendo confirmaciones de Google Drive
  const driveUrl = `https://drive.google.com/uc?export=download&confirm=t&id=${fileId}`;

  try {
    // 1. Reenviar la cabecera Range enviada por el navegador del cliente
    const rangeHeader = request.headers.get('range');
    const fetchHeaders: HeadersInit = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    };

    if (rangeHeader) {
      fetchHeaders['Range'] = rangeHeader;
    }

    const audioRes = await fetch(driveUrl, {
      headers: fetchHeaders,
      redirect: 'follow',
    });

    // Aceptar tanto 200 OK como 206 Partial Content
    if ((!audioRes.ok && audioRes.status !== 206) || !audioRes.body) {
      return new NextResponse('Error al obtener el audio desde Google Drive', {
        status: audioRes.status || 502,
      });
    }

    // 2. Construir encabezados para permitir seeking y streaming por partes
    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', audioRes.headers.get('content-type') || 'audio/mpeg');
    responseHeaders.set('Accept-Ranges', 'bytes');
    responseHeaders.set('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800');

    if (audioRes.headers.has('content-length')) {
      responseHeaders.set('Content-Length', audioRes.headers.get('content-length')!);
    }
    if (audioRes.headers.has('content-range')) {
      responseHeaders.set('Content-Range', audioRes.headers.get('content-range')!);
    }

    // Retornar 206 si el cliente solicitó rango y el origen respondió con 206
    const status = rangeHeader && audioRes.status === 206 ? 206 : 200;

    return new NextResponse(audioRes.body as ReadableStream, {
      status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Error en el proxy de audio:', error);
    return new NextResponse('Error interno al procesar el audio', { status: 500 });
  }
}