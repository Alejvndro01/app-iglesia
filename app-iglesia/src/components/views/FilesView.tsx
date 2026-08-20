'use client';

import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { 
  UploadCloud, 
  File, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X, 
  FileUp 
} from 'lucide-react';

interface UploadResponse {
  uploadUrl: string;
  publicUrl: string;
  key: string;
}

interface FilesViewProps {
  onSuccess?: () => void;
  maxSizeBytes?: number; // Por defecto 50MB
}

export function FilesView({ 
  onSuccess, 
  maxSizeBytes = 50 * 1024 * 1024 
}: FilesViewProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    if (selectedFile.size > maxSizeBytes) {
      setError(`El archivo supera el límite de ${Math.round(maxSizeBytes / (1024 * 1024))} MB.`);
      return;
    }
    setFile(selectedFile);
    if (!title.trim()) {
      // Asignar el nombre base del archivo sin extensión como título inicial
      const defaultTitle = selectedFile.name.replace(/\.[^/.]+$/, '');
      setTitle(defaultTitle);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const resetForm = () => {
    setFile(null);
    setTitle('');
    setError(null);
    setProgressStatus('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim()) {
      setError('Debes especificar un título y seleccionar un archivo.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // 1. Obtener URL presignada desde R2
      setProgressStatus('Solicitando autorización de subida...');
      const presignedRes = await fetch('/api/archivos/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type || 'application/octet-stream',
        }),
      });

      if (!presignedRes.ok) {
        throw new Error('Error al obtener la URL de subida.');
      }

      const { uploadUrl, publicUrl }: UploadResponse = await presignedRes.json();

      // 2. Subida directa a Cloudflare R2
      setProgressStatus('Subiendo archivo al almacenamiento...');
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error('Error al transferir el archivo a R2.');
      }

      // 3. Registrar metadatos en base de datos vía Prisma API
      setProgressStatus('Guardando metadatos...');
      const dbRes = await fetch('/api/archivos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: title.trim(),
          path: publicUrl,
          mimeType: file.type || 'application/octet-stream',
          tamano: file.size,
        }),
      });

      if (!dbRes.ok) {
        throw new Error('Error al guardar el registro en la base de datos.');
      }

      resetForm();
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      console.error('[UPLOAD_ERROR]', err);
      setError(err instanceof Error ? err.message : 'Error inesperado durante la subida.');
    } finally {
      setUploading(false);
      setProgressStatus('');
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className="w-full max-w-xl mx-auto my-8 bg-[#FAF8F3] dark:bg-slate-900 border border-[#E2DEC9] dark:border-slate-800 rounded-3xl p-6 shadow-xs text-[#2D3831] dark:text-slate-200">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-4 border-b border-[#E2DEC9] dark:border-slate-800">
        <span className="p-2 rounded-xl bg-[#E8F0EA] dark:bg-slate-800 text-[#7C9885] dark:text-emerald-400">
          <FileUp className="w-5 h-5" />
        </span>
        <div>
          <h3 className="font-serif font-bold text-lg text-[#2D3831] dark:text-emerald-100">
            Subir Nuevo Recurso
          </h3>
          <p className="text-xs text-[#66756C] dark:text-slate-400">
            El archivo se alojará en el almacenamiento seguro R2.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {/* Input Título */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#66756C] dark:text-slate-400 mb-1.5">
            Título del Archivo
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={uploading}
            placeholder="Ej. Guía de Estudio - Capítulo 1"
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-200 focus:outline-none focus:border-[#7C9885] disabled:opacity-50"
          />
        </div>

        {/* Zona Drag & Drop */}
        {!file ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              isDragOver
                ? 'border-[#7C9885] bg-[#E8F0EA]/50 dark:bg-slate-800/80'
                : 'border-[#DCD7C5] dark:border-slate-700 bg-white dark:bg-slate-800/40 hover:border-[#7C9885]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
            <UploadCloud className="w-8 h-8 mx-auto text-[#7C9885] mb-2" />
            <p className="text-xs font-bold text-[#2D3831] dark:text-slate-200">
              Haz clic para seleccionar o arrastra un archivo aquí
            </p>
            <p className="text-[10px] text-[#66756C] dark:text-slate-400 mt-1">
              Tamaño máximo permitido: {Math.round(maxSizeBytes / (1024 * 1024))} MB
            </p>
          </div>
        ) : (
          /* Preview del archivo */
          <div className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-800 border border-[#DCD7C5] dark:border-slate-700 rounded-2xl">
            <div className="flex items-center gap-3 truncate">
              <span className="p-2 rounded-lg bg-[#E8F0EA] dark:bg-slate-700 text-[#7C9885] dark:text-emerald-400">
                <File className="w-4 h-4 shrink-0" />
              </span>
              <div className="truncate text-left">
                <p className="text-xs font-bold text-[#2D3831] dark:text-slate-200 truncate">
                  {file.name}
                </p>
                <p className="text-[10px] text-[#66756C] dark:text-slate-400">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            {!uploading && (
              <button
                type="button"
                onClick={resetForm}
                className="p-1 text-[#66756C] hover:text-red-500 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Progreso */}
        {uploading && (
          <div className="flex items-center gap-2 text-xs font-semibold text-[#7C9885] dark:text-emerald-400 py-1">
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>{progressStatus}</span>
          </div>
        )}

        {/* Botón Guardar */}
        <button
          type="submit"
          disabled={uploading || !file || !title.trim()}
          className="w-full py-2.5 px-4 rounded-xl bg-[#7C9885] hover:bg-[#6B8774] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          {uploading ? (
            'Procesando...'
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" /> Guardar Archivo
            </>
          )}
        </button>
      </form>
    </div>
  );
}

// Alias de retrocompatibilidad
export { FilesView as FileUploader };