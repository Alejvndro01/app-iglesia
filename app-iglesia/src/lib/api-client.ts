import { Testimonio, Material, Oracion, SolicitudCurso, HimnoDetail } from '@/types';

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

  // Himnario
  getHimno: (numero: number) => fetcher<HimnoDetail>(`/api/himnario/${numero}`),

  // Oraciones
  createOracion: (data: { nombre: string; peticion: string; esPrivado: boolean }) =>
    fetcher('/api/oraciones', { method: 'POST', body: JSON.stringify(data) }),
};