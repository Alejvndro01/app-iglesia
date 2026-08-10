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
      return NextResponse.json({ error: 'API Key no configurada' }, { status: 500 });
    }

    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Historial inválido' }, { status: 400 });
    }

    const formattedContents = messages
      .map((msg: { role: string; content: string }) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }))
      .filter((item, index) => index > 0 || item.role === 'user');

    if (formattedContents.length === 0) {
      return NextResponse.json({ error: 'Sin mensajes válidos' }, { status: 400 });
    }

    // Endpoint directo al modelo gemini-2.0-flash (15 RPM en Free Tier)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: formattedContents,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[Gemini 2.0 Error]:', errText);
      return NextResponse.json(
        { error: 'Por favor, espera unos segundos antes de enviar otro mensaje.' },
        { status: res.status }
      );
    }

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json({ error: 'Error interno en la respuesta.' }, { status: 500 });
  }
}