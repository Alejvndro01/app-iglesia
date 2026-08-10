import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase().trim() || '';

    const res = await fetch(
      'https://raw.githubusercontent.com/Adventech/sabbath-school-resources/master/hymns/es/index.json',
      { next: { revalidate: 86400 } }
    );

    let rawData = [];
    if (res.ok) {
      rawData = await res.json();
    }

    // Asegurar parseo flexible de campos de Adventech
    const list = Array.isArray(rawData) ? rawData : [];
    const himnos = list.map((h: any, index: number) => ({
      number: h.number || h.no || h.id || index + 1,
      title: h.title || h.name || `Himno ${h.number || h.no || index + 1}`,
    }));

    // Si la lista remota falló, generar catálogo dinámico del 1 al 613
    const finalCatalog = himnos.length > 0 ? himnos : Array.from({ length: 613 }, (_, i) => ({
      number: i + 1,
      title: `Himno #${i + 1}`,
    }));

    if (!query) {
      return NextResponse.json(finalCatalog.slice(0, 40));
    }

    const filtrados = finalCatalog.filter((h: any) =>
      h.number.toString().includes(query) ||
      h.title.toLowerCase().includes(query)
    );

    return NextResponse.json(filtrados.slice(0, 40));
  } catch (error) {
    // Fallback de emergencia local en caso de timeout
    const fallback = Array.from({ length: 50 }, (_, i) => ({
      number: i + 1,
      title: `Himno #${i + 1}`,
    }));
    return NextResponse.json(fallback);
  }
}