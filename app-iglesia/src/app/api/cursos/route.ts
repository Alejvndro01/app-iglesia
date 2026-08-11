import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const cursoSchema = z.object({
  curso: z.string().min(3, 'El nombre del curso es requerido'),
  nombre: z.string().min(2, 'El nombre completo es requerido'),
  telefono: z.string().min(8, 'Ingresa un número telefónico válido'),
  direccion: z.string().optional(),
  modalidad: z.string().min(3, 'Selecciona una modalidad válida'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = cursoSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos de solicitud inválidos', details: validation.error.format() },
        { status: 400 }
      );
    }

    const nuevaSolicitud = await prisma.solicitudCurso.create({
      data: validation.data,
    });

    return NextResponse.json({ message: 'Solicitud guardada', solicitud: nuevaSolicitud }, { status: 201 });
  } catch (error) {
    console.error('[CURSOS_POST_ERROR]', error);
    return NextResponse.json({ error: 'Error interno al procesar la solicitud' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const solicitudes = await prisma.solicitudCurso.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ solicitudes });
  } catch (error) {
    console.error('[CURSOS_GET_ERROR]', error);
    return NextResponse.json({ error: 'Error al obtener solicitudes' }, { status: 500 });
  }
}