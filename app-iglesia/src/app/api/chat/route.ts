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

// Obtener dinámicamente un modelo activo disponible en tu API key
async function getActiveModelName(apiKey: string): Promise<string> {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    if (!res.ok) return 'gemini-2.0-flash';
    
    const data = await res.json();
    const availableModels = data.models || [];

    // Buscar un modelo flash o pro que soporte generateContent
    const validModel = availableModels.find((m: any) => 
      m.supportedGenerationMethods?.includes('generateContent') && 
      (m.name.includes('flash') || m.name.includes('gemini'))
    );

    if (validModel?.name) {
      // Reemplaza "models/gemini-xxx" por "gemini-xxx"
      return validModel.name.replace('models/', '');
    }
  } catch (err) {
    console.warn('No se pudo listar modelos, usando fallback predeterminado:', err);
  }
  return 'gemini-2.0-flash';
}

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

    // Filtrar y formatear asegurando que el primer mensaje siempre sea del rol "user"
    const formattedContents = messages
      .map((msg: { role: string; content: string }) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }))
      .filter((item, index) => index > 0 || item.role === 'user');

    if (formattedContents.length === 0) {
      return NextResponse.json({ error: 'Sin mensajes del usuario' }, { status: 400 });
    }

    // Identificar el modelo activo en tiempo real
    const modelName = await getActiveModelName(apiKey);
    console.log(`[Gemini Active Model Selected]: ${modelName}`);

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

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[Gemini Call Failed on ${modelName}]:`, errText);
      return NextResponse.json(
        { error: 'Inconveniente con el motor de IA.' },
        { status: 500 }
      );
    }

    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return NextResponse.json({ error: 'Respuesta vacía recibida' }, { status: 500 });
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