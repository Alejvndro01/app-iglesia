import { NextResponse } from 'next/server';

// Mapeo normalizado a los nombres de archivos de la Biblia RVR1960
const LIBROS_MAP: Record<string, string> = {
  'Génesis': 'genesis',
  'Éxodo': 'exodo',
  'Levítico': 'levitico',
  'Números': 'numeros',
  'Deuteronomio': 'deuteronomio',
  'Josué': 'josue',
  'Jueces': 'jueces',
  'Rut': 'rut',
  '1 Samuel': '1samuel',
  '2 Samuel': '2samuel',
  '1 Reyes': '1reyes',
  '2 Reyes': '2reyes',
  '1 Crónicas': '1cronicas',
  '2 Crónicas': '2cronicas',
  'Esdras': 'esdras',
  'Nehemías': 'nehemias',
  'Ester': 'ester',
  'Job': 'job',
  'Salmos': 'salmos',
  'Proverbios': 'proverbios',
  'Eclesiastés': 'eclesiastes',
  'Cantares': 'cantares',
  'Isaías': 'isaias',
  'Jeremías': 'jeremias',
  'Lamentaciones': 'lamentaciones',
  'Ezequiel': 'ezequiel',
  'Daniel': 'daniel',
  'Oseas': 'oseas',
  'Joel': 'joel',
  'Amós': 'amos',
  'Abdías': 'abdias',
  'Jonás': 'jonas',
  'Miqueas': 'miqueas',
  'Nahúm': 'nahum',
  'Habacuc': 'habakkuk',
  'Sofonías': 'sofonias',
  'Hageo': 'hageo',
  'Zacarías': 'zacarias',
  'Malaquías': 'malaquias',
  'Mateo': 'mateo',
  'Marcos': 'marcos',
  'Lucas': 'lucas',
  'Juan': 'juan',
  'Hechos': 'hechos',
  'Romanos': 'romanos',
  '1 Corintios': '1corintios',
  '2 Corintios': '2corintios',
  'Gálatas': 'galatas',
  'Efesios': 'efesios',
  'Filipenses': 'filipenses',
  'Colosenses': 'colosenses',
  '1 Tesalonicenses': '1tesalonicenses',
  '2 Tesalonicenses': '2tesalonicenses',
  '1 Timoteo': '1timoteo',
  '2 Timoteo': '2timoteo',
  'Tito': 'tito',
  'Filemón': 'filemon',
  'Hebreos': 'hebreos',
  'Santiago': 'santiago',
  '1 Pedro': '1pedro',
  '2 Pedro': '2pedro',
  '1 Juan': '1juan',
  '2 Juan': '2juan',
  '3 Juan': '3juan',
  'Judas': 'judas',
  'Apocalipsis': 'apocalipsis',
};

// ID numérico para la API Bolls en backend
const LIBROS_ID: Record<string, number> = {
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const libro = searchParams.get('libro') || 'Génesis';
  const capitulo = searchParams.get('capitulo') || '1';
  const capNum = parseInt(capitulo, 10) || 1;
  const bookId = LIBROS_ID[libro] || 1;

  try {
    // Intento 1: API Bolls desde el servidor Next.js
    const bollsUrl = `https://bolls.life/get-chapter/RVR1960/${bookId}/${capNum}/`;
    const resBolls = await fetch(bollsUrl, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 604800 },
    });

    if (resBolls.ok) {
      const data = await resBolls.json();
      if (Array.isArray(data) && data.length > 0) {
        const verses = data.map((v: { verse: number; text: string }) => ({
          verse: v.verse,
          text: v.text.replace(/<[^>]*>?/gm, '').trim(),
        }));
        return NextResponse.json({ verses });
      }
    }

    // Intento 2 Fallback: bible-api.com
    const slug = LIBROS_MAP[libro] || 'genesis';
    const fallbackUrl = `https://bible-api.com/${slug}+${capNum}?translation=rvr`;
    const resFallback = await fetch(fallbackUrl, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 604800 },
    });

    if (resFallback.ok) {
      const fallbackData = await resFallback.json();
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
    console.error('Error en /api/biblia:', error);
    return NextResponse.json({ verses: [] }, { status: 200 });
  }
}