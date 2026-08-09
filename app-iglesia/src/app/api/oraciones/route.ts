import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, request: reqText, isPrivate } = body;

    if (!reqText) {
      return NextResponse.json({ error: 'El motivo es requerido' }, { status: 400 });
    }

    const nuevaOracion = await prisma.oracion.create({
      data: {
        nombre: nombre || 'Anónimo',
        request: reqText,
        isPrivate: !!isPrivate,
      },
    });

    return NextResponse.json({ message: 'Oración registrada', oracion: nuevaOracion });
  } catch (error) {
    return NextResponse.json({ error: 'Error al registrar oración' }, { status: 500 });
  }
}