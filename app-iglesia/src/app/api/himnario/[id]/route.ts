import { NextResponse } from 'next/server';

interface FormattedVerse {
  type: string;
  number: number;
  text: string;
}

// Extrae el ID de Google Drive y construye la URL hacia nuestro Proxy local
function getProxyAudioUrl(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `/api/audio-proxy?id=${match[1]}`;
  }
  return url;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const num = parseInt(resolvedParams.id, 10);

    const res = await fetch(`https://himnario-api.qhar.in/hymn/${num}`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Himno no encontrado' }, { status: 404 });
    }

    const himno = await res.json();

    const versesFormatted: FormattedVerse[] = (himno.verses || []).map((v: any) => {
      const stanzaText = (v.contents || []).map((c: any) => c.content).join('\n');
      return {
        type: v.number === 0 ? 'chorus' : 'verse',
        number: v.number,
        text: stanzaText,
      };
    });

    return NextResponse.json({
      number: himno.number,
      title: himno.title,
      bibleReference: himno.bibleReference,
      mp3Url: getProxyAudioUrl(himno.mp3Url),
      mp3UrlInstr: getProxyAudioUrl(himno.mp3UrlInstr),
      verses: versesFormatted,
    });
  } catch (error) {
    console.error('Error al obtener canción:', error);
    return NextResponse.json({ error: 'Error al procesar el himno' }, { status: 500 });
  }
}