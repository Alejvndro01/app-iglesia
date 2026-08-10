import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';

    // Consumir el dataset del Himnario Adventista de Adventech
    const res = await fetch(
      'https://raw.githubusercontent.com/Adventech/sabbath-school-resources/master/hymns/es/index.json',
      { next: { revalidate: 86400 } } // Caché por 24 horas
    );

    if (!res.ok) {
      throw new Error('No se pudo conectar con la API de Himnario');
    }

    const himnos = await res.json();

    // Si no hay búsqueda, retornar los primeros 20 o lista completa
    if (!query) {
      return NextResponse.json(himnos.slice(0, 30));
    }

    // Filtrar por número o por título
    const filtrados = himnos.filter((h: any) =>
      h.number.toString().includes(query) ||
      h.title.toLowerCase().includes(query)
    );

    return NextResponse.json(filtrados.slice(0, 30));
  } catch (error) {
    console.error('Error al consultar el himnario:', error);
    return NextResponse.json({ error: 'Error al obtener himnos' }, { status: 500 });
  }
}