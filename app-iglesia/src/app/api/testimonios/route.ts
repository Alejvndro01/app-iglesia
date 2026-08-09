import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// GET: Obtener todos los testimonios ordenados por fecha
export async function GET() {
  try {
    const testimonios = await prisma.testimonio.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ testimonios });
  } catch (error) {
    console.error('Error al obtener testimonios:', error);
    return NextResponse.json({ error: 'Error al consultar testimonios' }, { status: 500 });
  }
}

// POST: Crear un nuevo testimonio
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { author, title, content } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Título y contenido son requeridos' }, { status: 400 });
    }

    const nuevoTestimonio = await prisma.testimonio.create({
      data: {
        author: author || 'Hermano de Iglesia',
        title,
        content,
      },
    });

    return NextResponse.json({ message: 'Testimonio publicado', testimonio: nuevoTestimonio });
  } catch (error) {
    console.error('Error al guardar testimonio:', error);
    return NextResponse.json({ error: 'Error al guardar testimonio' }, { status: 500 });
  }
}