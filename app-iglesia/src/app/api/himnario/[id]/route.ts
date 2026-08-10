import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase().trim() || '';

    // Obtener dataset oficial de Adventech
    const res = await fetch(
      'https://raw.githubusercontent.com/Adventech/sabbath-school-resources/master/hymns/es/index.json',
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) {
      throw new Error('Error de conexión con Adventech');
    }

    const rawHimnos = await res.json();

    // Normalizar la lista para garantizar number y title
    const himnos = rawHimnos.map((h: any) => ({
      number: h.number || h.no || h.id,
      title: h.title || h.name || `Himno ${h.number || h.no}`,
    }));

    if (!query) {
      return NextResponse.json(himnos.slice(0, 30));
    }

    const filtrados = himnos.filter((h: any) =>
      h.number?.toString().includes(query) ||
      h.title?.toLowerCase().includes(query)
    );

    return NextResponse.json(filtrados.slice(0, 30));
  } catch (error) {
    console.error('Error en API himnario:', error);
    return NextResponse.json({ error: 'Error al consultar himnos' }, { status: 500 });
  }
}