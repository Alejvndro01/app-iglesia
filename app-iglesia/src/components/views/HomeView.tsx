'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { Testimonio, Material } from '@/types';
import { 
  BookOpen, 
  Music, 
  Calendar, 
  Heart, 
  Upload, 
  Search, 
  Play, 
  Download, 
  Sparkles, 
  Send, 
  X, 
  Clock,
  HeartHandshake
} from 'lucide-react';

interface HomeViewProps {
  navigateTo: (page: string) => void;
  showToast: (msg: string) => void;
  setSelectedSermon?: (sermon: unknown) => void;
}

export function HomeView({ navigateTo, showToast, setSelectedSermon }: HomeViewProps) {
  const [testimonies, setTestimonies] = useState<Testimonio[]>([]);
  const [testimonyTitle, setTestimonyTitle] = useState('');
  const [testimonyAuthor, setTestimonyAuthor] = useState('');
  const [testimonyContent, setTestimonyContent] = useState('');
  const [loadingTestimony, setLoadingTestimony] = useState(false);

  const [prayerName, setPrayerName] = useState('');
  const [prayerRequest, setPrayerRequest] = useState('');
  const [prayerPrivate, setPrayerPrivate] = useState(false);
  const [loadingPrayer, setLoadingPrayer] = useState(false);

  const [materials, setMaterials] = useState<Material[]>([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [materialSearch, setMaterialSearch] = useState('');

  const getExtensionLabel = (mimeType: string, path: string) => {
    if (mimeType?.includes('pdf') || path?.endsWith('.pdf')) return 'PDF';
    if (mimeType?.includes('word') || mimeType?.includes('officedocument') || path?.endsWith('.docx')) return 'DOCX';
    if (mimeType?.includes('presentation') || path?.endsWith('.pptx')) return 'PPTX';
    if (mimeType?.includes('plain') || path?.endsWith('.txt')) return 'TXT';
    if (mimeType?.includes('mpeg') || mimeType?.includes('mp3') || path?.endsWith('.mp3')) return 'MP3';
    return 'DOC';
  };

  const fetchTestimonies = async () => {
    try {
      const data = await apiClient.getTestimonios();
      const response = data as unknown as Record<string, unknown>;
      if (Array.isArray(data)) {
        setTestimonies(data);
      } else if (Array.isArray(response?.testimonios)) {
        setTestimonies(response.testimonios as Testimonio[]);
      } else {
        setTestimonies([]);
      }
    } catch (err) {
      console.error('Error cargando testimonios:', err);
    }
  };

  const fetchMaterials = async () => {
    try {
      const data = await apiClient.getMateriales();
      const response = data as unknown as Record<string, unknown>;
      if (Array.isArray(data)) {
        setMaterials(data);
      } else if (Array.isArray(response?.archivos)) {
        setMaterials(response.archivos as Material[]);
      } else {
        setMaterials([]);
      }
    } catch (err) {
      console.error('Error cargando archivos:', err);
    }
  };

  useEffect(() => {
    fetchTestimonies();
    fetchMaterials();
  }, []);

  const handlePrayerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prayerRequest.trim()) return;

    setLoadingPrayer(true);
    try {
      await apiClient.createOracion({
        nombre: prayerName.trim() || 'Anónimo',
        peticion: prayerRequest,
        esPrivado: prayerPrivate,
      });

      setPrayerName('');
      setPrayerRequest('');
      setPrayerPrivate(false);
      showToast('¡Pedido de oración guardado!');
    } catch {
      showToast('Error al enviar pedido de oración');
    } finally {
      setLoadingPrayer(false);
    }
  };

  const handleTestimonySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonyContent.trim() || !testimonyTitle.trim()) return;

    setLoadingTestimony(true);
    try {
      await apiClient.createTestimonio({
        autor: testimonyAuthor.trim() || 'Hermano de Iglesia',
        titulo: testimonyTitle.trim(),
        contenido: testimonyContent.trim(),
      });

      setTestimonyTitle('');
      setTestimonyAuthor('');
      setTestimonyContent('');
      showToast('¡Testimonio publicado con éxito!');
      await fetchTestimonies();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al publicar testimonio';
      showToast(msg);
    } finally {
      setLoadingTestimony(false);
    }
  };

  const handleLikeTestimonio = async (id: string) => {
    try {
      setTestimonies((prev) =>
        prev.map((t) => (t.id === id ? { ...t, likes: (t.likes || 0) + 1 } : t))
      );
      showToast('¡Amén!');
      await apiClient.likeTestimonio(id);
    } catch (err) {
      console.error('Error enviando Amén:', err);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      showToast('Selecciona un archivo');
      return;
    }

    setLoadingUpload(true);
    try {
      const presignedRes = await fetch('/api/archivos/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: selectedFile.name,
          fileType: selectedFile.type || 'application/octet-stream',
        }),
      });

      if (!presignedRes.ok) {
        const errData = await presignedRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Error obteniendo permiso de subida');
      }

      const { uploadUrl, publicUrl } = await presignedRes.json();

      const uploadToR2Res = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': selectedFile.type || 'application/octet-stream',
        },
        body: selectedFile,
      });

      if (!uploadToR2Res.ok) {
        throw new Error('Error al enviar archivo a Cloudflare R2');
      }

      const dbRes = await fetch('/api/archivos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: uploadTitle || selectedFile.name,
          path: publicUrl,
          mimeType: selectedFile.type || 'application/octet-stream',
          tamano: selectedFile.size,
        }),
      });

      if (!dbRes.ok) throw new Error('Error al registrar archivo en la base de datos');

      showToast('¡Material subido con éxito!');
      setUploadModalOpen(false);
      setUploadTitle('');
      setSelectedFile(null);
      await fetchMaterials();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al subir archivo';
      showToast(msg);
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleDownload = (m: Material) => {
    try {
      window.open(m.path, '_blank');
    } catch (error) {
      console.error('Error al descargar:', error);
      showToast('Error al abrir la descarga');
    }
  };

  const sermons = [
    {
      id: '1',
      title: 'Firmeza y Fe en las Promesas de Dios',
      speaker: 'Pr. Alejandro Silva',
      category: 'Sermón Sabático',
      thumbnail: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: '2',
      title: 'El Poder de la Oración en Familia',
      speaker: 'Pr. Marcos Rodríguez',
      category: 'Culto de Oración',
      thumbnail: 'https://images.unsplash.com/photo-1499209974431-9dac3ada00d7?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: '3',
      title: 'Jesús: Nuestra Esperanza Viva',
      speaker: 'Hno. Claudio Morales',
      category: 'Jóvenes JA',
      thumbnail: 'https://images.unsplash.com/photo-1509021436468-d51039746b20?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const filteredMaterials = materials.filter((item) =>
    item.titulo?.toLowerCase().includes(materialSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col justify-between h-full py-2 text-minimal-text space-y-10 font-sans">
      
      {/* HERO PRINCIPAL - EDITORIAL MINIMAL */}
      <section className="text-center space-y-3 mt-2">
        <span className="text-[10px] tracking-widest uppercase text-white/70 font-medium block">
          Bulnes 450, Hualqui
        </span>
        <h1 className="text-5xl font-extrabold tracking-tight text-white leading-none">
          Creer.
        </h1>
        <p className="text-xs text-white/80 max-w-xs mx-auto leading-relaxed font-light px-2">
          Un espacio simple y tranquilo para la reflexión diaria, el estudio de la palabra y la vida en comunidad.
        </p>

        {/* ACCIONES RÁPIDAS HERO */}
        <div className="flex justify-center items-center gap-2 pt-2">
          <button
            onClick={() => navigateTo('estudios-biblicos')}
            className="px-4 py-2 bg-white text-minimal-dark font-semibold text-xs rounded-full shadow-xs transition-transform active:scale-95"
          >
            Estudio Bíblico
          </button>
          <button
            onClick={() => navigateTo('leccion')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-full border border-white/10 transition-transform active:scale-95 flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Lección</span>
          </button>
        </div>
      </section>

      {/* MUESTRA DE PALETA MINIMAL */}
      <div className="flex justify-center items-center gap-1.5 py-1">
        <span className="w-6 h-1.5 rounded-full bg-[#537180]" />
        <span className="w-6 h-1.5 rounded-full bg-[#7091A4]" />
        <span className="w-6 h-1.5 rounded-full bg-[#BDD1DE]" />
        <span className="w-6 h-1.5 rounded-full bg-[#C8D3DB]" />
      </div>

      {/* HORARIOS DE CULTO - CÁPSULA LIMPIA */}
      <section className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-widest uppercase text-white/70 font-semibold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-white/80" />
            Reuniones
          </span>
          <span className="text-[10px] text-white/50">Hualqui</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
            <span className="block font-bold text-white text-xs">Sábados</span>
            <span className="text-[10px] text-white/70">10:00 S.S.</span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
            <span className="block font-bold text-white text-xs">Sábados</span>
            <span className="text-[10px] text-white/70">11:30 Culto</span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
            <span className="block font-bold text-white text-xs">Sábados</span>
            <span className="text-[10px] text-white/70">18:00 JA</span>
          </div>
          <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
            <span className="block font-bold text-white text-xs">Miércoles</span>
            <span className="text-[10px] text-white/70">19:00 Oración</span>
          </div>
        </div>
      </section>

      {/* PREDICACIONES / SERMONES */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-widest uppercase text-white/70 font-semibold">
            Sermones
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {sermons.map((s) => (
            <div
              key={s.id}
              onClick={() => setSelectedSermon && setSelectedSermon(s)}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl p-3.5 border border-white/10 transition-all cursor-pointer group active:scale-[0.98] space-y-2"
            >
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black/20">
                <img
                  src={s.thumbnail}
                  alt={s.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-white text-minimal-dark flex items-center justify-center shadow-xs">
                    <Play className="w-3.5 h-3.5 fill-minimal-dark ml-0.5" />
                  </div>
                </div>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-white/60 font-medium block">
                  {s.category}
                </span>
                <h4 className="text-xs font-semibold text-white truncate mt-0.5">{s.title}</h4>
                <p className="text-[10px] text-white/70 mt-0.5">{s.speaker}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RECURSOS / DESCARGAS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-widest uppercase text-white/70 font-semibold">
            Recursos
          </span>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center gap-1 text-[11px] text-white/80 hover:text-white transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Subir</span>
          </button>
        </div>

        {/* Buscador minimalista */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-white/50" />
          <input
            type="text"
            placeholder="Buscar recurso..."
            value={materialSearch}
            onChange={(e) => setMaterialSearch(e.target.value)}
            className="w-full bg-white/10 text-xs text-white placeholder-white/50 pl-8 pr-4 py-2 rounded-xl border border-white/10 outline-none focus:border-white/30 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {filteredMaterials.length === 0 ? (
            <p className="text-xs text-white/50 col-span-3 text-center py-4">No hay archivos disponibles.</p>
          ) : (
            filteredMaterials.map((m) => (
              <div
                key={m.id}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <span className="text-[9px] uppercase font-bold text-white/60 bg-white/10 px-1.5 py-0.5 rounded">
                    {getExtensionLabel(m.mimeType, m.path)}
                  </span>
                  <h4 className="text-xs font-medium text-white truncate mt-1">{m.titulo}</h4>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownload(m)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
                  title="Descargar"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* MURO DE TESTIMONIOS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-widest uppercase text-white/70 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-white/80" />
            Testimonios
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {testimonies.length === 0 ? (
            <p className="text-xs text-white/50 col-span-3 text-center py-4">
              Aún no hay testimonios. ¡Sé el primero en compartir!
            </p>
          ) : (
            testimonies.map((t) => (
              <div
                key={t.id}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 flex flex-col justify-between space-y-2"
              >
                <div>
                  <h4 className="text-xs font-semibold text-white">
                    {t.titulo || 'Agradecimiento'}
                  </h4>
                  <p className="text-[11px] text-white/80 mt-1 leading-relaxed line-clamp-3 font-light">
                    "{t.contenido || 'Sin contenido'}"
                  </p>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[10px] text-white/60">
                  <span>{t.autor || 'Anónimo'}</span>
                  <button
                    onClick={() => handleLikeTestimonio(t.id)}
                    className="flex items-center gap-1 text-white/80 hover:text-white transition-colors"
                  >
                    <Heart className="w-3 h-3 fill-minimal-accent text-minimal-accent" />
                    <span>{t.likes || 0}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Formulario Testimonio */}
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-3">
          <span className="text-xs font-medium text-white block">Compartir Testimonio</span>
          <form onSubmit={handleTestimonySubmit} className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Tu Nombre"
                value={testimonyAuthor}
                onChange={(e) => setTestimonyAuthor(e.target.value)}
                className="bg-white/10 text-xs p-2.5 rounded-lg border border-white/10 text-white placeholder-white/40 outline-none"
              />
              <input
                type="text"
                required
                placeholder="Título *"
                value={testimonyTitle}
                onChange={(e) => setTestimonyTitle(e.target.value)}
                className="bg-white/10 text-xs p-2.5 rounded-lg border border-white/10 text-white placeholder-white/40 outline-none"
              />
            </div>
            <textarea
              rows={2}
              required
              placeholder="Escribe tu testimonio... *"
              value={testimonyContent}
              onChange={(e) => setTestimonyContent(e.target.value)}
              className="w-full bg-white/10 text-xs p-2.5 rounded-lg border border-white/10 text-white placeholder-white/40 outline-none"
            ></textarea>
            <button
              type="submit"
              disabled={loadingTestimony}
              className="w-full py-2 bg-white text-minimal-dark font-semibold text-xs rounded-lg transition-transform active:scale-98 disabled:opacity-50"
            >
              {loadingTestimony ? 'Publicando...' : 'Publicar Testimonio'}
            </button>
          </form>
        </div>
      </section>

      {/* PEDIDO DE ORACIÓN */}
      <section className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="text-center space-y-1">
          <HeartHandshake className="w-5 h-5 mx-auto text-white/80" />
          <h3 className="text-sm font-bold text-white">¿Podemos Orar por Ti?</h3>
          <p className="text-[11px] text-white/70 font-light">
            Escribe tu motivo de oración para nuestra lista intercesora.
          </p>
        </div>

        <form onSubmit={handlePrayerSubmit} className="space-y-2.5">
          <input
            type="text"
            placeholder="Tu nombre (opcional)"
            value={prayerName}
            onChange={(e) => setPrayerName(e.target.value)}
            className="w-full bg-white/10 text-xs p-2.5 rounded-xl border border-white/10 text-white placeholder-white/40 outline-none"
          />
          <textarea
            rows={2}
            required
            placeholder="Escribe aquí tu pedido de oración... *"
            value={prayerRequest}
            onChange={(e) => setPrayerRequest(e.target.value)}
            className="w-full bg-white/10 text-xs p-2.5 rounded-xl border border-white/10 text-white placeholder-white/40 outline-none"
          ></textarea>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="priv"
              checked={prayerPrivate}
              onChange={(e) => setPrayerPrivate(e.target.checked)}
              className="rounded bg-white/10 border-white/20 text-minimal-accent focus:ring-0"
            />
            <label htmlFor="priv" className="text-[11px] text-white/70 cursor-pointer">
              Mantener en privado
            </label>
          </div>
          <button
            type="submit"
            disabled={loadingPrayer}
            className="w-full py-2.5 bg-minimal-accent hover:bg-minimal-accent/90 text-white font-medium text-xs rounded-xl transition-transform active:scale-98 disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{loadingPrayer ? 'Guardando...' : 'Enviar Pedido de Oración'}</span>
          </button>
        </form>
      </section>

      {/* MODAL DE SUBIDA DE MATERIAL */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#A1B5C4] w-full max-w-sm rounded-2xl p-5 space-y-4 border border-white/20 shadow-2xl text-white">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <h3 className="font-semibold text-xs uppercase tracking-wider">Subir Recurso</h3>
              <button onClick={() => setUploadModalOpen(false)} className="text-white/70 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] text-white/80 mb-1">Título del Recurso</label>
                <input
                  type="text"
                  placeholder="Ej. Guía de Escuela Sabática"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full bg-white/10 text-xs p-2.5 rounded-lg border border-white/10 text-white placeholder-white/40 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-white/80 mb-1">Archivo (PDF, PPTX, MP3)</label>
                <input
                  type="file"
                  required
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-white/70 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-white/20 file:text-white hover:file:bg-white/30"
                />
              </div>

              <button
                type="submit"
                disabled={loadingUpload}
                className="w-full py-2.5 bg-white text-minimal-dark font-semibold text-xs rounded-xl shadow-xs disabled:opacity-50 transition-transform active:scale-98"
              >
                {loadingUpload ? 'Subiendo archivo...' : 'Publicar Material'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}