import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { env } from '@/env';
import { limiter } from '@/lib/ratelimit';
import { z } from 'zod';

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

// Validación de entrada con Zod
const chatPayloadSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string().min(1, 'El mensaje no puede estar vacío'),
      })
    )
    .min(1, 'Debe enviar al menos un mensaje en el historial'),
});

export async function POST(request: Request) {
  try {
    // 1. Detección de IP y aplicación de Rate Limit por cliente
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    const limitResult = await limiter.limit(`chat_${ip}`);

    if (!limitResult.success) {
      return NextResponse.json(
        {
          error:
            'Has alcanzado el límite de preguntas permitidas por minuto. Por favor, aguarda un momento antes de consultar a Esperanza nuevamente.',
        },
        { status: 429 }
      );
    }

    // 2. Validación de credenciales del servidor mediante módulo `env`
    const apiKey = env.GROQ_API_KEY || process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.error('[GROQ_ERROR] GROQ_API_KEY no se encuentra configurada.');
      return NextResponse.json(
        { error: 'El servicio de IA no está configurado correctamente en el servidor' },
        { status: 500 }
      );
    }

    // 3. Validar estructura de payload
    const body = await request.json();
    const validation = chatPayloadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Historial de mensajes inválido', details: validation.error.format() },
        { status: 400 }
      );
    }

    const { messages } = validation.data;

    // 4. Formatear historial con el Prompt del Sistema
    const formattedMessages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_INSTRUCTION },
      ...messages.map((msg) => ({
        role: msg.role === 'assistant' ? ('assistant' as const) : ('user' as const),
        content: msg.content,
      })),
    ];

    // 5. Invocación de la API de Groq
    const groq = new Groq({ apiKey });
    const chatCompletion = await groq.chat.completions.create({
      messages: formattedMessages,
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

    return NextResponse.json({ reply }, { status: 200 });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
    console.error('[GROQ_CRASH]', errorMsg);

    return NextResponse.json(
      { error: 'Esperanza no está disponible en este momento.' },
      { status: 500 }
    );
  }
}