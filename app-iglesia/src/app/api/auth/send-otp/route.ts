import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

// Configurar transportador SMTP con Gmail
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
      return NextResponse.json({ error: 'El email es obligatorio' }, { status: 400 });
    }

    const emailNormalized = email.toLowerCase().trim();

    // 1. Verificar si el usuario ya existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email: emailNormalized },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este correo ya está registrado.' },
        { status: 400 }
      );
    }

    // 2. Generar código OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const token = `otp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const expires = new Date(Date.now() + 10 * 60 * 1000); // Expiración en 10 min

    // 3. Persistir token en Neon PostgreSQL
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

    // 4. Enviar correo usando Gmail SMTP
    await transporter.sendMail({
      from: `"IASD Central Hualqui" <${process.env.GMAIL_USER}>`,
      to: emailNormalized,
      subject: '🔒 Tu código de verificación - IASD Hualqui',
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #486379;">Verificación de Cuenta</h2>
          <p>Ingresa el siguiente código en la página para completar tu registro:</p>
          <h1 style="font-size: 36px; letter-spacing: 6px; color: #eca489; background: #fbf6ee; padding: 10px 20px; display: inline-block; rounded: 10px;">${code}</h1>
          <p style="font-size: 12px; color: #777;">Este código expira en 10 minutos.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, tokenIdentifier: token });
  } catch (error) {
    console.error('Error enviando OTP con Nodemailer:', error);
    return NextResponse.json({ error: 'Error al enviar el correo de verificación' }, { status: 500 });
  }
}