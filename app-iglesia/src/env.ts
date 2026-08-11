import { z } from 'zod';

const envSchema = z.object({
  // Base de datos y Auth
  DATABASE_URL: z
    .string()
    .url('DATABASE_URL debe ser una URL de conexión de PostgreSQL válida'),
  JWT_SECRET: z
    .string()
    .min(16, 'JWT_SECRET debe tener al menos 16 caracteres para ser segura'),

  // Cloudflare R2
  R2_ACCOUNT_ID: z.string().min(1, 'R2_ACCOUNT_ID es requerido'),
  R2_ACCESS_KEY_ID: z.string().min(1, 'R2_ACCESS_KEY_ID es requerido'),
  R2_SECRET_ACCESS_KEY: z.string().min(1, 'R2_SECRET_ACCESS_KEY es requerido'),
  R2_BUCKET_NAME: z.string().min(1, 'R2_BUCKET_NAME es requerido'),
  R2_PUBLIC_URL: z
    .string()
    .url('R2_PUBLIC_URL debe ser una URL válida (ej: https://...r2.dev)'),

  // Proveedores de Inteligencia Artificial (Opcionales o requeridos según uso)
  OPENAI_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),

  // Entorno de ejecución
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Error de validación en variables de entorno (.env):');
  console.error(JSON.stringify(_env.error.format(), null, 2));
  throw new Error(
    'Faltan variables de entorno requeridas o son inválidas. Revisa la consola.'
  );
}

export const env = _env.data;