import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let num = 1;
  try {
    const resolvedParams = await params;
    num = parseInt(resolvedParams.id, 10) || 1;

    // Fetch directo a la ruta JSON de Adventech
    const res = await fetch(
      `https://raw.githubusercontent.com/adventech/sabbath-school-resources/master/es/hymns/${num}/index.json`
    );

    if (res.ok) {
      const himno = await res.json();
      const verses = (himno.verses || himno.stanzas || []).map((v: any, idx: number) => ({
        type: v.type || (v.isChorus ? 'chorus' : 'verse'),
        number: v.number || idx + 1,
        text: v.text || (Array.isArray(v.lines) ? v.lines.join('\n') : v.content || ''),
      }));

      return NextResponse.json({
        number: himno.number || num,
        title: himno.title || `Himno #${num}`,
        verses: verses.length > 0 ? verses : [{ type: 'verse', number: 1, text: himno.content || '' }],
      });
    }
  } catch (err) {
    console.error('Error al cargar himno:', err);
  }

  return NextResponse.json({
    number: num,
    title: `Himno #${num}`,
    verses: [
      {
        type: 'verse',
        number: 1,
        text: 'Alaba al Creador con gozo y gratitud.\n(Contenido en proceso de sincronización).',
      },
    ],
  });
}