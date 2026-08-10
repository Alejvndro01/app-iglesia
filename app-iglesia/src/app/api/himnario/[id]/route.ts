import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let hymnNum = 1;

  try {
    const resolvedParams = await params;
    hymnNum = parseInt(resolvedParams.id, 10) || 1;

    // Intentar consultar API de Himnos
    const res = await fetch(`https://api.adventistas.io/v1/himnos/${hymnNum}`, {
      next: { revalidate: 86400 },
    });

    if (res.ok) {
      const data = await res.json();
      const himno = data.himno || data;

      const versesFormatted = (himno.estrofas || himno.verses || []).map((v: any, idx: number) => ({
        type: v.coro || v.isChorus || v.type === 'chorus' ? 'chorus' : 'verse',
        number: v.numero || v.number || idx + 1,
        text: typeof v === 'string' ? v : v.texto || v.text || v.content || '',
      }));

      return NextResponse.json({
        number: himno.numero || himno.number || hymnNum,
        title: himno.titulo || himno.title || `Himno #${hymnNum}`,
        verses: versesFormatted.length > 0 ? versesFormatted : [{ type: 'verse', number: 1, text: himno.letra || himno.content || '' }],
      });
    }

    // Fallback a API secundaria si la primera falla
    const altRes = await fetch(`https://raw.githubusercontent.com/IgrejaAdventista/himnario-adventista-json/main/himnos/${hymnNum}.json`);
    if (altRes.ok) {
      const himno = await altRes.json();
      return NextResponse.json({
        number: hymnNum,
        title: himno.titulo || himno.title,
        verses: (himno.estrofas || []).map((text: string, idx: number) => ({
          type: 'verse',
          number: idx + 1,
          text,
        })),
      });
    }
  } catch (error) {
    console.error('Error al obtener letra del himno:', error);
  }

  return NextResponse.json({
    number: hymnNum,
    title: `Himno #${hymnNum}`,
    verses: [
      {
        type: 'verse',
        number: 1,
        text: 'Servicio de letras en mantenimiento. Por favor reintenta en unos instantes.',
      },
    ],
  });
}