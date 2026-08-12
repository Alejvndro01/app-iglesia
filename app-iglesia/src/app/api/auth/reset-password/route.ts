import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Mismas reglas de fortaleza (>=8 caracteres, 1 mayúscula, 1 número)
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

export async function POST(request: Request) {
  try {
    const { email, code, newPassword } = await request.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const emailNormalized = email.toLowerCase().trim();

    // 1. Validar fortaleza de contraseña
    if (!PASSWORD_REGEX.test(newPassword)) {
      return NextResponse.json(
        { error: 'La nueva contraseña no cumple con los requisitos de seguridad.' },
        { status: 400 }
      );
    }

    // 2. Validar OTP en VerificationToken
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

    // 3. Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 4. Actualizar contraseña del usuario
    await prisma.usuario.update({
      where: { email: emailNormalized },
      data: { password: hashedPassword },
    });

    // 5. Eliminar tokens usados
    await prisma.verificationToken.deleteMany({
      where: { identifier: emailNormalized },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    return NextResponse.json({ error: 'Error al cambiar la contraseña' }, { status: 500 });
  }
}