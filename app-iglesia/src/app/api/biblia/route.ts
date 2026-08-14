import { NextResponse } from 'next/server';

// Mapeo numérico ordenado de los 66 libros de la Biblia Reina Valera 1960
const LIBROS_MAP: Record<string, { id: number; name: string }> = {
  'Génesis': { id: 1, name: 'Génesis' },
  'Éxodo': { id: 2, name: 'Éxodo' },
  'Levítico': { id: 3, name: 'Levítico' },
  'Números': { id: 4, name: 'Números' },
  'Deuteronomio': { id: 5, name: 'Deuteronomio' },
  'Josué': { id: 6, name: 'Josué' },
  'Jueces': { id: 7, name: 'Jueces' },
  'Rut': { id: 8, name: 'Rut' },
  '1 Samuel': { id: 9, name: '1 Samuel' },
  '2 Samuel': { id: 10, name: '2 Samuel' },
  '1 Reyes': { id: 11, name: '1 Reyes' },
  '2 Reyes': { id: 12, name: '2 Reyes' },
  '1 Crónicas': { id: 13, name: '1 Crónicas' },
  '2 Crónicas': { id: 14, name: '2 Crónicas' },
  'Esdras': { id: 15, name: 'Esdras' },
  'Nehemías': { id: 16, name: 'Nehemías' },
  'Ester': { id: 17, name: 'Ester' },
  'Job': { id: 18, name: 'Job' },
  'Salmos': { id: 19, name: 'Salmos' },
  'Proverbios': { id: 20, name: 'Proverbios' },
  'Eclesiastés': { id: 21, name: 'Eclesiastés' },
  'Cantares': { id: 22, name: 'Cantares' },
  'Isaías': { id: 23, name: 'Isaías' },
  'Jeremías': { id: 24, name: 'Jeremías' },
  'Lamentaciones': { id: 25, name: 'Lamentaciones' },
  'Ezequiel': { id: 26, name: 'Ezequiel' },
  'Daniel': { id: 27, name: 'Daniel' },
  'Oseas': { id: 28, name: 'Oseas' },
  'Joel': { id: 29, name: 'Joel' },
  'Amós': { id: 30, name: 'Amós' },
  'Abdías': { id: 31, name: 'Abdías' },
  'Jonás': { id: 32, name: 'Jonás' },
  'Miqueas': { id: 33, name: 'Miqueas' },
  'Nahúm': { id: 34, name: 'Nahúm' },
  'Habacuc': { id: 35, name: 'Habacuc' },
  'Sofonías': { id: 36, name: 'Sofonías' },
  'Hageo': { id: 37, name: 'Hageo' },
  'Zacarías': { id: 38, name: 'Zacarías' },
  'Malaquías': { id: 39, name: 'Malaquías' },
  'Mateo': { id: 40, name: 'Mateo' },
  'Marcos': { id: 41, name: 'Marcos' },
  'Lucas': { id: 42, name: 'Lucas' },
  'Juan': { id: 43, name: 'Juan' },
  'Hechos': { id: 44, name: 'Hechos' },
  'Romanos': { id: 45, name: 'Romanos' },
  '1 Corintios': { id: 46, name: '1 Corintios' },
  '2 Corintios': { id: 47, name: '2 Corintios' },
  'Gálatas': { id: 48, name: 'Gálatas' },
  'Efesios': { id: 49, name: 'Efesios' },
  'Filipenses': { id: 50, name: 'Filipenses' },
  'Colosenses': { id: 51, name: 'Colosenses' },
  '1 Tesalonicenses': { id: 52, name: '1 Tesalonicenses' },
  '2 Tesalonicenses': { id: 53, name: '2 Tesalonicenses' },
  '1 Timoteo': { id: 54, name: '1 Timoteo' },
  '2 Timoteo': { id: 55, name: '2 Timoteo' },
  'Tito': { id: 56, name: 'Tito' },
  'Filemón': { id: 57, name: 'Filemón' },
  'Hebreos': { id: 58, name: 'Hebreos' },
  'Santiago': { id: 59, name: 'Santiago' },
  '1 Pedro': { id: 60, name: '1 Pedro' },
  '2 Pedro': { id: 61, name: '2 Pedro' },
  '1 Juan': { id: 62, name: '1 Juan' },
  '2 Juan': { id: 63, name: '2 Juan' },
  '3 Juan': { id: 64, name: '3 Juan' },
  'Judas': { id: 65, name: 'Judas' },
  'Apocalipsis': { id: 66, name: 'Apocalipsis' }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const libro = searchParams.get('libro') || 'Génesis';
  const capituloStr = searchParams.get('capitulo') || '1';
  const capituloNum = parseInt(capituloStr, 10) || 1;

  const bookInfo = LIBROS_MAP[libro] || { id: 1, name: 'Génesis' };

  try {
    // CDN 1: Raw CDN de la Biblia RVR1960 estructurada por capítulos
    const cdnUrl = `https://raw.githubusercontent.com/sevenreup/bible-api/master/bibles/es-rvr1960/books/${bookInfo.id}/chapters/${capituloNum}.json`;
    
    const res = await fetch(cdnUrl, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 2592000 } // Cache 30 días
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.verses)) {
        const verses = data.verses.map((v: { number: number; text: string }) => ({
          verse: v.number,
          text: v.text.trim()
        }));
        return NextResponse.json({ verses });
      }
    }

    // CDN 2 Fallback: bible-api.deno.dev
    const fallbackSlug = libro
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');

    const denoUrl = `https://bible-api.deno.dev/api/read/rv1960/${fallbackSlug}/${capituloNum}`;
    const denoRes = await fetch(denoUrl, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 2592000 }
    });

    if (denoRes.ok) {
      const denoData = await denoRes.json();
      if (Array.isArray(denoData?.vers)) {
        const verses = denoData.vers.map((v: { number: number; verse: string }) => ({
          verse: v.number,
          text: v.verse.trim()
        }));
        return NextResponse.json({ verses });
      }
    }

    return NextResponse.json({ verses: [] });
  } catch (error) {
    console.error('Error fetching Scripture:', error);
    return NextResponse.json({ verses: [] }, { status: 200 });
  }
}