import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'El correo es obligatorio' }, { status: 400 });
    }

    const emailNormalized = email.toLowerCase().trim();

    // 1. Verificar si el usuario existe
    const user = await prisma.usuario.findUnique({
      where: { email: emailNormalized },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'No existe ninguna cuenta registrada con este correo.' },
        { status: 404 }
      );
    }

    // 2. Si el usuario se registró únicamente con Google (password NULL)
    if (!user.password) {
      return NextResponse.json(
        { error: 'Esta cuenta utiliza inicio de sesión con Google. Inicia sesión directamente con Google.' },
        { status: 400 }
      );
    }

    // 3. Generar código OTP de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const token = `reset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

    // 4. Limpiar tokens anteriores de este email y crear nuevo
    await prisma.verificationToken.deleteMany({
      where: { identifier: emailNormalized },
    });

    await prisma.verificationToken.create({
      data: {
        identifier: emailNormalized,
        token: `${code}:${token}`,
        expires,
      },
    });

    // 5. Enviar correo electrónico
    await transporter.sendMail({
      from: `"IASD Central Hualqui" <${process.env.GMAIL_USER}>`,
      to: emailNormalized,
      subject: '🔑 Recuperación de Contraseña - IASD Hualqui',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #486379;">Restablecer Contraseña</h2>
          <p>Has solicitado restablecer tu contraseña. Utiliza el siguiente código de 6 dígitos:</p>
          <h1 style="font-size: 36px; letter-spacing: 6px; color: #eca489; background: #fbf6ee; padding: 10px 20px; display: inline-block; border-radius: 10px;">${code}</h1>
          <p style="font-size: 12px; color: #777;">Si no solicitaste este cambio, puedes ignorar este correo. El código expira en 10 minutos.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error enviando código de recuperación:', error);
    return NextResponse.json({ error: 'Error al enviar el correo' }, { status: 500 });
  }
}