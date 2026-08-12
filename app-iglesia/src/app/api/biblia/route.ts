import { NextResponse } from 'next/server';

// Mapeo exacto de los nombres en español a las abreviaturas estándar en español
const ABREVIATURAS_LIBROS: Record<string, string> = {
  'Génesis': 'gn',
  'Éxodo': 'ex',
  'Levítico': 'lv',
  'Números': 'nm',
  'Deuteronomio': 'dt',
  'Josué': 'jos',
  'Jueces': 'jue',
  'Rut': 'rt',
  '1 Samuel': '1sm',
  '2 Samuel': '2sm',
  '1 Reyes': '1re',
  '2 Reyes': '2re',
  '1 Crónicas': '1cr',
  '2 Crónicas': '2cr',
  'Esdras': 'esd',
  'Nehemías': 'neh',
  'Ester': 'est',
  'Job': 'job',
  'Salmos': 'sal',
  'Proverbios': 'pr',
  'Eclesiastés': 'ec',
  'Cantares': 'cnt',
  'Isaías': 'is',
  'Jeremías': 'jer',
  'Lamentaciones': 'lm',
  'Ezequiel': 'ez',
  'Daniel': 'dn',
  'Oseas': 'os',
  'Joel': 'jl',
  'Amós': 'am',
  'Abdías': 'ab',
  'Jonás': 'jon',
  'Miqueas': 'miq',
  'Nahúm': 'nah',
  'Habacuc': 'hab',
  'Sofonías': 'sof',
  'Hageo': 'hag',
  'Zacarías': 'zac',
  'Malaquías': 'mal',
  'Mateo': 'mt',
  'Marcos': 'mc',
  'Lucas': 'lc',
  'Juan': 'jn',
  'Hechos': 'hch',
  'Romanos': 'ro',
  '1 Corintios': '1co',
  '2 Corintios': '2co',
  'Gálatas': 'ga',
  'Efesios': 'ef',
  'Filipenses': 'fil',
  'Colosenses': 'col',
  '1 Tesalonicenses': '1ts',
  '2 Tesalonicenses': '2ts',
  '1 Timoteo': '1tm',
  '2 Timoteo': '2tm',
  'Tito': 'tit',
  'Filemón': 'flm',
  'Hebreos': 'heb',
  'Santiago': 'stg',
  '1 Pedro': '1pe',
  '2 Pedro': '2pe',
  '1 Juan': '1jn',
  '2 Juan': '2jn',
  '3 Juan': '3jn',
  'Judas': 'jd',
  'Apocalipsis': 'ap'
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const libroParam = searchParams.get('libro') || 'Génesis';
  const capituloParam = searchParams.get('capitulo') || '1';

  const abrev = ABREVIATURAS_LIBROS[libroParam] || 'gn';

  try {
    // API gratuita nativa en español RVR1960 / Nacar-Colunga
    const res = await fetch(`https://bible-api.deno.dev/api/read/nvi/${abrev}/${capituloParam}`, {
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      throw new Error(`Error API: ${res.status}`);
    }

    const data = await res.json();

    if (!data.vers || !Array.isArray(data.vers)) {
      return NextResponse.json({ verses: [] });
    }

    // Mapear respuesta estandarizada
    const versesMapped = data.vers.map((v: { number: number; verse: string }) => ({
      verse: v.number,
      text: v.verse.trim(),
    }));

    return NextResponse.json({ verses: versesMapped });
  } catch (error) {
    console.error('Error al obtener versículos:', error);
    return NextResponse.json(
      { error: 'No se pudo cargar el capítulo.' },
      { status: 500 }
    );
  }
}