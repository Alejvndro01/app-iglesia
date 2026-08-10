import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase().trim() || '';

    // Consumir la API de jh0rman / Adventist-Software-Developers
    const url = query
      ? `https://himnario-adventista-api.vercel.app/api/hymns?search=${encodeURIComponent(query)}`
      : 'https://himnario-adventista-api.vercel.app/api/hymns';

    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 86400 }, // Caché de 24 horas
    });

    if (!res.ok) {
      throw new Error(`API respondió con estado ${res.status}`);
    }

    const data = await res.json();
    const list = Array.isArray(data) ? data : data.hymns || data.data || [];

    // Normalizar la respuesta al formato que usa tu interfaz
    const himnos = list.map((h: any) => ({
      number: parseInt(h.number || h.id || h.no, 10),
      title: h.title || h.name || `Himno #${h.number}`,
    }));

    return NextResponse.json(himnos.slice(0, 50));
  } catch (error) {
    console.error('Error al consultar himnario API:', error);
    return NextResponse.json(
      { error: 'Error al consultar la API de himnos' },
      { status: 500 }
    );
  }
}