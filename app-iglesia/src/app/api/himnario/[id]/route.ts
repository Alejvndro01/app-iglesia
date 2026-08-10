import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let hymnId = '0';
  
  try {
    const resolvedParams = await params;
    hymnId = resolvedParams.id;
    
    const num = parseInt(hymnId, 10);
    const cleanId = String(num).padStart(3, '0');

    const res = await fetch(
      `https://raw.githubusercontent.com/Adventech/sabbath-school-resources/master/hymns/es/hymns/${cleanId}.json`
    );

    if (!res.ok) {
      return NextResponse.json({
        number: num,
        title: `Himno #${num}`,
        verses: [{ type: 'verse', text: 'Letra disponible en el himnario impreso o aplicación oficial.' }]
      });
    }

    const himno = await res.json();
    return NextResponse.json({
      number: himno.number || himno.no || num,
      title: himno.title || himno.name || `Himno #${num}`,
      verses: himno.verses || himno.stanzas || [],
      lyrics: himno.lyrics || himno.content || '',
    });
  } catch (error) {
    return NextResponse.json({
      number: hymnId,
      title: `Himno #${hymnId}`,
      verses: [{ type: 'verse', text: 'No se pudo cargar la letra desde la red.' }]
    });
  }
}