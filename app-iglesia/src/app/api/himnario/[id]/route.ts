import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let hymnId = '1';

  try {
    const resolvedParams = await params;
    hymnId = resolvedParams.id;
    const num = parseInt(hymnId, 10);

    // Adventech almacena los archivos por número simple sin ceros a la izquierda (ej: 1.json, 250.json)
    const res = await fetch(
      `https://raw.githubusercontent.com/Adventech/sabbath-school-resources/master/es/hymns/${num}.json`
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Himno no encontrado en el repositorio' },
        { status: 404 }
      );
    }

    const himno = await res.json();

    // Normalizar estrofas / versos de la respuesta de Adventech
    const versesFormatted = (himno.verses || himno.stanzas || []).map((v: any, idx: number) => ({
      type: v.type || (v.isChorus ? 'chorus' : 'verse'),
      number: v.number || idx + 1,
      text: v.text || v.content || (Array.isArray(v.lines) ? v.lines.join('\n') : ''),
    }));

    return NextResponse.json({
      number: himno.number || num,
      title: himno.title || `Himno #${num}`,
      verses: versesFormatted,
      lyrics: himno.lyrics || himno.content || '',
    });
  } catch (error) {
    console.error('Error cargando letra del himno:', error);
    return NextResponse.json(
      { error: 'Error al procesar la letra del himno' },
      { status: 500 }
    );
  }
}