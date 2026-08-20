import { NextResponse } from 'next/server';

// Mapeo Canónico Oficial (1 - 66)
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

// Slugs para Deno Bible API
const DENO_BOOK_SLUGS: Record<string, string> = {
  'Génesis': 'genesis', 'Éxodo': 'exodo', 'Levítico': 'levitico', 'Números': 'numeros', 'Deuteronomio': 'deuteronomio',
  'Josué': 'josue', 'Jueces': 'jueces', 'Rut': 'rut', '1 Samuel': '1-samuel', '2 Samuel': '2-samuel',
  '1 Reyes': '1-reyes', '2 Reyes': '2-reyes', '1 Crónicas': '1-cronicas', '2 Crónicas': '2-cronicas',
  'Esdras': 'esdras', 'Nehemías': 'nehemias', 'Ester': 'ester', 'Job': 'job', 'Salmos': 'salmos',
  'Proverbios': 'proverbios', 'Eclesiastés': 'eclesiastes', 'Cantares': 'cantares', 'Isaías': 'isaias',
  'Jeremías': 'jeremias', 'Lamentaciones': 'lamentaciones', 'Ezequiel': 'ezequiel', 'Daniel': 'daniel',
  'Oseas': 'oseas', 'Joel': 'joel', 'Amós': 'amos', 'Abdías': 'abdias', 'Jonás': 'jonas',
  'Miqueas': 'miqueas', 'Nahúm': 'nahum', 'Habacuc': 'habacuc', 'Sofonías': 'sofonias', 'Hageo': 'hageo',
  'Zacarías': 'zacarias', 'Malaquías': 'malaquias', 'Mateo': 'mateo', 'Marcos': 'marcos', 'Lucas': 'lucas',
  'Juan': 'juan', 'Hechos': 'hechos', 'Romanos': 'romanos', '1 Corintios': '1-corintios', '2 Corintios': '2-corintios',
  'Gálatas': 'galatas', 'Efesios': 'efesios', 'Filipenses': 'filipenses', 'Colosenses': 'colosenses',
  '1 Tesalonicenses': '1-tesalonicenses', '2 Tesalonicenses': '2-tesalonicenses', '1 Timoteo': '1-timoteo', '2 Timoteo': '2-timoteo',
  'Tito': 'tito', 'Filemón': 'filemon', 'Hebreos': 'hebreos', 'Santiago': 'santiago', '1 Pedro': '1-pedro',
  '2 Pedro': '2-pedro', '1 Juan': '1-juan', '2 Juan': '2-juan', '3 Juan': '3-juan', 'Judas': 'judas',
  'Apocalipsis': 'apocalipsis'
};

const cacheMap = new Map<string, Array<{ verse: number; text: string }>>();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const libro = searchParams.get('libro') || 'Juan';
  const capituloStr = searchParams.get('capitulo') || '3';
  const version = searchParams.get('version') || 'RVR1960';

  const capitulo = parseInt(capituloStr, 10) || 1;
  const bookId = LIBROS_MAP[libro] || 43;
  const slug = DENO_BOOK_SLUGS[libro] || 'juan';

  const cacheKey = `${version}-${bookId}-${capitulo}`;
  if (cacheMap.has(cacheKey)) {
    return NextResponse.json({ verses: cacheMap.get(cacheKey) });
  }

  try {
    // CASO 1: Dios Habla Hoy (DHH) -> Ruta directa a Deno API
    if (version === 'DHH') {
      const denoUrl = `https://bible-api.deno.dev/api/read/dhh/${slug}/${capitulo}`;
      const res = await fetch(denoUrl, { headers: { Accept: 'application/json' }, next: { revalidate: 2592000 } });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data?.vers) && data.vers.length > 0) {
          const verses = data.vers.map((v: { number: number; verse: string }) => ({
            verse: v.number,
            text: v.verse.replace(/<[^>]*>?/gm, '').replace(/\[\d+\]/g, '').trim()
          }));
          cacheMap.set(cacheKey, verses);
          return NextResponse.json({ verses });
        }
      }
    }

    // CASO 2: Bolls Life API (RV1960, NVI, LBLA, NTV, PDT)
    const bollsVersionMap: Record<string, string> = {
      'RVR1960': 'RV1960',
      'NVI': 'NVI',
      'LBLA': 'LBLA',
      'NTV': 'NTV',
      'PDT': 'PDT'
    };

    const bollsSlug = bollsVersionMap[version] || 'RV1960';
    const bollsUrl = `https://bolls.life/get-chapter/${bollsSlug}/${bookId}/${capitulo}/`;
    
    const bollsRes = await fetch(bollsUrl, { headers: { Accept: 'application/json' }, next: { revalidate: 2592000 } });
    if (bollsRes.ok) {
      const bollsData = await bollsRes.json();
      if (Array.isArray(bollsData) && bollsData.length > 0) {
        const verses = bollsData.map((v: { verse: number; text: string }) => ({
          verse: v.verse,
          text: v.text
            .replace(/<[^>]*>?/gm, '')
            .replace(/\[\d+\]/g, '')
            .trim()
        }));
        cacheMap.set(cacheKey, verses);
        return NextResponse.json({ verses });
      }
    }

    // CASO 3: Fallback Universal a Deno API (RV1960 / NVI / PDT)
    const denoVersionMap: Record<string, string> = {
      'RVR1960': 'rv1960',
      'NVI': 'nvi',
      'PDT': 'pdt',
      'DHH': 'dhh'
    };
    const fallbackDenoVer = denoVersionMap[version] || 'rv1960';
    const fallbackUrl = `https://bible-api.deno.dev/api/read/${fallbackDenoVer}/${slug}/${capitulo}`;
    
    const fallbackRes = await fetch(fallbackUrl, { headers: { Accept: 'application/json' }, next: { revalidate: 2592000 } });
    if (fallbackRes.ok) {
      const fbData = await fallbackRes.json();
      if (Array.isArray(fbData?.vers) && fbData.vers.length > 0) {
        const verses = fbData.vers.map((v: { number: number; verse: string }) => ({
          verse: v.number,
          text: v.verse.replace(/<[^>]*>?/gm, '').replace(/\[\d+\]/g, '').trim()
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