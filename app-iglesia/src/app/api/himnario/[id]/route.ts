import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cleanId = id.padStart(3, '0'); // Formato de 3 dígitos (ej: 001, 012, 123)

    const res = await fetch(
      `https://raw.githubusercontent.com/Adventech/sabbath-school-resources/master/hymns/es/hymns/${cleanId}.json`
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'Himno no encontrado' }, { status: 404 });
    }

    const himnoDetalle = await res.json();
    return NextResponse.json(himnoDetalle);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener detalle del himno' }, { status: 500 });
  }
}