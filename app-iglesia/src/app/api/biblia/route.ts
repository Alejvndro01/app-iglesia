import { NextResponse } from 'next/server';

// Nombres de libros mapeados exactamente a la API de Reina Valera 1960
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
  const libro = searchParams.get('libro') || 'Génesis';
  const capitulo = searchParams.get('capitulo') || '1';

  const slug = MAPA_LIBROS[libro] || 'genesis';

  try {
    // Solicitud a la API con encabezado de User-Agent para evitar bloqueos
    const response = await fetch(
      `https://bible-api.com/${slug}+${capitulo}?translation=rvr1960`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
        cache: 'force-cache',
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.verses || data.verses.length === 0) {
      return NextResponse.json({ verses: [] });
    }

    const verses = data.verses.map((v: { verse: number; text: string }) => ({
      verse: v.verse,
      text: v.text.trim(),
    }));

    return NextResponse.json({ verses });
  } catch (error) {
    console.error('Error cargando la Biblia:', error);
    return NextResponse.json(
      { error: 'Error al consultar la Biblia.' },
      { status: 500 }
    );
  }
}