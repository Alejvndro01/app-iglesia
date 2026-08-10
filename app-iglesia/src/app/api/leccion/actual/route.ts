import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Obtener la lista de lecciones del trimestre actual (Español / Adultos)
    const quarterRes = await fetch(
      'https://sabbath-school.adventech.io/api/v2/es/quarterlies/2026-03/index.json',
      { next: { revalidate: 86400 } } // Caché de 24 horas en Next.js
    );

    if (!quarterRes.ok) {
      throw new Error('Error al conectar con la API de Adventech');
    }

    const quarterData = await quarterRes.json();
    const lessons = quarterData.lessons || [];

    // 2. Calcular la lección correspondiente a la semana actual por fecha
    const today = new Date();
    
    // Buscar la semana cuya fecha de inicio/fin contenga el día de hoy
    let currentLesson = lessons.find((l: any) => {
      const start = new Date(l.start_date);
      const end = new Date(l.end_date);
      return today >= start && today <= end;
    });

    // Fallback a la primera lección si está fuera de rango de fechas
    if (!currentLesson && lessons.length > 0) {
      currentLesson = lessons[0];
    }

    // 3. Obtener los detalles y días de la lección semanal encontrada
    const lessonDetailRes = await fetch(
      `https://sabbath-school.adventech.io/api/v2/es/quarterlies/2026-03/lessons/${currentLesson.id}/index.json`
    );
    const lessonDetail = await lessonDetailRes.json();

    return NextResponse.json({
      tituloSemana: currentLesson.title,
      fechaInicio: currentLesson.start_date,
      fechaFin: currentLesson.end_date,
      portada: currentLesson.cover,
      dias: lessonDetail.days || [],
    });
  } catch (error) {
    console.error('Error al sincronizar lección:', error);
    return NextResponse.json(
      { error: 'No se pudo sincronizar la lección automática' },
      { status: 500 }
    );
  }
}