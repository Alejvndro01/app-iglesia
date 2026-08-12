import { NextResponse } from 'next/server';

const MAPA_LIBROS: Record<string, string> = {
  'Génesis': 'genesis',
  'Éxodo': 'exodus',
  'Levítico': 'leviticus',
  'Números': 'numbers',
  'Deuteronomio': 'deuteronomy',
  'Josué': 'joshua',
  'Jueces': 'judges',
  'Rut': 'ruth',
  '1 Samuel': '1samuel',
  '2 Samuel': '2samuel',
  '1 Reyes': '1kings',
  '2 Reyes': '2kings',
  'Salmos': 'psalms',
  'Proverbios': 'proverbs',
  'Isaías': 'isaiah',
  'Mateo': 'matthew',
  'Marcos': 'mark',
  'Lucas': 'luke',
  'Juan': 'john',
  'Hechos': 'acts',
  'Romanos': 'romans',
  'Apocalipsis': 'revelation',
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const libroEs = searchParams.get('libro') || 'Salmos';
  const capitulo = searchParams.get('capitulo') || '1';

  const libroSlug = MAPA_LIBROS[libroEs] || libroEs.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  try {
    const res = await fetch(
      `https://bible-api.com/${libroSlug}+${capitulo}?translation=rvr1960`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) {
      // Fallback a traducción estándar si rvr1960 no responde
      const resFallback = await fetch(`https://bible-api.com/${libroSlug}+${capitulo}`);
      if (!resFallback.ok) throw new Error('No encontrado');
      const dataFallback = await resFallback.json();
      return NextResponse.json(dataFallback);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'No se pudo cargar el capítulo solicitado.' },
      { status: 500 }
    );
  }
}