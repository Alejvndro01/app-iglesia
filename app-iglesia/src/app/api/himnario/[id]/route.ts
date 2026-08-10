import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let hymnNum = 1;

  try {
    const resolvedParams = await params;
    hymnNum = parseInt(resolvedParams.id, 10) || 1;

    // Formatear el ID sin ceros a la izquierda (ej: 1, 25, 300)
    const res = await fetch(
      `https://raw.githubusercontent.com/Adventech/sabbath-school-resources/master/es/hymns/${hymnNum}.json`
    );

    if (res.ok) {
      const himno = await res.json();
      const versesFormatted = (himno.verses || himno.stanzas || []).map(
        (v: any, idx: number) => ({
          type: v.type || (v.isChorus ? 'chorus' : 'verse'),
          number: v.number || idx + 1,
          text:
            v.text ||
            v.content ||
            (Array.isArray(v.lines) ? v.lines.join('\n') : ''),
        })
      );

      return NextResponse.json({
        number: himno.number || hymnNum,
        title: himno.title || `Himno #${hymnNum}`,
        verses: versesFormatted,
        lyrics: himno.lyrics || himno.content || '',
      });
    }
  } catch (error) {
    console.error('Error al solicitar letra remota:', error);
  }

  // Fallback si la letra no se encuentra en la API externa
  return NextResponse.json({
    number: hymnNum,
    title: `Himno #${hymnNum}`,
    verses: [
      {
        type: 'verse',
        number: 1,
        text: 'La letra completa de este himno está disponible en la aplicación oficial o el himnario impreso.',
      },
    ],
  });
}