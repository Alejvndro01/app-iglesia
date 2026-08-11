'use client';

import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/lib/api-client';
import { Oracion, SolicitudCurso, Archivo } from '@/types';

interface AdminViewProps {
  showToast: (msg: string) => void;
}

export function AdminPanelPageView({ showToast }: AdminViewProps) {
  const [prayers, setPrayers] = useState<Oracion[]>([]);
  const [courses, setCourses] = useState<SolicitudCurso[]>([]);
  const [files, setFiles] = useState<Archivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      const [dataPrayers, dataCourses, dataFiles] = await Promise.all([
        apiClient.getOracionesAdmin(),
        apiClient.getSolicitudesCursos(),
        apiClient.getArchivos(),
      ]);

      setPrayers(dataPrayers.oraciones || []);
      setCourses(dataCourses.solicitudes || []);
      setFiles(dataFiles.archivos || []);
    } catch {
      showToast('Error al cargar datos del panel');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkAsAnswered = async (id: string) => {
    try {
      await apiClient.patchOracionStatus(id, 'Respondida');
      showToast('Oración marcada como Respondida');
      setPrayers(prayers.map((p) => (p.id === id ? { ...p, status: 'Respondida' } : p)));
    } catch {
      showToast('Error al actualizar estado');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Límite de payload en Serverless Functions de Vercel (4.5 MB)
    const MAX_SIZE_MB = 4.5;
    if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      showToast(`El archivo supera el límite de ${MAX_SIZE_MB} MB para subida directa.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // 1. Carga a través del Proxy API
      const res = await fetch('/api/archivos/upload', {
        method: 'POST',
        body: formData,
      });

      // Manejo seguro del cuerpo de respuesta (evita Unexpected end of JSON input)
      const textResponse = await res.text();
      let data: Record<string, unknown> = {};

      try {
        data = textResponse ? JSON.parse(textResponse) : {};
      } catch {
        throw new Error(`El servidor devolvió una respuesta no válida (${res.status})`);
      }

      if (!res.ok) {
        const errorMsg = typeof data.error === 'string' ? data.error : `Error HTTP ${res.status}`;
        throw new Error(errorMsg);
      }

      const { publicUrl, key, fileName, fileType, fileSize } = data as {
        publicUrl: string;
        key: string;
        fileName: string;
        fileType: string;
        fileSize: number;
      };

      // 2. Persistir metadata en base de datos Neon
      const newFile = await apiClient.saveArchivoMetadata({
        nombre: fileName,
        url: publicUrl,
        key: key,
        tipo: fileType,
        tamano: fileSize,
      });

      setFiles([newFile, ...files]);
      showToast('Archivo subido con éxito a Cloudflare R2');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al subir archivo';
      showToast(msg);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs font-bold text-[#486379] dark:text-sky-300">
        Cargando datos del panel de control...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-[#486379] dark:bg-slate-800 text-white p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl border border-transparent dark:border-slate-700 transition-colors">
        <div>
          <span className="bg-[#eca489] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
            Gestión Eclesial
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-1 text-white dark:text-sky-300">
            Panel de Control de Liderazgo
          </h2>
          <p className="text-xs text-slate-200 dark:text-slate-300">
            Administración de oraciones, solicitudes de cursos bíblicos y repositorio de archivos R2.
          </p>
        </div>
      </div>

      {/* Sección Gestión de Archivos / Repositorio R2 */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-sky-100 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-black text-[#486379] dark:text-sky-300 text-base">
            📁 Repositorio de Archivos y Recursos (Cloudflare R2)
          </h3>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
              id="file-upload-input"
            />
            <label
              htmlFor="file-upload-input"
              className={`px-4 py-2 bg-[#eca489] hover:bg-[#e59376] text-white text-xs font-bold rounded-full cursor-pointer transition-colors ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {uploading ? 'Subiendo archivo...' : '⬆️ Subir Nuevo Archivo'}
            </label>
          </div>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {files.length === 0 ? (
            <p className="text-xs text-slate-400">No hay archivos alojados en la plataforma.</p>
          ) : (
            files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-100 dark:border-slate-700"
              >
                <div className="truncate max-w-md">
                  <p className="font-bold text-slate-700 dark:text-slate-200 truncate">{file.nombre}</p>
                  <p className="text-[10px] text-slate-400">
                    {(file.tamano / 1024 / 1024).toFixed(2)} MB | {file.tipo}
                  </p>
                </div>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-sky-500 hover:bg-sky-600 text-white text-[10px] font-bold rounded-full"
                >
                  Ver / Descargar
                </a>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Moderación de Oraciones */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-sky-100 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
          <h3 className="font-black text-[#486379] dark:text-sky-300 text-base">🙏 Moderación de Oraciones</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {prayers.length === 0 ? (
              <p className="text-xs text-slate-400">No hay oraciones registradas.</p>
            ) : (
              prayers.map((p) => (
                <div key={p.id} className="p-4 bg-[#f0f6fb] dark:bg-slate-800 rounded-2xl text-xs space-y-2 border border-transparent dark:border-slate-700">
                  <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                    <span>👤 {p.nombre} {p.isPrivate && '(Privado)'}</span>
                    <span className={p.status === 'Respondida' ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#eca489] dark:text-amber-400'}>
                      {p.status}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{p.request}</p>
                  {p.status !== 'Respondida' && (
                    <button
                      onClick={() => handleMarkAsAnswered(p.id)}
                      className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full text-[10px] cursor-pointer"
                    >
                      Marcar Respondida
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Cursos Bíblicos */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-sky-100 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
          <h3 className="font-black text-[#486379] dark:text-sky-300 text-base">📖 Solicitudes de Cursos Bíblicos</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {courses.length === 0 ? (
              <p className="text-xs text-slate-400">No hay solicitudes registradas.</p>
            ) : (
              courses.map((c) => (
                <div key={c.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs space-y-1 border border-slate-100 dark:border-slate-700">
                  <p className="font-bold text-[#eca489] dark:text-amber-400">{c.curso}</p>
                  <p className="font-bold text-slate-700 dark:text-slate-200">👤 {c.nombre}</p>
                  <p className="text-slate-500 dark:text-slate-400">📞 WhatsApp: {c.telefono}</p>
                  <p className="text-slate-500 dark:text-slate-400">📍 {c.direccion || 'Sin dirección'} ({c.modalidad})</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}