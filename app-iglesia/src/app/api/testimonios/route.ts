import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const testimonioSchema = z.object({
  autor: z.string().min(2, 'El autor debe tener al menos 2 caracteres').max(50),
  titulo: z.string().min(3, 'El título es obligatorio').max(100),
  contenido: z.string().min(10, 'El contenido debe tener al menos 10 caracteres').max(1000),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validar entradas con Zod
    const validation = testimonioSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos de entrada inválidos', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { autor, titulo, contenido } = validation.data;

    const nuevoTestimonio = await prisma.testimonio.create({
      data: { autor, titulo, contenido },
    });

    return NextResponse.json(nuevoTestimonio, { status: 201 });
  } catch (error) {
    console.error('[TESTIMONIOS_POST_ERROR]', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al guardar el testimonio' },
      { status: 500 }
    );
  }
}