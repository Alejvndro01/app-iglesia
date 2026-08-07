'use client';

import { useState, useEffect } from 'react';

interface Archivo {
  id: string;
  nombre: string;
  path: string;
  mimeType: string;
  tamano: number;
  createdAt: string;
}

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [archivos, setArchivos] = useState<Archivo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const fetchArchivos = async () => {
    try {
      const res = await fetch('/api/archivos');
      if (res.ok) {
        const data = await res.json();
        setArchivos(data.archivos || []);
      }
    } catch (err) {
      console.error('Error al cargar lista de archivos', err);
    }
  };

  useEffect(() => {
    fetchArchivos();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/archivos', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al subir el archivo');
      }

      setFile(null);
      await fetchArchivos();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error desconocido');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Panel de Control - Archivos IASD</h1>
      <p>Gestión de documentos y archivos adjuntos.</p>

      <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>Subir Nuevo Archivo</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleUpload} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
          <button type="submit" disabled={uploading || !file} style={{ padding: '8px 16px', cursor: 'pointer' }}>
            {uploading ? 'Subiendo...' : 'Subir Archivo'}
          </button>
        </form>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h3>Archivos Subidos</h3>
        {archivos.length === 0 ? (
          <p style={{ color: '#666' }}>No hay archivos registrados.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #ccc' }}>
                <th style={{ padding: '8px' }}>Nombre</th>
                <th style={{ padding: '8px' }}>Tamaño</th>
                <th style={{ padding: '8px' }}>Fecha</th>
                <th style={{ padding: '8px' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {archivos.map((arc) => (
                <tr key={arc.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}>{arc.nombre}</td>
                  <td style={{ padding: '8px' }}>{(arc.tamano / 1024).toFixed(1)} KB</td>
                  <td style={{ padding: '8px' }}>{new Date(arc.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '8px' }}>
                    <a href={arc.path} target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3' }}>
                      Ver/Descargar
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}