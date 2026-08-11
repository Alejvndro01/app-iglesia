import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const testimonioSchema = z.object({
  autor: z.string().default('Hermano de Iglesia'),
  titulo: z.string().min(1, 'El título es obligatorio'),
  contenido: z.string().min(5, 'El contenido debe tener al menos 5 caracteres'),
});

export async function GET() {
  try {
    const testimonios = await prisma.testimonio.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(testimonios, { status: 200 });
  } catch (error) {
    console.error('[TESTIMONIOS_GET_ERROR]', error);
    return NextResponse.json(
      { error: 'Error al consultar testimonios' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validation = testimonioSchema.safeParse(body);
    if (!validation.success) {
      const issues = validation.error.issues.map((i) => i.message).join(', ');
      return NextResponse.json({ error: `Datos inválidos: ${issues}` }, { status: 400 });
    }

    const { autor, titulo, contenido } = validation.data;

    const nuevoTestimonio = await prisma.testimonio.create({
      data: {
        autor: autor.trim() || 'Hermano de Iglesia',
        titulo: titulo.trim(),
        contenido: contenido.trim(),
        likes: 0,
      },
    });

    return NextResponse.json(nuevoTestimonio, { status: 201 });
  } catch (error) {
    console.error('[TESTIMONIOS_POST_ERROR]', error);
    return NextResponse.json(
      { error: 'Error interno al guardar el testimonio en la base de datos' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    const testimonioActualizado = await prisma.testimonio.update({
      where: { id },
      data: {
        likes: { increment: 1 },
      },
    });

    return NextResponse.json(testimonioActualizado, { status: 200 });
  } catch (error) {
    console.error('[TESTIMONIOS_PATCH_ERROR]', error);
    return NextResponse.json({ error: 'Error al actualizar amé' }, { status: 500 });
  }
}