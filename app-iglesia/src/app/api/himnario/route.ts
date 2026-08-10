import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase().trim() || '';

    let himnos: Array<{ number: number; title: string }> = [];

    // Intentar obtener el índice remoto de Adventech
    try {
      const res = await fetch(
        'https://raw.githubusercontent.com/Adventech/sabbath-school-resources/master/es/hymns/index.json',
        { next: { revalidate: 86400 } }
      );

      if (res.ok) {
        const rawData = await res.json();
        if (Array.isArray(rawData) && rawData.length > 0) {
          himnos = rawData.map((h: any, index: number) => ({
            number: parseInt(h.number || h.no || h.id || index + 1, 10),
            title: h.title || h.name || `Himno #${index + 1}`,
          }));
        }
      }
    } catch {
      // Si falla la red, continuar con el generador local
    }

    // Fallback garantizado: Generar los 613 himnos si la red falla o está incompleta
    if (himnos.length === 0) {
      himnos = Array.from({ length: 613 }, (_, i) => ({
        number: i + 1,
        title: `Himno #${i + 1}`,
      }));
    }

    // Si no hay parámetro de búsqueda, devolver los primeros 40
    if (!query) {
      return NextResponse.json(himnos.slice(0, 40));
    }

    // Filtrar por número o por texto en título
    const filtrados = himnos.filter(
      (h) =>
        h.number.toString().includes(query) ||
        h.title.toLowerCase().includes(query)
    );

    return NextResponse.json(filtrados.slice(0, 40));
  } catch (error) {
    // Retorno seguro en caso de error crítico
    const fallback = Array.from({ length: 30 }, (_, i) => ({
      number: i + 1,
      title: `Himno #${i + 1}`,
    }));
    return NextResponse.json(fallback);
  }
}