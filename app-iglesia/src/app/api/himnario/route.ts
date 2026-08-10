import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase().trim() || '';

    // URL oficial del índice del Himnario Adventista en Adventech
    const res = await fetch(
      'https://raw.githubusercontent.com/Adventech/sabbath-school-resources/master/es/hymns/index.json',
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) {
      throw new Error(`Adventech respondió con status ${res.status}`);
    }

    const rawData = await res.json();
    const list = Array.isArray(rawData) ? rawData : [];

    // Formatear catálogo oficial
    const himnos = list.map((h: any, index: number) => ({
      number: parseInt(h.number || h.no || h.id || index + 1, 10),
      title: h.title || h.name || `Himno #${index + 1}`,
    }));

    if (!query) {
      return NextResponse.json(himnos.slice(0, 40));
    }

    const filtrados = himnos.filter((h: any) =>
      h.number.toString().includes(query) ||
      h.title.toLowerCase().includes(query)
    );

    return NextResponse.json(filtrados.slice(0, 40));
  } catch (error) {
    console.error('Error al obtener lista de himnos:', error);
    return NextResponse.json({ error: 'Error al consultar himnos' }, { status: 500 });
  }
}