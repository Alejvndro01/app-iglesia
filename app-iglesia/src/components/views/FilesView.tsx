'use client';

import React, { useState, useEffect, useRef, ChangeEvent, DragEvent } from 'react';
import { 
  UploadCloud, 
  FileText, 
  File as FileIcon, 
  FileVideo, 
  FileAudio, 
  FileImage,
  Download, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X, 
  FolderOpen,
  User,
  Calendar,
  Play
} from 'lucide-react';

interface ArchivoItem {
  id: string;
  titulo: string;
  path: string;
  mimeType: string;
  tamano: number;
  createdAt: string;
  usuario?: {
    name: string | null;
  };
}

interface UploadResponse {
  uploadUrl: string;
  publicUrl: string;
  key: string;
}

export function FilesView() {
  const [archivos, setArchivos] = useState<ArchivoItem[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  // Formulario y subida
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Visor / Preview Modal
  const [previewFile, setPreviewFile] = useState<ArchivoItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxSizeBytes = 100 * 1024 * 1024; // 100MB

  const fetchArchivos = async () => {
    try {
      setLoadingList(true);
      const res = await fetch('/api/archivos');
      const data = await res.json();
      if (res.ok) {
        setArchivos(data.archivos || []);
      }
    } catch (err) {
      console.error('[FILES_FETCH_ERROR]', err);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchArchivos();
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('video/')) return <FileVideo className="w-5 h-5 text-blue-500" />;
    if (mimeType.startsWith('audio/')) return <FileAudio className="w-5 h-5 text-amber-500" />;
    if (mimeType.startsWith('image/')) return <FileImage className="w-5 h-5 text-emerald-500" />;
    if (mimeType.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    return <FileIcon className="w-5 h-5 text-[#7C9885]" />;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > maxSizeBytes) {
        setError(`El archivo excede el límite de ${maxSizeBytes / (1024 * 1024)} MB.`);
        return;
      }
      setError(null);
      setSuccessMessage(null);
      setFile(selected);
      if (!title) setTitle(selected.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const resetForm = () => {
    setFile(null);
    setTitle('');
    setError(null);
    setUploadProgress(0);
    setProgressStatus('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Subida con feedback progresivo
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim()) {
      setError('Debes ingresar un título y adjuntar un archivo.');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccessMessage(null);
    setUploadProgress(0);

    try {
      // 1. Obtener URL presignada
      setProgressStatus('Solicitando autorización segura...');
      const presignedRes = await fetch('/api/archivos/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type || 'application/octet-stream',
        }),
      });

      if (!presignedRes.ok) throw new Error('No se pudo generar el enlace de subida presignado.');
      const { uploadUrl, publicUrl }: UploadResponse = await presignedRes.json();

      // 2. Subida directa con tracking XMLHttpRequest
      setProgressStatus('Transfiriendo archivo al storage R2...');
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', uploadUrl, true);
        xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(percent);
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Fallo de subida R2 con código ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error('Error de red al transferir archivo a R2.'));
        xhr.send(file);
      });

      // 3. Persistir en la base de datos
      setProgressStatus('Registrando en base de datos...');
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

      if (!dbRes.ok) throw new Error('Error al registrar metadatos en la base de datos.');

      setSuccessMessage(`¡"${title.trim()}" se subió y registró correctamente!`);
      resetForm();
      fetchArchivos();
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Error inesperado durante la operación.');
    } finally {
      setUploading(false);
      setProgressStatus('');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 antialiased text-[#2D3831] dark:text-slate-200">
      
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E2DEC9] dark:border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#E8F0EA] dark:bg-slate-800 text-[#7C9885] dark:text-emerald-400">
              <FolderOpen className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#7C9885] dark:text-emerald-400">
              Gestor Documental
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D3831] dark:text-emerald-100">
            Archivos & Multimedia
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Panel de Subida (4 Cols) */}
        <div className="lg:col-span-4 bg-[#FAF8F3] dark:bg-slate-900/70 border border-[#E2DEC9] dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#66756C] dark:text-slate-400">
            Cargar Recurso
          </h2>

          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-[#526157] dark:text-slate-300">
                Título Descriptivo
              </label>
              <input
                type="text"
                placeholder="Nombre del documento, lección o audio..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={uploading}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-200 focus:outline-none focus:border-[#7C9885]"
              />
            </div>

            {/* Zona Dropzone */}
            {!file ? (
              <div
                onDragOver={(e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={(e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragOver(false); }}
                onDrop={(e: DragEvent<HTMLDivElement>) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  if (e.dataTransfer.files?.[0]) {
                    const dropped = e.dataTransfer.files[0];
                    setFile(dropped);
                    if (!title) setTitle(dropped.name.replace(/\.[^/.]+$/, ''));
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-[#7C9885] bg-[#E8F0EA]/50'
                    : 'border-[#DCD7C5] dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-[#7C9885]'
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
                  Selecciona o suelta tu archivo
                </p>
                <p className="text-[10px] text-[#66756C] dark:text-slate-400 mt-1">
                  Audio, Video, PDF o Imágenes (Máx. 100MB)
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-800 border border-[#DCD7C5] dark:border-slate-700 rounded-2xl">
                <div className="flex items-center gap-3 truncate">
                  <div className="p-2 rounded-xl bg-[#E8F0EA] dark:bg-slate-700">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="truncate text-left">
                    <p className="text-xs font-bold truncate text-[#2D3831] dark:text-slate-200">
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

            {/* Barra de Progreso */}
            {uploading && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-semibold text-[#7C9885] dark:text-emerald-400">
                  <span>{progressStatus}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-[#E8F0EA] dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#7C9885] dark:bg-emerald-500 h-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Alertas de Estado */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={uploading || !file || !title.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-[#7C9885] hover:bg-[#6B8774] disabled:opacity-40 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Procesando subida...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Subir al Servidor
                </>
              )}
            </button>
          </form>
        </div>

        {/* Lista y Visualizador (8 Cols) */}
        <div className="lg:col-span-8 bg-[#FAF8F3] dark:bg-slate-900/80 border border-[#E2DEC9] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-[#E2DEC9] dark:border-slate-800 pb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#66756C] dark:text-slate-400">
              Archivos Registrados ({archivos.length})
            </h2>
            <button
              onClick={fetchArchivos}
              disabled={loadingList}
              className="text-xs font-bold text-[#7C9885] hover:underline cursor-pointer"
            >
              Refrescar
            </button>
          </div>

          {loadingList ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-2 text-[#7C9885]">
              <Loader2 className="w-7 h-7 animate-spin" />
              <p className="text-xs font-semibold">Cargando repositorio...</p>
            </div>
          ) : archivos.length === 0 ? (
            <div className="py-16 text-center text-xs text-[#66756C] dark:text-slate-400">
              No hay archivos subidos todavía. Usa el panel izquierdo para comenzar.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {archivos.map((item) => (
                <div 
                  key={item.id} 
                  className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-[#E8E4D5] dark:border-slate-700 flex flex-col justify-between space-y-3 hover:border-[#7C9885] transition-all shadow-2xs"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-[#E8F0EA] dark:bg-slate-700/60 shrink-0">
                      {getFileIcon(item.mimeType)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#2D3831] dark:text-slate-200 truncate" title={item.titulo}>
                        {item.titulo}
                      </p>
                      <p className="text-[10px] text-[#66756C] dark:text-slate-400 mt-0.5">
                        {formatFileSize(item.tamano)} • {item.mimeType.split('/')[1]?.toUpperCase() || 'ARCHIVO'}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-[#66756C] dark:text-slate-400 mt-1">
                        {item.usuario?.name && (
                          <span className="flex items-center gap-1 truncate">
                            <User className="w-2.5 h-2.5" /> {item.usuario.name}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5" /> {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="pt-2 border-t border-[#E8E4D5] dark:border-slate-700/60 flex items-center justify-end gap-2">
                    {/* Botón Ver / Reproducir */}
                    <button
                      onClick={() => setPreviewFile(item)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#E8F0EA] dark:bg-slate-700 hover:bg-[#7C9885] hover:text-white text-[#526157] dark:text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {item.mimeType.startsWith('video/') || item.mimeType.startsWith('audio/') ? (
                        <>
                          <Play className="w-3 h-3" /> Reproducir
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3" /> Ver
                        </>
                      )}
                    </button>

                    {/* Descarga directa */}
                    <a
                      href={item.path}
                      download={item.titulo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg border border-[#DCD7C5] dark:border-slate-700 text-[#526157] dark:text-slate-300 hover:bg-[#E8F0EA] dark:hover:bg-slate-700 transition-colors"
                      title="Descargar archivo"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Modal Reproductor / Visor Dinámico */}
      {previewFile && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-[#FAF8F3] dark:bg-slate-900 border border-[#E2DEC9] dark:border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Header del Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E2DEC9] dark:border-slate-800">
              <div className="flex items-center gap-2 truncate pr-4">
                {getFileIcon(previewFile.mimeType)}
                <h3 className="font-serif font-bold text-sm sm:text-base text-[#2D3831] dark:text-emerald-100 truncate">
                  {previewFile.titulo}
                </h3>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-1.5 hover:bg-[#E8F0EA] dark:hover:bg-slate-800 rounded-xl text-[#526157] dark:text-slate-300 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido según MIME */}
            <div className="flex-1 overflow-auto my-4 flex items-center justify-center min-h-[300px]">
              {previewFile.mimeType.startsWith('video/') ? (
                <video 
                  src={previewFile.path} 
                  controls 
                  autoPlay 
                  className="max-h-[65vh] w-full rounded-2xl bg-black"
                />
              ) : previewFile.mimeType.startsWith('audio/') ? (
                <div className="w-full max-w-md p-6 bg-white dark:bg-slate-800 rounded-2xl border border-[#E8E4D5] dark:border-slate-700 flex flex-col items-center space-y-4">
                  <FileAudio className="w-16 h-16 text-[#7C9885] animate-pulse" />
                  <p className="text-xs font-bold">{previewFile.titulo}</p>
                  <audio 
                    src={previewFile.path} 
                    controls 
                    autoPlay 
                    className="w-full"
                  />
                </div>
              ) : previewFile.mimeType.startsWith('image/') ? (
                <img 
                  src={previewFile.path} 
                  alt={previewFile.titulo} 
                  className="max-h-[65vh] object-contain rounded-2xl"
                />
              ) : (
                <iframe 
                  src={previewFile.path} 
                  title={previewFile.titulo} 
                  className="w-full h-[65vh] rounded-2xl border border-[#E8E4D5] dark:border-slate-700 bg-white"
                />
              )}
            </div>

            {/* Footer Modal */}
            <div className="flex justify-end gap-2 pt-3 border-t border-[#E2DEC9] dark:border-slate-800">
              <a
                href={previewFile.path}
                download={previewFile.titulo}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#7C9885] hover:bg-[#6B8774] text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Descargar Archivo
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export { FilesView as FileUploader };