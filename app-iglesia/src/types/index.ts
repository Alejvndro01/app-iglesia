export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'GUEST';
}

export interface Archivo {
  id: string;
  nombre: string;
  url: string;
  key: string;
  tipo: string;
  tamano: number;
  createdAt?: string;
}

export interface Testimonio {
  id: string;
  autor: string;
  titulo: string;
  contenido: string;
  createdAt: string;
}

export interface Material {
  id: string;
  titulo: string;
  path: string;
  mimeType: string;
  tamano: number;
  createdAt: string;
  usuario?: {
    nombre: string;
  };
}

export interface Oracion {
  id: string;
  nombre: string;
  request: string;
  isPrivate: boolean;
  status: 'Pendiente' | 'Respondida';
  createdAt: string;
}

export interface SolicitudCurso {
  id: string;
  curso: string;
  nombre: string;
  telefono: string;
  direccion?: string;
  modalidad: string;
  createdAt: string;
}

export interface HimnoVerse {
  number: number;
  type: 'verse' | 'chorus';
  text: string;
}

export interface HimnoDetail {
  number: number;
  title: string;
  bibleReference?: string;
  mp3Url?: string;
  mp3UrlInstr?: string;
  verses: HimnoVerse[];
  error?: string;
}