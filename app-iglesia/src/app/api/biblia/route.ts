import { NextResponse } from 'next/server';

// Mapeo numérico estándar de los 66 libros de la Biblia
const LIBROS_MAP: Record<string, { slug: string; id: number }> = {
  'Génesis': { slug: 'genesis', id: 1 },
  'Éxodo': { slug: 'exodo', id: 2 },
  'Levítico': { slug: 'levitico', id: 3 },
  'Números': { slug: 'numeros', id: 4 },
  'Deuteronomio': { slug: 'deuteronomio', id: 5 },
  'Josué': { slug: 'josue', id: 6 },
  'Jueces': { slug: 'jueces', id: 7 },
  'Rut': { slug: 'rut', id: 8 },
  '1 Samuel': { slug: '1-samuel', id: 9 },
  '2 Samuel': { slug: '2-samuel', id: 10 },
  '1 Reyes': { slug: '1-reyes', id: 11 },
  '2 Reyes': { slug: '2-reyes', id: 12 },
  '1 Crónicas': { slug: '1-cronicas', id: 13 },
  '2 Crónicas': { slug: '2-cronicas', id: 14 },
  'Esdras': { slug: 'esdras', id: 15 },
  'Nehemías': { slug: 'nehemias', id: 16 },
  'Ester': { slug: 'ester', id: 17 },
  'Job': { slug: 'job', id: 18 },
  'Salmos': { slug: 'salmos', id: 19 },
  'Proverbios': { slug: 'proverbios', id: 20 },
  'Eclesiastés': { slug: 'eclesiastes', id: 21 },
  'Cantares': { slug: 'cantares', id: 22 },
  'Isaías': { slug: 'isaias', id: 23 },
  'Jeremías': { slug: 'jeremias', id: 24 },
  'Lamentaciones': { slug: 'lamentaciones', id: 25 },
  'Ezequiel': { slug: 'ezequiel', id: 26 },
  'Daniel': { slug: 'daniel', id: 27 },
  'Oseas': { slug: 'oseas', id: 28 },
  'Joel': { slug: 'joel', id: 29 },
  'Amós': { slug: 'amos', id: 30 },
  'Abdías': { slug: 'abdias', id: 31 },
  'Jonás': { slug: 'jonas', id: 32 },
  'Miqueas': { slug: 'miqueas', id: 33 },
  'Nahúm': { slug: 'nahum', id: 34 },
  'Habacuc': { slug: 'habacuc', id: 35 },
  'Sofonías': { slug: 'sofonias', id: 36 },
  'Hageo': { slug: 'hageo', id: 37 },
  'Zacarías': { slug: 'zacarias', id: 38 },
  'Malaquías': { slug: 'malaquias', id: 39 },
  'Mateo': { slug: 'mateo', id: 40 },
  'Marcos': { slug: 'marcos', id: 41 },
  'Lucas': { slug: 'lucas', id: 42 },
  'Juan': { slug: 'juan', id: 43 },
  'Hechos': { slug: 'hechos', id: 44 },
  'Romanos': { slug: 'romanos', id: 45 },
  '1 Corintios': { slug: '1-corintios', id: 46 },
  '2 Corintios': { slug: '2-corintios', id: 47 },
  'Gálatas': { slug: 'galatas', id: 48 },
  'Efesios': { slug: 'efesios', id: 49 },
  'Filipenses': { slug: 'filipenses', id: 50 },
  'Colosenses': { slug: 'colosenses', id: 51 },
  '1 Tesalonicenses': { slug: '1-tesalonicenses', id: 52 },
  '2 Tesalonicenses': { slug: '2-tesalonicenses', id: 53 },
  '1 Timoteo': { slug: '1-timoteo', id: 54 },
  '2 Timoteo': { slug: '2-timoteo', id: 55 },
  'Tito': { slug: 'tito', id: 56 },
  'Filemón': { slug: 'filemon', id: 57 },
  'Hebreos': { slug: 'hebreos', id: 58 },
  'Santiago': { slug: 'santiago', id: 59 },
  '1 Pedro': { slug: '1-pedro', id: 60 },
  '2 Pedro': { slug: '2-pedro', id: 61 },
  '1 Juan': { slug: '1-juan', id: 62 },
  '2 Juan': { slug: '2-juan', id: 63 },
  '3 Juan': { slug: '3-juan', id: 64 },
  'Judas': { slug: 'judas', id: 65 },
  'Apocalipsis': { slug: 'apocalipsis', id: 66 },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const libroParam = searchParams.get('libro') || 'Génesis';
  const capituloParam = searchParams.get('capitulo') || '1';

  const bookInfo = LIBROS_MAP[libroParam] || { slug: 'genesis', id: 1 };
  const capNumber = parseInt(capituloParam, 10) || 1;

  try {
    // Fuente 1: API de Deno (Reina Valera 1960 Oficial)
    const primaryUrl = `https://bible-api.deno.dev/api/read/rv1960/${bookInfo.slug}/${capNumber}`;
    const res = await fetch(primaryUrl, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 604800 }, // Guardar en caché 7 días
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.vers)) {
        const verses = data.vers.map((v: { number: number; verse: string }) => ({
          verse: v.number,
          text: v.verse.trim(),
        }));
        return NextResponse.json({ verses });
      }
    }

    // Fallback: bible-api.com
    const fallbackUrl = `https://bible-api.com/${bookInfo.slug}+${capNumber}?translation=rvr`;
    const fallbackRes = await fetch(fallbackUrl, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 604800 },
    });

    if (fallbackRes.ok) {
      const fallbackData = await fallbackRes.json();
      if (Array.isArray(fallbackData?.verses) && fallbackData.verses.length > 0) {
        const verses = fallbackData.verses.map((v: { verse: number; text: string }) => ({
          verse: v.verse,
          text: v.text.trim(),
        }));
        return NextResponse.json({ verses });
      }
    }

    return NextResponse.json({ verses: [] });
  } catch (error) {
    console.error('Error al obtener versículos:', error);
    return NextResponse.json(
      { error: 'Error al consultar las Escrituras.' },
      { status: 500 }
    );
  }
}