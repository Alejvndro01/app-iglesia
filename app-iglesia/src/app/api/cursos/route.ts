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
    const solicitudes = await prisma.solicitudCurso.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ solicitudes });
  } catch (error) {
    console.error('Error al consultar solicitudes:', error);
    return NextResponse.json({ error: 'Error al obtener las solicitudes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { curso, nombre, telefono, direccion, modalidad } = body;

    if (!curso || !nombre || !telefono) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    const solicitud = await prisma.solicitudCurso.create({
      data: { curso, nombre, telefono, direccion, modalidad },
    });

    return NextResponse.json({ message: 'Solicitud enviada con éxito', solicitud });
  } catch (error) {
    console.error('Error al guardar solicitud:', error);
    return NextResponse.json({ error: 'Error al procesar solicitud' }, { status: 500 });
  }
}