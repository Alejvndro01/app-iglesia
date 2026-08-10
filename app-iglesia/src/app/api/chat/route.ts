import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

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
    const apiKey = process.env.GROQ_API_KEY?.trim();

    if (!apiKey) {
      console.error('[GROQ_ERROR] La variable GROQ_API_KEY no está configurada en las variables de entorno.');
      return NextResponse.json(
        { error: 'Clave de Groq API no configurada en el servidor' },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey });
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Historial de mensajes inválido' }, { status: 400 });
    }

    // Filtrar y estructurar mensajes para Groq
    const formattedMessages = [
      { role: 'system', content: SYSTEM_INSTRUCTION },
      ...messages
        .filter((msg: { role: string; content: string }) => msg.content)
        .map((msg: { role: string; content: string }) => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content,
        })),
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: formattedMessages as any,
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 300,
    });

    const reply = chatCompletion.choices[0]?.message?.content;

    if (!reply) {
      return NextResponse.json(
        { error: 'Groq no devolvió ningún texto en la respuesta' },
        { status: 500 }
      );
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('[GROQ_CRASH]', error?.message || error);
    return NextResponse.json(
      { error: 'Esperanza no está disponible en este momento.' },
      { status: 500 }
    );
  }
}