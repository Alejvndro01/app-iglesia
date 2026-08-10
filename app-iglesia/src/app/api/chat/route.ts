import { NextResponse } from 'next/server';

const SYSTEM_INSTRUCTION = `
Eres Esperanza, la asistente virtual teológica y comunitaria de la Iglesia Adventista del Séptimo Día Central de Hualqui.
Tu misión es orientar con amor, respeto y fundamento bíblico adventista a las personas que visitan la página web.

Información Clave de la Iglesia:
- Dirección: Bulnes 450, Hualqui, Región del Bío-Bío.
- Horarios de Culto:
  * Sábados: Escuela Sabática a las 10:00 hrs y Culto Divino a las 11:30 hrs.
  * Jóvenes JA: Sábados a las 18:00 hrs.
  * Culto de Oración: Miércoles a las 19:00 hrs.
- Recursos: Contamos con lecciones de Escuela Sabática, himnario, estudios bíblicos, testimonios y descargas de materiales en la web.

Reglas de Comportamiento:
1. Responde con un tono cálido, fraternal, amigable y comprensivo.
2. Utiliza versículos bíblicos de la versión Reina-Valera cuando sea oportuno.
3. Sé concisa en tus respuestas (máximo 2 párrafos cortos).
4. Invita fraternalmente a la persona a visitar la iglesia o solicitar un estudio bíblico si muestra interés.
`;

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('Falta la variable GEMINI_API_KEY');
      return NextResponse.json(
        { error: 'Clave API de Gemini no configurada' },
        { status: 500 }
      );
    }

    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Historial de mensajes inválido' }, { status: 400 });
    }

    // Adaptar el historial para el API de Google Gemini
    const contents = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Lista de endpoints candidatos a probar en orden de velocidad/estabilidad
    const candidateModels = [
      'gemini-1.5-flash',
      'gemini-2.0-flash-exp',
      'gemini-2.5-flash',
    ];

    let replyText = '';
    let lastErrorDetails = '';

    for (const model of candidateModels) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const apiResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }],
          },
          contents: contents,
        }),
      });

      if (apiResponse.ok) {
        const data = await apiResponse.json();
        replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (replyText) break;
      } else {
        lastErrorDetails = await apiResponse.text();
        console.warn(`Modelo ${model} no respondió correctamente:`, lastErrorDetails);
      }
    }

    if (!replyText) {
      console.error('Ningún modelo de Gemini pudo procesar la solicitud:', lastErrorDetails);
      return NextResponse.json(
        { error: 'Inconveniente al conectar con el motor de respuesta.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error('Error interno en la ruta de chat:', error);
    return NextResponse.json(
      { error: 'Esperanza no está disponible en este momento.' },
      { status: 500 }
    );
  }
}