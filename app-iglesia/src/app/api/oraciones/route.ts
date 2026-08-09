import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET() {
  try {
    const oraciones = await prisma.oracion.findMany({
      where: { isPrivate: false }, // <-- CAMBIADO DE 'privado' A 'isPrivate'
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(oraciones);
  } catch (error) {
    return NextResponse.json({ error: 'Error al consultar oraciones' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const nombre = body.nombre || body.author || 'Anónimo';
    const peticion = body.peticion || body.motivo || body.request || body.content;
    const esPrivado = body.esPrivado ?? body.isPrivate ?? body.privado ?? false;

    if (!peticion) {
      return NextResponse.json({ error: 'El motivo de oración es requerido' }, { status: 400 });
    }

    const nuevaOracion = await prisma.oracion.create({
      data: {
        nombre: nombre.trim(),
        request: peticion.trim(),       // <-- CAMBIADO DE 'peticion' A 'request'
        isPrivate: Boolean(esPrivado), // <-- CAMBIADO DE 'privado' A 'isPrivate'
      },
    });

    return NextResponse.json(nuevaOracion, { status: 201 });
  } catch (error) {
    console.error('Error al guardar oración:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}