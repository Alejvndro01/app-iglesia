import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// GET: Obtener todos los testimonios ordenados por fecha
export async function GET() {
  try {
    const testimonios = await prisma.testimonio.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(testimonios);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener testimonios' }, { status: 500 });
  }
}

// POST: Crear un nuevo testimonio
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const author = body.autor || body.author;
    const title = body.titulo || body.title;
    const content = body.contenido || body.content;

    if (!content) {
      return NextResponse.json({ error: 'El contenido es obligatorio' }, { status: 400 });
    }

    const nuevoTestimonio = await prisma.testimonio.create({
      data: {
        autor: author?.trim() || 'Hermano de Iglesia',
        titulo: title?.trim() || 'Agradecimiento al Señor', // <-- CAMBIADO DE 'title' A 'titulo'
        contenido: content.trim(),                         // <-- CAMBIADO DE 'content' A 'contenido'
      },
    });

    return NextResponse.json(nuevoTestimonio, { status: 201 });
  } catch (error) {
    console.error('Error al guardar testimonio:', error);
    return NextResponse.json({ error: 'Error al publicar testimonio' }, { status: 500 });
  }
}

// PATCH: Incrementar likes
export async function PATCH(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 });
    }

    const actualizado = await prisma.testimonio.update({
      where: { id },
      data: { likes: { increment: 1 } },
    });

    return NextResponse.json(actualizado);
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar reacción' }, { status: 500 });
  }
}