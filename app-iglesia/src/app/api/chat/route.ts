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
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      console.error('Falta GEMINI_API_KEY');
      return NextResponse.json({ error: 'API Key no configurada' }, { status: 500 });
    }

    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Historial inválido' }, { status: 400 });
    }

    // 1. Filtrar solo los mensajes enviados por el usuario o assistant, omitiendo saludos estáticos
    const formattedContents = messages
      .map((msg: { role: string; content: string }) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }))
      // Regla estricta de Gemini: El primer elemento DEBE ser del rol 'user'
      .filter((item, index) => index > 0 || item.role === 'user');

    if (formattedContents.length === 0) {
      return NextResponse.json({ error: 'Sin mensajes válidos del usuario' }, { status: 400 });
    }

    // 2. Probar en orden los alias vigentes de la API v1beta
    const modelsToTry = [
      'gemini-1.5-flash-latest',
      'gemini-2.0-flash',
      'gemini-1.5-flash-8b',
    ];

    let reply = '';
    let lastError = '';

    for (const modelName of modelsToTry) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }],
          },
          contents: formattedContents,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (reply) break;
      } else {
        lastError = await res.text();
        console.warn(`[Gemini Try Error - ${modelName}]:`, lastError);
      }
    }

    if (!reply) {
      console.error('[Gemini All Models Failed]:', lastError);
      return NextResponse.json(
        { error: 'No se pudo conectar con el motor de IA.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('[Chat API Exception]:', error);
    return NextResponse.json(
      { error: 'Inconveniente interno al procesar la solicitud.' },
      { status: 500 }
    );
  }
}