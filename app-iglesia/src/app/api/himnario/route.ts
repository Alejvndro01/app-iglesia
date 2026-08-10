import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase().trim() || '';

    // Consultar API JSON directa de himnos adventistas
    const res = await fetch(
      'https://raw.githubusercontent.com/adventech/sabbath-school-resources/master/es/hymns/index.json',
      { cache: 'no-store' }
    );

    let rawData = [];
    if (res.ok) {
      rawData = await res.json();
    }

    let himnos = Array.isArray(rawData)
      ? rawData.map((h: any) => ({
          number: parseInt(h.number || h.no || h.id, 10),
          title: h.title || h.name || `Himno #${h.number}`,
        }))
      : [];

    // Si falla la red, generar índice con nombres estándar
    if (himnos.length === 0) {
      himnos = Array.from({ length: 613 }, (_, i) => ({
        number: i + 1,
        title: `Himno #${i + 1}`,
      }));
    }

    if (!query) {
      return NextResponse.json(himnos.slice(0, 50));
    }

    const filtrados = himnos.filter(
      (h) =>
        h.number.toString().includes(query) ||
        h.title.toLowerCase().includes(query)
    );

    return NextResponse.json(filtrados.slice(0, 50));
  } catch (error) {
    return NextResponse.json({ error: 'Error al consultar himnos' }, { status: 500 });
  }
}