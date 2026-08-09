import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// GET: Obtener oraciones para el panel
export async function GET() {
  try {
    const oraciones = await prisma.oracion.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ oraciones });
  } catch (error) {
    return NextResponse.json({ error: 'Error al consultar oraciones' }, { status: 500 });
  }
}

// PATCH: Cambiar estado de la oración (ej. a "Respondida")
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID y estado son requeridos' }, { status: 400 });
    }

    const oracionActualizada = await prisma.oracion.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ message: 'Estado actualizado', oracion: oracionActualizada });
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar estado' }, { status: 500 });
  }
}