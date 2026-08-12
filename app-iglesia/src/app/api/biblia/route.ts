import { NextResponse } from 'next/server';

// Nombres de libros tal como los requiere la API en español
const MAPA_LIBROS: Record<string, string> = {
  'Génesis': 'Genesis',
  'Éxodo': 'Exodo',
  'Levítico': 'Levitico',
  'Números': 'Numeros',
  'Deuteronomio': 'Deuteronomio',
  'Josué': 'Josue',
  'Jueces': 'Jueces',
  'Rut': 'Rut',
  '1 Samuel': '1 Samuel',
  '2 Samuel': '2 Samuel',
  '1 Reyes': '1 Reyes',
  '2 Reyes': '2 Reyes',
  '1 Crónicas': '1 Cronicas',
  '2 Crónicas': '2 Cronicas',
  'Esdras': 'Esdras',
  'Nehemías': 'Nehemias',
  'Ester': 'Ester',
  'Job': 'Job',
  'Salmos': 'Salmos',
  'Proverbios': 'Proverbios',
  'Eclesiastés': 'Eclesiastes',
  'Cantares': 'Cantar de los Cantares',
  'Isaías': 'Isaias',
  'Jeremías': 'Jeremias',
  'Lamentaciones': 'Lamentaciones',
  'Ezequiel': 'Ezequiel',
  'Daniel': 'Daniel',
  'Oseas': 'Oseas',
  'Joel': 'Joel',
  'Amós': 'Amos',
  'Abdías': 'Abdias',
  'Jonás': 'Jonas',
  'Miqueas': 'Miqueas',
  'Nahúm': 'Nahum',
  'Habacuc': 'Habacuc',
  'Sofonías': 'Sofonias',
  'Hageo': 'Hageo',
  'Zacarías': 'Zacarias',
  'Malaquías': 'Malaquias',
  'Mateo': 'Mateo',
  'Marcos': 'Marcos',
  'Lucas': 'Lucas',
  'Juan': 'Juan',
  'Hechos': 'Hechos',
  'Romanos': 'Romanos',
  '1 Corintios': '1 Corintios',
  '2 Corintios': '2 Corintios',
  'Gálatas': 'Galatas',
  'Efesios': 'Efesios',
  'Filipenses': 'Filipenses',
  'Colosenses': 'Colosenses',
  '1 Tesalonicenses': '1 Tesalonicenses',
  '2 Tesalonicenses': '2 Tesalonicenses',
  '1 Timoteo': '1 Timoteo',
  '2 Timoteo': '2 Timoteo',
  'Tito': 'Tito',
  'Filemón': 'Filemon',
  'Hebreos': 'Hebreos',
  'Santiago': 'Santiago',
  '1 Pedro': '1 Pedro',
  '2 Pedro': '2 Pedro',
  '1 Juan': '1 Juan',
  '2 Juan': '2 Juan',
  '3 Juan': '3 Juan',
  'Judas': 'Judas',
  'Apocalipsis': 'Apocalipsis'
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const libroParam = searchParams.get('libro') || 'Génesis';
  const capituloParam = searchParams.get('capitulo') || '1';

  const libroNombre = MAPA_LIBROS[libroParam] || libroParam;

  try {
    // API pública nativa en español (Reina Valera 1960)
    const url = `https://bible-api.com/${encodeURIComponent(libroNombre)}+${capituloParam}?translation=rvr1960`;
    const res = await fetch(url, { next: { revalidate: 86400 } });

    if (!res.ok) {
      // Endpoint de respaldo directo en español (RVR1960)
      const fallbackUrl = `https://test.mybible.cloud/api/v1/es/rvr1960/${encodeURIComponent(libroNombre)}/${capituloParam}`;
      const resFallback = await fetch(fallbackUrl);
      if (!resFallback.ok) throw new Error('Capítulo no encontrado');
      
      const dataFallback = await resFallback.json();
      return NextResponse.json({
        verses: dataFallback.verses.map((v: { verse: number; text: string }) => ({
          verse: v.verse,
          text: v.text
        }))
      });
    }

    const data = await res.json();
    
    // Mapeo unificado para asegurar formato { verse: number, text: string }
    const versesMapped = (data.verses || []).map((v: { verse: number; text: string }) => ({
      verse: v.verse,
      text: v.text.trim()
    }));

    return NextResponse.json({ verses: versesMapped });
  } catch (error) {
    return NextResponse.json(
      { error: 'No se pudo obtener el texto en español.' },
      { status: 500 }
    );
  }
}