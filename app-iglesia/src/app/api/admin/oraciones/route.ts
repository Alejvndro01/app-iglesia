import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const oraciones = await prisma.oracion.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ oraciones });
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener oraciones' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    const oracion = await prisma.oracion.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ oracion });
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar oración' }, { status: 500 });
  }
}