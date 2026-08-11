import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const testimonioSchema = z.object({
  autor: z.string().min(2).max(50),
  titulo: z.string().min(3).max(100),
  contenido: z.string().min(10).max(1000),
});

export async function GET() {
  try {
    const testimonios = await prisma.testimonio.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(testimonios, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al consultar testimonios' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = testimonioSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    const nuevoTestimonio = await prisma.testimonio.create({
      data: validation.data,
    });
    return NextResponse.json(nuevoTestimonio, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear testimonio' }, { status: 500 });
  }
}

// PATCH: Incrementar el contador de likes/amén en 1
export async function PATCH(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    const testimonioActualizado = await prisma.testimonio.update({
      where: { id },
      data: {
        likes: { increment: 1 },
      },
    });

    return NextResponse.json(testimonioActualizado, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar likes' }, { status: 500 });
  }
}