import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { limiter } from '@/lib/ratelimit';

const oracionSchema = z.object({
  nombre: z.string().default('Anónimo'),
  peticion: z.string().min(5, 'El motivo de oración debe tener al menos 5 caracteres'),
  esPrivado: z.boolean().default(false),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    const limitResult = await limiter.limit(`oraciones_${ip}`);
    if (!limitResult.success) {
      return NextResponse.json({ error: 'Límite de solicitudes alcanzado. Intenta más tarde.' }, { status: 429 });
    }
    const body = await req.json();
    const validation = oracionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Formato de pedido inválido', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { nombre, peticion, esPrivado } = validation.data;

    const nuevaOracion = await prisma.oracion.create({
      data: {
        nombre,
        request: peticion,
        isPrivate: esPrivado,
        status: 'Pendiente',
      },
    });

    return NextResponse.json(nuevaOracion, { status: 201 });
  } catch (error) {
    console.error('[ORACIONES_POST_ERROR]', error);
    return NextResponse.json({ error: 'Error interno al guardar la oración' }, { status: 500 });
  }
}