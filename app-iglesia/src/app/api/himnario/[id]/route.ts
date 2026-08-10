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

    const himno = await res.json(); // Esquema HymnSequence

    // Mapear el arreglo 'verses' de la API
    const versesFormatted: FormattedVerse[] = (himno.verses || []).map((v: any) => {
      // Unir los fragmentos dentro de contents[]
      const stanzaText = (v.contents || [])
        .map((c: any) => c.content)
        .join('\n');

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
      mp3Url: himno.mp3Url,
      mp3UrlInstr: himno.mp3UrlInstr,
      verses: versesFormatted,
      sequence: himno.sequence || [],
    });
  } catch (error) {
    console.error('Error al obtener canción:', error);
    return NextResponse.json({ error: 'Error al procesar el himno' }, { status: 500 });
  }
}