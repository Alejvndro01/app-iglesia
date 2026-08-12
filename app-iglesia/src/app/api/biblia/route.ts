import { NextResponse } from 'next/server';

// Mapeo exhaustivo de todos los libros a slugs internacionales para RVR1960
const MAPA_SLUGS: Record<string, string> = {
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
  '1 Crónicas': '1chronicles',
  '2 Crónicas': '2chronicles',
  'Esdras': 'ezra',
  'Nehemías': 'nehemiah',
  'Ester': 'esther',
  'Job': 'job',
  'Salmos': 'psalms',
  'Proverbios': 'proverbs',
  'Eclesiastés': 'ecclesiastes',
  'Cantares': 'songofsolomon',
  'Isaías': 'isaiah',
  'Jeremías': 'jeremiah',
  'Lamentaciones': 'lamentations',
  'Ezequiel': 'ezekiel',
  'Daniel': 'daniel',
  'Oseas': 'hosea',
  'Joel': 'joel',
  'Amós': 'amos',
  'Abdías': 'obadiah',
  'Jonás': 'jonah',
  'Miqueas': 'micah',
  'Nahúm': 'nahum',
  'Habacuc': 'habakkuk',
  'Sofonías': 'zephaniah',
  'Hageo': 'haggai',
  'Zacarías': 'zechariah',
  'Malaquías': 'malachi',
  'Mateo': 'matthew',
  'Marcos': 'mark',
  'Lucas': 'luke',
  'Juan': 'john',
  'Hechos': 'acts',
  'Romanos': 'romans',
  '1 Corintios': '1corinthians',
  '2 Corintios': '2corinthians',
  'Gálatas': 'galatians',
  'Efesios': 'ephesians',
  'Filipenses': 'philippians',
  'Colosenses': 'colossians',
  '1 Tesalonicenses': '1thessalonians',
  '2 Tesalonicenses': '2thessalonians',
  '1 Timoteo': '1timothy',
  '2 Timoteo': '2timothy',
  'Tito': 'titus',
  'Filemón': 'philemon',
  'Hebreos': 'hebrews',
  'Santiago': 'james',
  '1 Pedro': '1peter',
  '2 Pedro': '2peter',
  '1 Juan': '1john',
  '2 Juan': '2john',
  '3 Juan': '3john',
  'Judas': 'jude',
  'Apocalipsis': 'revelation',
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const libroParam = searchParams.get('libro') || 'Mateo';
  const capituloParam = searchParams.get('capitulo') || '1';

  const slug = MAPA_SLUGS[libroParam] || 'matthew';

  try {
    // 1. Intento principal con RVR1960
    const primaryUrl = `https://bible-api.com/${slug}+${capituloParam}?translation=rvr1960`;
    const res = await fetch(primaryUrl, { next: { revalidate: 86400 } });

    if (res.ok) {
      const data = await res.json();
      if (data.verses && data.verses.length > 0) {
        return NextResponse.json({
          verses: data.verses.map((v: { verse: number; text: string }) => ({
            verse: v.verse,
            text: v.text.trim(),
          })),
        });
      }
    }

    // 2. Fallback secundario si falla la traducción RVR1960
    const fallbackUrl = `https://bible-api.deno.dev/api/read/nvi/${slug}/${capituloParam}`;
    const resFallback = await fetch(fallbackUrl);
    if (resFallback.ok) {
      const dataFb = await resFallback.json();
      if (dataFb.vers) {
        return NextResponse.json({
          verses: dataFb.vers.map((v: { number: number; verse: string }) => ({
            verse: v.number,
            text: v.verse.trim(),
          })),
        });
      }
    }

    return NextResponse.json({ verses: [] });
  } catch (error) {
    console.error('Error al obtener versículos:', error);
    return NextResponse.json(
      { error: 'Error al consultar la Biblia.' },
      { status: 500 }
    );
  }
}