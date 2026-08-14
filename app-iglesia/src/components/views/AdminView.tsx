'use client';

import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/lib/api-client';
import { Oracion, SolicitudCurso, Archivo } from '@/types';
import { 
  ShieldCheck, 
  FolderArchive, 
  Upload, 
  FileText, 
  Download, 
  Heart, 
  BookOpen, 
  CheckCircle2, 
  Loader2, 
  Phone, 
  MapPin, 
  User 
} from 'lucide-react';

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

      const rawFiles = (Array.isArray(dataFiles) ? dataFiles : dataFiles?.archivos || []) as unknown as Record<string, unknown>[];
      
      const normalizedFiles: Archivo[] = rawFiles.map((item, index) => {
        const nombre = String(item.nombre || item.titulo || item.fileName || `Archivo ${index + 1}`);
        const url = String(item.url || item.path || '#');
        const key = String(item.key || item.id || `key-${index}`);
        const tipo = String(item.tipo || item.mimeType || item.fileType || 'application/octet-stream');
        const tamano = Number(item.tamano || item.size || item.fileSize || 0);

        return {
          id: String(item.id || key),
          nombre,
          url,
          key,
          tipo,
          tamano,
          createdAt: String(item.createdAt || new Date().toISOString()),
        };
      });

      setFiles(normalizedFiles);
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

    setUploading(true);
    try {
      const presignedRes = await fetch('/api/archivos/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: selectedFile.name,
          fileType: selectedFile.type || 'application/octet-stream',
        }),
      });

      const presignedText = await presignedRes.text();
      let presignedData: Record<string, unknown> = {};

      try {
        presignedData = presignedText ? JSON.parse(presignedText) : {};
      } catch {
        throw new Error(`Respuesta inválida del servidor (${presignedRes.status})`);
      }

      if (!presignedRes.ok) {
        const errorMsg = typeof presignedData.error === 'string' ? presignedData.error : `Error HTTP ${presignedRes.status}`;
        throw new Error(errorMsg);
      }

      const { uploadUrl, publicUrl, key } = presignedData as {
        uploadUrl: string;
        publicUrl: string;
        key: string;
      };

      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': selectedFile.type || 'application/octet-stream',
        },
        body: selectedFile,
      });

      if (!uploadRes.ok) {
        throw new Error(`Error en almacenamiento R2 (HTTP ${uploadRes.status})`);
      }

      const savedMetadata = await apiClient.saveArchivoMetadata({
        nombre: selectedFile.name,
        url: publicUrl,
        key: key,
        tipo: selectedFile.type || 'application/octet-stream',
        tamano: selectedFile.size,
      });

      const newFile: Archivo = {
        id: savedMetadata.id || key,
        nombre: selectedFile.name,
        url: publicUrl,
        key: key,
        tipo: selectedFile.type || 'application/octet-stream',
        tamano: selectedFile.size,
        createdAt: new Date().toISOString(),
      };

      setFiles([newFile, ...files]);
      showToast('Archivo subido con éxito');
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
      <div className="max-w-7xl mx-auto px-4 py-24 text-center text-xs font-semibold text-[#7C9885] flex flex-col items-center justify-center space-y-2">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-[#66756C] dark:text-slate-400">Cargando datos del panel de control...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 antialiased">
      {/* Banner Principal de Liderazgo */}
      <div className="bg-[#7C9885] dark:bg-slate-900 text-white p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs border border-[#6B8774] dark:border-slate-800">
        <div className="space-y-2 text-center md:text-left">
          <span className="bg-white/20 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase border border-white/30 inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Gestión Eclesial
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white dark:text-emerald-100">
            Panel de Control de Liderazgo
          </h2>
          <p className="text-xs text-[#E8EFEA] dark:text-slate-300 max-w-xl">
            Administración de peticiones de oración, solicitudes de cursos bíblicos y repositorio de recursos R2.
          </p>
        </div>
      </div>

      {/* Repositorio de Archivos */}
      <div className="bg-[#FAF8F3] dark:bg-slate-900 p-6 rounded-3xl border border-[#E2DEC9] dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E4D5] dark:border-slate-800 pb-4">
          <h3 className="font-bold text-[#2D3831] dark:text-emerald-100 text-base flex items-center gap-2">
            <FolderArchive className="w-5 h-5 text-[#7C9885]" /> Repositorio de Archivos y Recursos (R2)
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
              className={`px-4 py-2.5 bg-[#7C9885] hover:bg-[#6B8774] text-white text-xs font-semibold rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shadow-xs ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Subiendo...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" /> Subir Nuevo Archivo
                </>
              )}
            </label>
          </div>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {files.length === 0 ? (
            <p className="text-xs text-[#66756C] dark:text-slate-400 py-4 text-center">
              No hay archivos alojados en la plataforma.
            </p>
          ) : (
            files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 bg-white dark:bg-slate-950 rounded-2xl text-xs border border-[#E2DEC9] dark:border-slate-800"
              >
                <div className="truncate max-w-md space-y-0.5">
                  <p className="font-semibold text-[#2D3831] dark:text-slate-200 truncate flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#7C9885]" /> {file.nombre}
                  </p>
                  <p className="text-[10px] text-[#66756C] dark:text-slate-400">
                    {(file.tamano / 1024 / 1024).toFixed(2)} MB | {file.tipo}
                  </p>
                </div>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-[#E8F0EA] dark:bg-slate-800 hover:bg-[#D8E6DB] text-[#546E5C] dark:text-emerald-300 text-[11px] font-semibold rounded-xl transition-colors flex items-center gap-1 shrink-0"
                >
                  <Download className="w-3.5 h-3.5" /> Ver / Descargar
                </a>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Grid de Oraciones y Cursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Moderación de Oraciones */}
        <div className="bg-[#FAF8F3] dark:bg-slate-900 p-6 rounded-3xl border border-[#E2DEC9] dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-[#2D3831] dark:text-emerald-100 text-base flex items-center gap-2 border-b border-[#E8E4D5] dark:border-slate-800 pb-3">
            <Heart className="w-5 h-5 text-[#E08A72]" /> Moderación de Oraciones
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {prayers.length === 0 ? (
              <p className="text-xs text-[#66756C] dark:text-slate-400 py-4 text-center">
                No hay oraciones registradas.
              </p>
            ) : (
              prayers.map((p) => (
                <div 
                  key={p.id} 
                  className="p-4 bg-white dark:bg-slate-950 rounded-2xl text-xs space-y-2 border border-[#E2DEC9] dark:border-slate-800"
                >
                  <div className="flex justify-between font-semibold text-[#2D3831] dark:text-slate-200">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#7C9885]" /> {p.nombre} {p.isPrivate && '(Privado)'}
                    </span>
                    <span 
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        p.status === 'Respondida' 
                          ? 'bg-[#E8F0EA] text-[#546E5C] dark:bg-emerald-950/40 dark:text-emerald-300' 
                          : 'bg-[#F8F5EC] text-[#E08A72] dark:bg-amber-950/40 dark:text-amber-400'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <p className="text-[#526157] dark:text-slate-300 leading-relaxed">{p.request}</p>
                  {p.status !== 'Respondida' && (
                    <button
                      onClick={() => handleMarkAsAnswered(p.id)}
                      className="px-3 py-1.5 bg-[#7C9885] hover:bg-[#6B8774] text-white font-semibold rounded-xl text-[10px] cursor-pointer transition-all flex items-center gap-1 mt-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Marcar Respondida
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Solicitudes de Cursos Bíblicos */}
        <div className="bg-[#FAF8F3] dark:bg-slate-900 p-6 rounded-3xl border border-[#E2DEC9] dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-[#2D3831] dark:text-emerald-100 text-base flex items-center gap-2 border-b border-[#E8E4D5] dark:border-slate-800 pb-3">
            <BookOpen className="w-5 h-5 text-[#7C9885]" /> Solicitudes de Cursos Bíblicos
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {courses.length === 0 ? (
              <p className="text-xs text-[#66756C] dark:text-slate-400 py-4 text-center">
                No hay solicitudes registradas.
              </p>
            ) : (
              courses.map((c) => (
                <div 
                  key={c.id} 
                  className="p-4 bg-white dark:bg-slate-950 rounded-2xl text-xs space-y-1.5 border border-[#E2DEC9] dark:border-slate-800"
                >
                  <p className="font-bold text-[#7C9885] dark:text-emerald-400">{c.curso}</p>
                  <p className="font-semibold text-[#2D3831] dark:text-slate-200 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#66756C]" /> {c.nombre}
                  </p>
                  <p className="text-[#526157] dark:text-slate-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#66756C]" /> WhatsApp: {c.telefono}
                  </p>
                  <p className="text-[#526157] dark:text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#66756C]" /> {c.direccion || 'Sin dirección'} ({c.modalidad})
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}