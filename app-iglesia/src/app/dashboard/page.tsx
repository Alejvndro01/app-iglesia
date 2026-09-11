'use client';

import { useState, useEffect } from 'react';
import { Upload, FileText, Download, Loader2, FolderOpen } from 'lucide-react';

interface Archivo {
  id: string;
  titulo: string;
  path: string;
  mimeType: string;
  tamano: number;
  createdAt: string;
  usuario?: { name: string | null };
}

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [archivos, setArchivos] = useState<Archivo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchArchivos = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/archivos');
      if (res.ok) {
        const data = await res.json();
        setArchivos(data.archivos || []);
      }
    } catch (err) {
      console.error('Error al cargar archivos', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchArchivos(); }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError('');

    try {
      // Step 1: Get presigned URL
      const presignedRes = await fetch('/api/archivos/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, fileType: file.type }),
      });
      if (!presignedRes.ok) throw new Error('Error al preparar la subida');
      const { uploadUrl, publicUrl } = await presignedRes.json();

      // Step 2: Upload file to R2
      await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });

      // Step 3: Save metadata
      await fetch('/api/archivos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: title || file.name,
          path: publicUrl,
          mimeType: file.type,
          tamano: file.size,
        }),
      });

      setFile(null);
      setTitle('');
      await fetchArchivos();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setUploading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[#2D3831] dark:text-emerald-100">Panel de Control</h1>
          <p className="text-sm text-[#66756C] dark:text-slate-400">Gestión de documentos y archivos de la iglesia.</p>
        </div>

        {/* Upload Form */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[#E2DEC9] dark:border-slate-700 p-6 space-y-4">
          <h3 className="font-bold text-[#2D3831] dark:text-slate-100 flex items-center gap-2">
            <Upload className="w-4 h-4 text-[#7C9885]" /> Subir Nuevo Archivo
          </h3>
          {error && <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">{error}</p>}
          <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-3">
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="flex-1 text-sm" required />
            <input type="text" placeholder="Título (opcional)" value={title} onChange={(e) => setTitle(e.target.value)} className="px-4 py-2 rounded-xl border border-[#DCD7C5] dark:border-slate-600 text-sm bg-white dark:bg-slate-900 dark:text-slate-100" />
            <button type="submit" disabled={uploading || !file} className="px-5 py-2 bg-[#7C9885] hover:bg-[#6B8774] text-white text-sm font-semibold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2">
              {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Subiendo...</> : 'Subir'}
            </button>
          </form>
        </div>

        {/* Files List */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-[#E2DEC9] dark:border-slate-700 p-6">
          <h3 className="font-bold text-[#2D3831] dark:text-slate-100 flex items-center gap-2 mb-4">
            <FolderOpen className="w-4 h-4 text-[#7C9885]" /> Archivos Subidos
          </h3>
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-[#7C9885]" /></div>
          ) : archivos.length === 0 ? (
            <p className="text-sm text-[#66756C] dark:text-slate-400 text-center py-8">No hay archivos registrados.</p>
          ) : (
            <div className="divide-y divide-[#E8E4D5] dark:divide-slate-700">
              {archivos.map((arc) => (
                <div key={arc.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-5 h-5 text-[#7C9885] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#2D3831] dark:text-slate-100 truncate">{arc.titulo}</p>
                      <p className="text-xs text-[#66756C] dark:text-slate-400">
                        {formatSize(arc.tamano)} · {new Date(arc.createdAt).toLocaleDateString('es-CL')}
                      </p>
                    </div>
                  </div>
                  <a href={arc.path} target="_blank" rel="noopener noreferrer" className="p-2 text-[#7C9885] hover:bg-[#E8F0EA] dark:hover:bg-slate-700 rounded-xl transition-colors">
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
