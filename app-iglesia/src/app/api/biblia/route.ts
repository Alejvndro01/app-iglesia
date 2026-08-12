import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const libro = searchParams.get('libro') || 'genesis';
  const capitulo = searchParams.get('capitulo') || '1';

  try {
    // Ejemplo consumiendo una API pública de la Biblia en Español
    const res = await fetch(`https://bible-api.com/${libro}+${capitulo}?translation=rvr1960`, {
      next: { revalidate: 86400 } // Cache por 24 horas
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Capítulo no encontrado' }, { status: 404 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Error al consultar la Biblia' }, { status: 500 });
  }
}