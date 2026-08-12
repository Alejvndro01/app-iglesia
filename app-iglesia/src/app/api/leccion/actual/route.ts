import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Convertir string DD/MM/YYYY a objeto Date real de JS
function parseSpanishDate(dateStr: string): Date {
  if (!dateStr) return new Date();
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return new Date(dateStr);
}

export async function GET() {
  try {
    // 1. Obtener el trimestre de Adventech
    const quarterRes = await fetch(
      'https://sabbath-school.adventech.io/api/v2/es/quarterlies/2026-03/index.json',
      { next: { revalidate: 3600 } }
    );

    if (!quarterRes.ok) throw new Error('Error conectando con la API de Adventech');

    const quarterData = await quarterRes.json();
    const lessons = quarterData.lessons || [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 2. Buscar lección correspondiente a la semana
    let currentLesson = lessons.find((l: any) => {
      const start = parseSpanishDate(l.start_date);
      const end = parseSpanishDate(l.end_date);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return today >= start && today <= end;
    });

    if (!currentLesson && lessons.length > 0) {
      currentLesson = lessons[lessons.length - 1];
    }

    // 3. Obtener el detalle de días
    const lessonDetailRes = await fetch(
      `https://sabbath-school.adventech.io/api/v2/es/quarterlies/2026-03/lessons/${currentLesson.id}/index.json`
    );
    const lessonDetail = await lessonDetailRes.json();
    const daysList = lessonDetail.days || [];

    // 4. Obtener contenido HTML de cada día
    const daysWithContent = await Promise.all(
      daysList.map(async (d: any) => {
        try {
          const dayRes = await fetch(
            `https://sabbath-school.adventech.io/api/v2/es/quarterlies/2026-03/lessons/${currentLesson.id}/days/${d.id}/read/index.json`
          );
          if (dayRes.ok) {
            const readData = await dayRes.json();
            return {
              id: d.id,
              title: d.title,
              date: d.date,
              html: readData.read?.content || readData.content || '<p>Sin contenido registrado.</p>',
            };
          }
        } catch {
          // Ignorar error individual
        }
        return {
          id: d.id,
          title: d.title,
          date: d.date,
          html: '<p>Contenido no disponible para este día.</p>',
        };
      })
    );

    const responsePayload = {
      tituloSemana: currentLesson.title,
      fechaInicio: currentLesson.start_date,
      fechaFin: currentLesson.end_date,
      portada: currentLesson.cover || '',
      dias: daysWithContent, // Nombre de la propiedad que espera el Frontend
    };

    // 5. GUARDAR / ACTUALIZAR EN NEON POSTGRESQL
    await prisma.leccionCache.upsert({
      where: { id: 'actual' },
      update: {
        quarter: '3er Trimestre 2026',
        lessonNumber: parseInt(currentLesson.id, 10) || 1,
        title: responsePayload.tituloSemana,
        memoryVerse: '',
        daysJson: JSON.stringify(daysWithContent),
      },
      create: {
        id: 'actual',
        quarter: '3er Trimestre 2026',
        lessonNumber: parseInt(currentLesson.id, 10) || 1,
        title: responsePayload.tituloSemana,
        memoryVerse: '',
        daysJson: JSON.stringify(daysWithContent),
      },
    });

    return NextResponse.json({
      ...responsePayload,
      source: 'live-api',
    });
  } catch (error) {
    console.warn('Fallback a la caché de DB por error:', error);

    // 6. FALLBACK DESDE BASE DE DATOS NEON
    try {
      const cachedLesson = await prisma.leccionCache.findUnique({
        where: { id: 'actual' },
      });

      if (cachedLesson) {
        return NextResponse.json({
          tituloSemana: cachedLesson.title,
          fechaInicio: '',
          fechaFin: '',
          portada: '',
          dias: JSON.parse(cachedLesson.daysJson), // Mapear propiedad 'dias'
          source: 'database-cache',
        });
      }
    } catch (dbError) {
      console.error('Error al leer caché DB:', dbError);
    }

    return NextResponse.json({ error: 'No se pudo sincronizar la lección' }, { status: 500 });
  }
}