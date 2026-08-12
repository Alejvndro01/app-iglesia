import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'El email es obligatorio' }, { status: 400 });
    }

    const emailNormalized = email.toLowerCase().trim();

    // 1. Comprobar si la cuenta ya existe en la base de datos
    const existingUser = await prisma.usuario.findUnique({
      where: { email: emailNormalized },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este correo ya está registrado.' },
        { status: 400 }
      );
    }

    // 2. Generar código de 6 dígitos y token único
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const token = `otp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    // 3. Eliminar tokens viejos de este email y crear el nuevo
    await prisma.verificationToken.deleteMany({
      where: { identifier: emailNormalized },
    });

    await prisma.verificationToken.create({
      data: {
        identifier: emailNormalized,
        token: `${code}:${token}`, // Guardamos codigo y token concatenados
        expires,
      },
    });

    // 4. Enviar correo electrónico
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'IASD Hualqui <onboarding@resend.dev>',
        to: [emailNormalized],
        subject: '🔒 Tu código de verificación - IASD Hualqui',
        html: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2>Verificación de Cuenta</h2>
            <p>Ingresa el siguiente código en la página para completar tu registro:</p>
            <h1 style="font-size: 32px; letter-spacing: 5px; color: #486379;">${code}</h1>
            <p>Este código expira en 10 minutos.</p>
          </div>
        `,
      });
    } else {
      console.log(`\n[DEV MODE] Código OTP para ${emailNormalized}: ${code}\n`);
    }

    return NextResponse.json({ success: true, tokenIdentifier: token });
  } catch (error) {
    console.error('Error enviando OTP:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}