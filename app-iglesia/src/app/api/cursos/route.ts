import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import nodemailer from 'nodemailer';

// Transportador SMTP reutilizando las variables de entorno de Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const cursoSchema = z.object({
  curso: z.string().min(3, 'El nombre del curso es requerido'),
  nombre: z.string().min(2, 'El nombre completo es requerido'),
  telefono: z.string().min(8, 'Ingresa un número telefónico válido'),
  direccion: z.string().optional(),
  modalidad: z.string().min(3, 'Selecciona una modalidad válida'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = cursoSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Datos de solicitud inválidos', details: validation.error.format() },
        { status: 400 }
      );
    }

    const cleanPhone = validation.data.telefono.replace(/\s+/g, '');

    // 1. Guardar la solicitud en Neon PostgreSQL
    const nuevaSolicitud = await prisma.solicitudCurso.create({
      data: {
        ...validation.data,
        telefono: cleanPhone,
      },
    });

    // 2. Definir correo del encargado asignado
    const ENCARGADO_EMAIL = process.env.ENCARGADO_CURSOS_EMAIL || process.env.GMAIL_USER;

    // 3. Notificar automáticamente al encargado vía Nodemailer
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      await transporter.sendMail({
        from: `"IASD Central Hualqui" <${process.env.GMAIL_USER}>`,
        to: ENCARGADO_EMAIL,
        subject: `📥 Nueva Solicitud: ${validation.data.curso} - ${validation.data.nombre}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #486379; margin-bottom: 4px;">Nueva Solicitud de Estudio Bíblico</h2>
            <p style="font-size: 12px; color: #10b981; font-weight: bold; margin-top: 0;">✓ Teléfono verificado por WhatsApp</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
            
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #64748b;">Curso Solicitado:</td>
                <td style="padding: 6px 0; color: #eca489; font-weight: bold;">${validation.data.curso}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #64748b;">Solicitante:</td>
                <td style="padding: 6px 0; color: #1e293b;">${validation.data.nombre}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #64748b;">WhatsApp / Teléfono:</td>
                <td style="padding: 6px 0;">
                  <a href="https://wa.me/${cleanPhone.replace('+', '')}" style="color: #25D366; font-weight: bold; text-decoration: none;">
                    ${cleanPhone} (Abrir Chat)
                  </a>
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #64748b;">Dirección:</td>
                <td style="padding: 6px 0; color: #1e293b;">${validation.data.direccion || 'No especificada'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-weight: bold; color: #64748b;">Modalidad:</td>
                <td style="padding: 6px 0; color: #1e293b;">${validation.data.modalidad}</td>
              </tr>
            </table>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">
              ID de Solicitud: ${nuevaSolicitud.id}
            </p>
          </div>
        `,
      });
    }

    return NextResponse.json(
      { message: 'Solicitud guardada y notificada al encargado', solicitud: nuevaSolicitud },
      { status: 201 }
    );
  } catch (error) {
    console.error('[CURSOS_POST_ERROR]', error);
    return NextResponse.json({ error: 'Error interno al procesar la solicitud' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const solicitudes = await prisma.solicitudCurso.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ solicitudes });
  } catch (error) {
    console.error('[CURSOS_GET_ERROR]', error);
    return NextResponse.json({ error: 'Error al obtener solicitudes' }, { status: 500 });
  }
}