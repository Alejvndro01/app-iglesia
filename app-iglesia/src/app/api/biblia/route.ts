import { NextResponse } from 'next/server';

const LIBROS_MAP: Record<string, number> = {
  'Génesis': 1, 'Éxodo': 2, 'Levítico': 3, 'Números': 4, 'Deuteronomio': 5,
  'Josué': 6, 'Jueces': 7, 'Rut': 8, '1 Samuel': 9, '2 Samuel': 10,
  '1 Reyes': 11, '2 Reyes': 12, '1 Crónicas': 13, '2 Crónicas': 14,
  'Esdras': 15, 'Nehemías': 16, 'Ester': 17, 'Job': 18, 'Salmos': 19,
  'Proverbios': 20, 'Eclesiastés': 21, 'Cantares': 22, 'Isaías': 23,
  'Jeremías': 24, 'Lamentaciones': 25, 'Ezequiel': 26, 'Daniel': 27,
  'Oseas': 28, 'Joel': 29, 'Amós': 30, 'Abdías': 31, 'Jonás': 32,
  'Miqueas': 33, 'Nahúm': 34, 'Habacuc': 35, 'Sofonías': 36, 'Hageo': 37,
  'Zacarías': 38, 'Malaquías': 39, 'Mateo': 40, 'Marcos': 41, 'Lucas': 42,
  'Juan': 43, 'Hechos': 44, 'Romanos': 45, '1 Corintios': 46, '2 Corintios': 47,
  'Gálatas': 48, 'Efesios': 49, 'Filipenses': 50, 'Colosenses': 51,
  '1 Tesalonicenses': 52, '2 Tesalonicenses': 53, '1 Timoteo': 54, '2 Timoteo': 55,
  'Tito': 56, 'Filemón': 57, 'Hebreos': 58, 'Santiago': 59, '1 Pedro': 60,
  '2 Pedro': 61, '1 Juan': 62, '2 Juan': 63, '3 Juan': 64, 'Judas': 65,
  'Apocalipsis': 66
};

// Cache en memoria para evitar ráfagas
const cacheMap = new Map<string, Array<{ verse: number; text: string }>>();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const libro = searchParams.get('libro') || 'Génesis';
  const capituloStr = searchParams.get('capitulo') || '1';
  const capitulo = parseInt(capituloStr, 10) || 1;
  const bookId = LIBROS_MAP[libro] || 1;

  const cacheKey = `${bookId}-${capitulo}`;
  if (cacheMap.has(cacheKey)) {
    return NextResponse.json({ verses: cacheMap.get(cacheKey) });
  }

  try {
    // 1. Endpoint primario: Bolls API RVR1960
    const bollsUrl = `https://bolls.life/get-chapter/RVR1960/${bookId}/${capitulo}/`;
    const res = await fetch(bollsUrl, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 2592000 }
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const verses = data.map((v: { verse: number; text: string }) => ({
          verse: v.verse,
          text: v.text.replace(/<[^>]*>?/gm, '').trim()
        }));
        cacheMap.set(cacheKey, verses);
        return NextResponse.json({ verses });
      }
    }

    // 2. Fallback CDN Github Raw
    const slug = libro.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
    const denoUrl = `https://bible-api.deno.dev/api/read/rv1960/${slug}/${capitulo}`;
    const fallbackRes = await fetch(denoUrl, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 2592000 }
    });

    if (fallbackRes.ok) {
      const fbData = await fallbackRes.json();
      if (Array.isArray(fbData?.vers) && fbData.vers.length > 0) {
        const verses = fbData.vers.map((v: { number: number; verse: string }) => ({
          verse: v.number,
          text: v.verse.trim()
        }));
        cacheMap.set(cacheKey, verses);
        return NextResponse.json({ verses });
      }
    }

    return NextResponse.json({ verses: [] });
  } catch (error) {
    console.error('Error en /api/biblia:', error);
    return NextResponse.json({ verses: [] }, { status: 200 });
  }
}