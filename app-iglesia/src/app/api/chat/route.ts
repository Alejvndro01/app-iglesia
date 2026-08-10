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

    // Formatear el mensaje del sistema + historial en la estructura de contenidos de Gemini
    const contents = [
      {
        role: 'user',
        parts: [{ text: `Instrucción del sistema: ${SYSTEM_INSTRUCTION}` }],
      },
      {
        role: 'model',
        parts: [{ text: 'Entendido. Asumiré la personalidad de Esperanza para asistir a los miembros y visitantes de la Iglesia Adventista de Hualqui.' }],
      },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
    ];

    // Endpoint directo usando el modelo estable gemini-1.5-flash
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents }),
    });

    if (!res.ok) {
      const errData = await res.text();
      console.error('Respuesta de error de Gemini API:', errData);
      return NextResponse.json({ error: 'Error en la respuesta del motor de IA' }, { status: 500 });
    }

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No pude procesar la respuesta.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error en API Chat Route:', error);
    return NextResponse.json(
      { error: 'Esperanza no está disponible en este momento.' },
      { status: 500 }
    );
  }
}