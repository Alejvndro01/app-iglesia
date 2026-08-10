import { NextResponse } from 'next/server';

export async function GET() {
  const boletinActual = {
    titulo: 'Boletín Sabático - IASD Hualqui',
    fecha: 'Sábado, 09 de Agosto, 2026',
    versiculoClave: 'Jehová es mi pastor; nada me faltará. En lugares de delicados pastos me hará descansar. (Salmos 23:1-2)',
    anuncios: [
      { id: '1', titulo: 'Culto de Jovenes (JA)', detalle: 'Este sábado a las 18:00 hrs. ¡Te esperamos!' },
      { id: '2', titulo: 'Reunión de Oración', detalle: 'Miércoles a las 19:00 hrs en el templo central.' },
      { id: '3', titulo: 'Almuerzo Fraternal', detalle: 'Próximo sábado después del Culto Divino.' },
    ],
    ordenCulto: [
      { hora: '10:00', actividad: 'Escuela Sabática' },
      { hora: '10:40', actividad: 'Rincón Infantil' },
      { hora: '11:00', actividad: 'Tabla del Misionero' },
      { hora: '11:30', actividad: 'Culto Divino & Predicación' },
    ],
  };

  return NextResponse.json(boletinActual);
}