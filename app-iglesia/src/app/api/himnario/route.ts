import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim() || '';

    // Construir endpoint según especificación
    const endpoint = query
      ? `https://himnario-api.qhar.in/hymn?search=${encodeURIComponent(query)}`
      : 'https://himnario-api.qhar.in/hymn';

    const res = await fetch(endpoint, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Error consultando API externa' }, { status: res.status });
    }

    const data = await res.json();
    const list = Array.isArray(data) ? data : [];

    // Normalizar esquema Hymn
    const himnos = list.map((h: any) => ({
      number: h.number || h.id,
      title: h.title,
      bibleReference: h.bibleReference || '',
    }));

    return NextResponse.json(himnos);
  } catch (error) {
    console.error('Error en API himnario route:', error);
    return NextResponse.json({ error: 'No se pudo conectar con la API de Himnario' }, { status: 500 });
  }
}