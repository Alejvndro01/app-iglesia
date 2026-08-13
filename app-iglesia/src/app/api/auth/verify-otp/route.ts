import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, telefono, code, name, password } = body;

    const identifier = email
      ? email.toLowerCase().trim()
      : telefono
      ? telefono.toString().replace(/\s+/g, '')
      : null;

    if (!identifier || !code) {
      return NextResponse.json(
        { error: 'Faltan datos obligatorios (email/teléfono o código).' },
        { status: 400 }
      );
    }

    // 1. Buscar registros en VerificationToken para el identificador
    const records = await prisma.verificationToken.findMany({
      where: { identifier },
    });

    const cleanCode = code.toString().trim();
    const validRecord = records.find((r) => {
      const [savedCode] = r.token.split(':');
      return savedCode === cleanCode && new Date(r.expires) > new Date();
    });

    if (!validRecord) {
      return NextResponse.json(
        { error: 'El código es incorrecto o ha expirado.' },
        { status: 400 }
      );
    }

    // -------------------------------------------------------------
    // CASO 1: REGISTRO DE USUARIO (Si incluye nombre y contraseña)
    // -------------------------------------------------------------
    if (name && password) {
      if (!PASSWORD_REGEX.test(password)) {
        return NextResponse.json(
          { error: 'La contraseña no cumple con los requisitos de seguridad.' },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.usuario.create({
        data: {
          email: email ? identifier : null,
          name,
          password: hashedPassword,
          role: 'USER',
        },
      });

      await prisma.verificationToken.deleteMany({
        where: { identifier },
      });

      return NextResponse.json({
        success: true,
        user: { id: newUser.id, email: newUser.email, name: newUser.name },
      });
    }

    // -------------------------------------------------------------
    // CASO 2: VERIFICACIÓN SIMPLE (Para cursos o validación de teléfono)
    // -------------------------------------------------------------
    await prisma.verificationToken.deleteMany({
      where: { identifier },
    });

    return NextResponse.json({
      success: true,
      verified: true,
      message: 'Verificación de código exitosa.',
    });
  } catch (error) {
    console.error('Error al verificar OTP:', error);
    return NextResponse.json(
      { error: 'Error interno al procesar la verificación.' },
      { status: 500 }
    );
  }
}