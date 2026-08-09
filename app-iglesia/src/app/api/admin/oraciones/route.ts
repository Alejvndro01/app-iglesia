import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; // O jsonwebtoken según tu paquete
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar el Token JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Validar el Rol
    if (payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Acceso denegado: Requiere rol ADMIN' }, { status: 403 });
    }

    // Si es ADMIN, responder con los datos
    const oraciones = await prisma.oracion.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ oraciones });

  } catch (error) {
    return NextResponse.json({ error: 'Sesión inválida o expirada' }, { status: 401 });
  }
}