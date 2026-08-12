import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, code, name, password } = await request.json();

    if (!email || !code || !name || !password) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const emailNormalized = email.toLowerCase().trim();

    // 1. Buscar token en VerificationToken
    const records = await prisma.verificationToken.findMany({
      where: { identifier: emailNormalized },
    });

    const validRecord = records.find((r) => {
      const [savedCode] = r.token.split(':');
      return savedCode === code && new Date(r.expires) > new Date();
    });

    if (!validRecord) {
      return NextResponse.json(
        { error: 'El código es incorrecto o ha expirado.' },
        { status: 400 }
      );
    }

    // 2. Hash de contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Crear usuario definitivo
    const newUser = await prisma.usuario.create({
      data: {
        email: emailNormalized,
        name,
        password: hashedPassword,
        role: 'USER',
      },
    });

    // 4. Limpiar token de verificación utilizado
    await prisma.verificationToken.deleteMany({
      where: { identifier: emailNormalized },
    });

    return NextResponse.json({
      success: true,
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
    });
  } catch (error) {
    console.error('Error al verificar OTP:', error);
    return NextResponse.json({ error: 'Error al completar el registro' }, { status: 500 });
  }
}