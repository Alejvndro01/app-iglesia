import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

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
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Historial de mensajes inválido' }, { status: 400 });
    }

    // Formatear historial para el SDK de Gemini
    const contents = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Generar respuesta usando Gemini 2.5 Flash
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    const reply = response.text || 'No pude procesar la respuesta.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error en API Chat Route con @google/genai:', error);
    return NextResponse.json(
      { error: 'Esperanza no está disponible en este momento.' },
      { status: 500 }
    );
  }
}