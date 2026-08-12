import { NextResponse } from 'next/server';

// Mapeo exacto de los nombres en español a los slugs en inglés que exige la API
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
  'Apocalipsis': 'revelation'
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const libroParam = searchParams.get('libro') || 'Génesis';
  const capituloParam = searchParams.get('capitulo') || '1';

  // Convertir el nombre en español al slug en inglés para la URL
  const slugIngles = MAPA_LIBROS[libroParam] || 'genesis';

  try {
    // Pedimos a la API el slug en inglés pero solicitando la traducción RVR1960 (Español)
    const url = `https://bible-api.com/${slugIngles}+${capituloParam}?translation=rvr1960`;
    const res = await fetch(url, { next: { revalidate: 86400 } });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    if (!data.verses || !Array.isArray(data.verses)) {
      return NextResponse.json({ verses: [] });
    }

    // Mapeamos los versículos garantizando que vengan en español con su número de verso
    const versesMapped = data.verses.map((v: { verse: number; text: string }) => ({
      verse: v.verse,
      text: v.text.trim()
    }));

    return NextResponse.json({ verses: versesMapped });
  } catch (error) {
    console.error('Error fetching bible verse:', error);
    return NextResponse.json(
      { error: 'No se pudo obtener el capítulo.' },
      { status: 500 }
    );
  }
}