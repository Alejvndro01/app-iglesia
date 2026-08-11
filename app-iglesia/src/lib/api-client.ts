import { 
  Testimonio, 
  Material, 
  Oracion, 
  SolicitudCurso, 
  HimnoDetail, 
  Usuario,
  Archivo 
} from '@/types';

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Error HTTP: ${res.status}`);
  }

  return res.json();
}

export const apiClient = {
  // Testimonios
  getTestimonios: () => fetcher<Testimonio[]>('/api/testimonios'),
  createTestimonio: (data: Omit<Testimonio, 'id' | 'createdAt'>) =>
    fetcher<Testimonio>('/api/testimonios', { method: 'POST', body: JSON.stringify(data) }),

  // Archivos / Materiales
  getMateriales: () => fetcher<Material[]>('/api/archivos'),
  getArchivos: () => fetcher<{ archivos: Archivo[] }>('/api/archivos'),
  saveArchivoMetadata: (data: {
    nombre: string;
    url: string;
    key: string;
    tipo: string;
    tamano: number;
  }) =>
    fetcher<Archivo>('/api/archivos', {
      method: 'POST',
      body: JSON.stringify({
        titulo: data.nombre,
        path: data.url,
        mimeType: data.tipo,
        tamano: data.tamano,
      }),
    }),

  // Himnario
  searchHimnos: (query: string) => 
    fetcher<HimnoDetail[]>(`/api/himnario?q=${encodeURIComponent(query)}`),
  getHimno: (numero: number) => 
    fetcher<HimnoDetail>(`/api/himnario/${numero}`),

  // Lección
  getLeccionActual: () => 
    fetcher<Record<string, unknown>>('/api/leccion/actual'),

  // Cursos Bíblicos
  getSolicitudesCursos: () => 
    fetcher<{ solicitudes: SolicitudCurso[] }>('/api/cursos'),
  createSolicitudCurso: (data: Omit<SolicitudCurso, 'id' | 'createdAt'>) =>
    fetcher<{ message: string }>('/api/cursos', { method: 'POST', body: JSON.stringify(data) }),

  // Oraciones
  getOracionesAdmin: () => 
    fetcher<{ oraciones: Oracion[] }>('/api/admin/oraciones'),
  createOracion: (data: { nombre: string; peticion: string; esPrivado: boolean }) =>
    fetcher<Oracion>('/api/oraciones', { method: 'POST', body: JSON.stringify(data) }),
  patchOracionStatus: (id: string, status: string) =>
    fetcher<Oracion>('/api/admin/oraciones', { 
      method: 'PATCH', 
      body: JSON.stringify({ id, status }) 
    }),

  // Chatbot IA (Esperanza)
  sendChatMessage: (messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>) =>
    fetcher<{ reply: string }>('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    }),

  // Auth
  login: (credentials: { email: string; password: string }) =>
    fetcher<{ user: Usuario }>('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  logout: () => 
    fetcher<{ message: string }>('/api/auth/logout', { method: 'POST' }),
};