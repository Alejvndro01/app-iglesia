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
    const { email, telefono } = await request.json();

    if (!email && !telefono) {
      return NextResponse.json(
        { error: 'Debes proporcionar un email o un número de teléfono.' },
        { status: 400 }
      );
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const tokenStr = `otp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // -------------------------------------------------------------
    // ENVÍO VÍA EMAIL (Nodemailer)
    // -------------------------------------------------------------
    if (email) {
      const emailNormalized = email.toLowerCase().trim();

      const existingUser = await prisma.usuario.findUnique({
        where: { email: emailNormalized },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Este correo ya está registrado.' },
          { status: 400 }
        );
      }

      await prisma.verificationToken.deleteMany({
        where: { identifier: emailNormalized },
      });

      await prisma.verificationToken.create({
        data: {
          identifier: emailNormalized,
          token: `${code}:${tokenStr}`,
          expires,
        },
      });

      await transporter.sendMail({
        from: `"IASD Central Hualqui" <${process.env.GMAIL_USER}>`,
        to: emailNormalized,
        subject: '🔒 Tu código de verificación - IASD Hualqui',
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #486379;">Verificación de Cuenta</h2>
            <p>Ingresa el siguiente código en la página para completar tu registro:</p>
            <h1 style="font-size: 36px; letter-spacing: 6px; color: #eca489; background: #fbf6ee; padding: 10px 20px; display: inline-block; border-radius: 10px;">${code}</h1>
            <p style="font-size: 12px; color: #777;">Este código expira en 10 minutos.</p>
          </div>
        `,
      });

      return NextResponse.json({ success: true, tokenIdentifier: tokenStr, channel: 'email' });
    }

    // -------------------------------------------------------------
    // ENVÍO VÍA WHATSAPP (Microservicio Baileys)
    // -------------------------------------------------------------
    if (telefono) {
      const cleanPhone = telefono.toString().replace(/\s+/g, '');
      const phoneRegex = /^\+569\d{8}$/;

      if (!phoneRegex.test(cleanPhone)) {
        return NextResponse.json(
          { error: 'Formato de teléfono no válido. Ejemplo: +56912345678' },
          { status: 400 }
        );
      }

      // Guardar teléfono en 'identifier' y el código OTP en 'token'
      await prisma.verificationToken.deleteMany({
        where: { identifier: cleanPhone },
      });

      await prisma.verificationToken.create({
        data: {
          identifier: cleanPhone,
          token: `${code}:${tokenStr}`,
          expires,
        },
      });

      const WHATSAPP_SERVICE_URL = process.env.WHATSAPP_SERVICE_URL;
      const WHATSAPP_API_SECRET = process.env.WHATSAPP_API_SECRET;

      if (!WHATSAPP_SERVICE_URL || !WHATSAPP_API_SECRET) {
        return NextResponse.json(
          { error: 'Error de configuración en el servidor de WhatsApp.' },
          { status: 500 }
        );
      }

      const whatsappResponse = await fetch(`${WHATSAPP_SERVICE_URL}/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${WHATSAPP_API_SECRET}`,
        },
        body: JSON.stringify({
          phone: cleanPhone,
          message: `🔒 *IASD Central Hualqui*\n\nTu código de verificación es: *${code}*\n\nEste código vencerá en 10 minutos.`,
        }),
      });

      if (!whatsappResponse.ok) {
        return NextResponse.json(
          { error: 'No se pudo enviar el mensaje por WhatsApp.' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, tokenIdentifier: tokenStr, channel: 'whatsapp' });
    }
  } catch (error) {
    console.error('Error procesando OTP:', error);
    return NextResponse.json(
      { error: 'Error interno al enviar el código de verificación.' },
      { status: 500 }
    );
  }
}