// src/app/api/biblia/route.ts
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
    // Se utiliza translation=rvr que es el identificador oficial de Reina-Valera en bible-api.com
    const response = await fetch(
      `https://bible-api.com/${slug}+${capitulo}?translation=rvr`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
        next: { revalidate: 86400 }, // Cache por 24 horas para optimizar peticiones
      }
    );

    if (!response.ok) {
      // Fallback a traducción alternativa 'valera' si 'rvr' tuviese algún problema transitorio
      const fallbackRes = await fetch(
        `https://bible-api.com/${slug}+${capitulo}?translation=valera`,
        {
          headers: { 'Accept': 'application/json' },
          next: { revalidate: 86400 },
        }
      );

      if (!fallbackRes.ok) {
        return NextResponse.json({ verses: [] });
      }

      const fallbackData = await fallbackRes.json();
      const verses = (fallbackData.verses || []).map((v: { verse: number; text: string }) => ({
        verse: v.verse,
        text: v.text.trim(),
      }));

      return NextResponse.json({ verses });
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
    console.error('Error al consultar bible-api:', error);
    return NextResponse.json(
      { error: 'Error al consultar la API de la Biblia.' },
      { status: 500 }
    );
  }
}