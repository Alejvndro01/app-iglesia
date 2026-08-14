import { NextResponse } from 'next/server';

// Normaliza el nombre del libro para coincidir con nombres de carpetas/archivos (ej. "Génesis" -> "genesis")
function normalizeBookSlug(book: string): string {
  return book
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const libro = searchParams.get('libro') || 'Génesis';
  const capitulo = searchParams.get('capitulo') || '1';

  const slug = normalizeBookSlug(libro);
  const capNum = parseInt(capitulo, 10) || 1;

  try {
    // 1. URL directa al archivo JSON en tu repositorio de GitHub (rama master o main)
    const githubRawUrl = `https://raw.githubusercontent.com/alejandroch1202/biblia-api/main/data/${slug}/${capNum}.json`;

    let res = await fetch(githubRawUrl, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 2592000 }, // Cache de 30 días
    });

    // Fallback si la rama principal es 'master' en lugar de 'main'
    if (!res.ok) {
      const fallbackMasterUrl = `https://raw.githubusercontent.com/alejandroch1202/biblia-api/master/data/${slug}/${capNum}.json`;
      res = await fetch(fallbackMasterUrl, {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 2592000 },
      });
    }

    // Fallback directo a la API de respaldo si el archivo no existiera en la ruta
    if (!res.ok) {
      const backupUrl = `https://bolls.life/get-chapter/RVR1960/${slug}/${capNum}/`;
      const backupRes = await fetch(backupUrl, {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 2592000 },
      });

      if (backupRes.ok) {
        const backupData = await backupRes.json();
        if (Array.isArray(backupData)) {
          const verses = backupData.map((item: { verse: number; text: string }) => ({
            verse: item.verse,
            text: item.text.replace(/<[^>]*>?/gm, '').trim(),
          }));
          return NextResponse.json({ verses });
        }
      }

      return NextResponse.json({ verses: [] });
    }

    const data = await res.json();

    // Normaliza la estructura si tu JSON entrega { verses: [...] } o un array directo
    let verses: Array<{ verse: number; text: string }> = [];

    if (Array.isArray(data)) {
      verses = data.map((v, index) => ({
        verse: v.verse || v.number || index + 1,
        text: (v.text || v.verse_text || String(v)).trim(),
      }));
    } else if (Array.isArray(data.verses)) {
      verses = data.verses.map((v: { verse?: number; number?: number; text?: string }, index: number) => ({
        verse: v.verse || v.number || index + 1,
        text: (v.text || '').trim(),
      }));
    }

    return NextResponse.json({ verses });
  } catch (error) {
    console.error('Error cargando pasaje bíblico:', error);
    return NextResponse.json(
      { error: 'Error al consultar las Escrituras.' },
      { status: 500 }
    );
  }
}