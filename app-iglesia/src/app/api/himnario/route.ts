import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase().trim() || '';

    // API pública con los 613 himnos del Himnario Adventista
    const res = await fetch('https://api.adventistas.io/v1/himnos', {
      next: { revalidate: 86400 }, // Caché de 24 horas
    });

    let rawData = [];
    if (res.ok) {
      rawData = await res.json();
    } else {
      // Fallback a API alternativa de himnario
      const altRes = await fetch(
        'https://raw.githubusercontent.com/IgrejaAdventista/himnario-adventista-json/main/himnos.json'
      );
      if (altRes.ok) rawData = await altRes.json();
    }

    const list = Array.isArray(rawData)
      ? rawData
      : rawData.himnos || rawData.data || [];

    const himnos: Array<{ number: number; title: string }> = list.map(
      (h: any, idx: number) => ({
        number: parseInt(h.numero || h.number || h.id || idx + 1, 10),
        title: h.titulo || h.title || h.nombre || `Himno #${idx + 1}`,
      })
    );

    if (!query) {
      return NextResponse.json(himnos.slice(0, 50));
    }

    const filtrados = himnos.filter(
      (h: { number: number; title: string }) =>
        h.number.toString().includes(query) ||
        h.title.toLowerCase().includes(query)
    );

    return NextResponse.json(filtrados.slice(0, 50));
  } catch (error) {
    console.error('Error al obtener lista de himnos:', error);
    return NextResponse.json(
      { error: 'Error al consultar himnos' },
      { status: 500 }
    );
  }
}