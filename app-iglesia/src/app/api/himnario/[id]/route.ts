import { NextResponse } from 'next/server';

interface FormattedVerse {
  type: string;
  number: number;
  text: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let hymnNum = 1;

  try {
    const resolvedParams = await params;
    hymnNum = parseInt(resolvedParams.id, 10) || 1;

    // Obtener himno específico por su número
    const res = await fetch(
      `https://himnario-adventista-api.vercel.app/api/hymns/${hymnNum}`,
      {
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Himno no encontrado' },
        { status: 404 }
      );
    }

    const himno = await res.json();

    // Mapear versos/estrofas que devuelve el repositorio
    const rawVerses = himno.history || himno.verses || himno.stanzas || [];
    
    let versesFormatted: FormattedVerse[] = [];

    if (Array.isArray(rawVerses) && rawVerses.length > 0) {
      versesFormatted = rawVerses.map((v: any, idx: number) => ({
        type: v.type || (v.isChorus ? 'chorus' : 'verse'),
        number: v.number || idx + 1,
        text: typeof v === 'string' ? v : v.content || v.text || (Array.isArray(v.lines) ? v.lines.join('\n') : ''),
      }));
    } else if (himno.content || himno.lyrics) {
      // Si la API devuelve un solo string con la letra completa
      versesFormatted = [
        {
          type: 'verse',
          number: 1,
          text: himno.content || himno.lyrics,
        },
      ];
    }

    return NextResponse.json({
      number: himno.number || hymnNum,
      title: himno.title || `Himno #${hymnNum}`,
      verses: versesFormatted,
      mp3Cantado: himno.mp3Cantado || himno.audioSing || null,
      mp3Instrumental: himno.mp3Instrumental || himno.audioPlay || null,
    });
  } catch (error) {
    console.error('Error al obtener letra de himno:', error);
    return NextResponse.json(
      { error: 'Error interno al procesar el himno' },
      { status: 500 }
    );
  }
}