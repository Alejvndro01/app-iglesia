'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { Testimonio, Material } from '@/types';
import { 
  BookOpen, 
  Church, 
  Flame, 
  Heart, 
  Upload, 
  Play, 
  Download, 
  Search, 
  X, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Clock, 
  Send, 
  FileText,
  MessageSquare
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
    return 'DOCUMENTO';
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
    <div className="space-y-16 pb-12 antialiased">
      {/* Hero Section */}
      <section className="bg-[#E8F0EA] dark:bg-slate-900 pt-12 pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="w-full md:w-1/2 text-center md:text-left space-y-5">
            <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-slate-800/80 px-4 py-1.5 rounded-full text-xs font-bold text-[#546E5C] dark:text-emerald-300 shadow-xs border border-[#C5D8CC] dark:border-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-[#7C9885] animate-pulse"></span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#7C9885]" /> La Concepción #450, Hualqui
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-[#2D3831] dark:text-slate-100 leading-tight">
              Un lugar para <br />
              <span className="text-[#7C9885] dark:text-emerald-400">Creer, Pertenecer</span> <br />
              y Servir.
            </h2>
            <p className="text-xs sm:text-sm text-[#526157] dark:text-slate-300 max-w-xl leading-relaxed">
              Bienvenido a la casa de Dios. Te invitamos a compartir con nosotros el estudio de la Biblia, la oración y la comunión fraternal en nuestra comuna.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <button
                onClick={() => navigateTo('estudios-biblicos')}
                className="px-6 py-3.5 bg-[#7C9885] hover:bg-[#6B8774] text-white font-semibold rounded-2xl text-xs shadow-xs cursor-pointer transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" /> Solicitar Estudio Bíblico
              </button>
              <button
                onClick={() => navigateTo('leccion')}
                className="px-6 py-3.5 bg-[#FAF8F3] dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 text-[#2D3831] dark:text-emerald-300 font-semibold rounded-2xl text-xs shadow-xs border border-[#E2DEC9] dark:border-slate-700 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Calendar className="w-4 h-4 text-[#7C9885]" /> Lección Escuela Sabática
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md h-72 sm:h-88 rounded-3xl overflow-hidden shadow-md border-4 border-[#FAF8F3] dark:border-slate-800 group">
              <img
                src="/landscape.jpg"
                alt="IASD Hualqui"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D3831]/70 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <span className="bg-[#7C9885] text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                    La Concepción 450, Hualqui
                  </span>
                  <h3 className="text-base font-bold mt-2">Templo Central IASD Hualqui</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Horarios de Culto */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-1">
          <span className="bg-[#E8F0EA] text-[#546E5C] dark:bg-emerald-950/50 dark:text-emerald-300 text-[11px] font-bold px-3 py-1 rounded-full border border-[#7C9885]/30">
            Horarios de Culto
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2D3831] dark:text-emerald-100 pt-1">
            Nuestras Reuniones Semanales
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#FAF8F3] dark:bg-slate-900 p-6 rounded-3xl border border-[#E2DEC9] dark:border-slate-800 space-y-2">
            <BookOpen className="w-7 h-7 text-[#7C9885]" />
            <span className="text-[10px] font-bold text-[#7C9885] uppercase block">Sábados</span>
            <h4 className="text-base font-bold text-[#2D3831] dark:text-emerald-100">Escuela Sabática</h4>
            <p className="text-2xl font-black text-[#2D3831] dark:text-emerald-300 flex items-baseline gap-1">
              09:30 <span className="text-xs font-normal text-[#66756C]">hrs</span>
            </p>
          </div>
          <div className="bg-[#7C9885] dark:bg-slate-900 text-white p-6 rounded-3xl border border-[#6B8774] dark:border-slate-800 space-y-2 shadow-xs">
            <Church className="w-7 h-7 text-white" />
            <span className="text-[10px] font-bold text-[#E8EFEA] uppercase block">Sábados</span>
            <h4 className="text-base font-bold text-white dark:text-emerald-100">Culto Divino</h4>
            <p className="text-2xl font-black text-white dark:text-emerald-300 flex items-baseline gap-1">
              11:00 <span className="text-xs font-normal text-[#E8EFEA]">hrs</span>
            </p>
          </div>
          <div className="bg-[#FAF8F3] dark:bg-slate-900 p-6 rounded-3xl border border-[#E2DEC9] dark:border-slate-800 space-y-2">
            <Flame className="w-7 h-7 text-[#E08A72]" />
            <span className="text-[10px] font-bold text-[#E08A72] uppercase block">Sábados</span>
            <h4 className="text-base font-bold text-[#2D3831] dark:text-emerald-100">Sociedad de Jóvenes (JA)</h4>
            <p className="text-2xl font-black text-[#2D3831] dark:text-emerald-300 flex items-baseline gap-1">
              18:00 <span className="text-xs font-normal text-[#66756C]">hrs</span>
            </p>
          </div>
          <div className="bg-[#FAF8F3] dark:bg-slate-900 p-6 rounded-3xl border border-[#E2DEC9] dark:border-slate-800 space-y-2">
            <Heart className="w-7 h-7 text-[#7C9885]" />
            <span className="text-[10px] font-bold text-[#7C9885] uppercase block">Miércoles</span>
            <h4 className="text-base font-bold text-[#2D3831] dark:text-emerald-100">Culto de Oración</h4>
            <p className="text-2xl font-black text-[#2D3831] dark:text-emerald-300 flex items-baseline gap-1">
              19:30 <span className="text-xs font-normal text-[#66756C]">hrs</span>
            </p>
          </div>
        </div>
      </section>

      {/* Sermones Recientes */}
      <section className="bg-[#FAF8F3] dark:bg-slate-900 py-12 border-y border-[#E2DEC9] dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="bg-[#E8F0EA] text-[#546E5C] dark:bg-emerald-950/50 dark:text-emerald-300 text-[11px] font-bold px-3 py-1 rounded-full border border-[#7C9885]/30">
                Predicaciones
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#2D3831] dark:text-emerald-100 mt-2">
                Sermones Recientes
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sermons.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedSermon && setSelectedSermon(s)}
                className="bg-white dark:bg-slate-950 rounded-3xl overflow-hidden border border-[#E2DEC9] dark:border-slate-800 shadow-xs hover:border-[#7C9885] cursor-pointer group transition-all"
              >
                <div className="relative aspect-video bg-slate-800">
                  <img
                    src={s.thumbnail}
                    alt={s.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-[#2D3831]/30 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-[#7C9885] text-white flex items-center justify-center shadow-md">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="p-5 space-y-1.5">
                  <span className="text-[10px] font-bold text-[#7C9885] dark:text-emerald-400">
                    {s.category}
                  </span>
                  <h4 className="text-sm font-bold text-[#2D3831] dark:text-slate-100">{s.title}</h4>
                  <p className="text-xs text-[#66756C] dark:text-slate-400">🎙️ {s.speaker}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Descargas de Materiales */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="bg-[#E8F0EA] text-[#546E5C] dark:bg-emerald-950/50 dark:text-emerald-300 text-[11px] font-bold px-3 py-1 rounded-full border border-[#7C9885]/30">
              Recursos
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2D3831] dark:text-emerald-100 mt-2">
              Materiales y Documentos
            </h2>
          </div>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-5 py-2.5 bg-[#7C9885] hover:bg-[#6B8774] text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Upload className="w-4 h-4" /> Subir Material
          </button>
        </div>

        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-[#7C9885] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar recurso por título..."
            value={materialSearch}
            onChange={(e) => setMaterialSearch(e.target.value)}
            className="w-full bg-[#FAF8F3] dark:bg-slate-900 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-[#E2DEC9] dark:border-slate-800 text-[#2D3831] dark:text-slate-100 outline-none focus:border-[#7C9885]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredMaterials.length === 0 ? (
            <p className="text-xs text-[#66756C] dark:text-slate-400 col-span-3 text-center py-6">
              No hay archivos o materiales registrados.
            </p>
          ) : (
            filteredMaterials.map((m) => (
              <div
                key={m.id}
                className="bg-[#FAF8F3] dark:bg-slate-900 rounded-3xl p-5 border border-[#E2DEC9] dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <span className="bg-[#E8F0EA] dark:bg-slate-800 text-[#546E5C] dark:text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    {getExtensionLabel(m.mimeType, m.path)}
                  </span>
                  <h4 className="text-sm font-bold text-[#2D3831] dark:text-slate-100 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#7C9885]" /> {m.titulo}
                  </h4>
                  <p className="text-xs text-[#66756C] dark:text-slate-400">
                    Subido por: {m.usuario?.nombre || 'Miembro de Iglesia'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownload(m)}
                  className="w-full py-2.5 bg-[#7C9885] hover:bg-[#6B8774] text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Descargar Archivo
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Muro de Testimonios */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <span className="bg-[#E8F0EA] text-[#546E5C] dark:bg-emerald-950/50 dark:text-emerald-300 text-[11px] font-bold px-3 py-1 rounded-full border border-[#7C9885]/30">
            Agradecimientos y Fe
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2D3831] dark:text-emerald-100 pt-1">
            Muro de Testimonios
          </h2>
          <p className="text-xs text-[#66756C] dark:text-slate-400">
            Compartiendo las grandes bendiciones que Dios realiza en Hualqui.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonies.length === 0 ? (
            <p className="text-xs text-[#66756C] dark:text-slate-400 col-span-3 text-center py-6">
              Aún no hay testimonios compartidos. ¡Sé el primero en publicar!
            </p>
          ) : (
            testimonies.map((t) => (
              <div
                key={t.id}
                className="bg-[#FAF8F3] dark:bg-slate-900 rounded-3xl p-6 border border-[#E2DEC9] dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <Sparkles className="w-5 h-5 text-[#7C9885]" />
                  <h4 className="text-sm font-bold text-[#2D3831] dark:text-slate-100">
                    {t.titulo || 'Agradecimiento al Señor'}
                  </h4>
                  <p className="text-xs text-[#526157] dark:text-slate-300 leading-relaxed italic">
                    "{t.contenido || 'Sin contenido'}"
                  </p>
                </div>
                <div className="pt-3 border-t border-[#E8E4D5] dark:border-slate-800 flex justify-between items-center text-xs text-[#66756C]">
                  <span>👤 {t.autor || 'Hermano de Iglesia'}</span>
                  <button
                    onClick={() => handleLikeTestimonio(t.id)}
                    className="px-3 py-1 bg-[#E8F0EA] dark:bg-slate-800 hover:bg-[#D8E6DB] text-[#546E5C] dark:text-emerald-300 font-semibold rounded-xl text-[11px] cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <Heart className="w-3 h-3 fill-current" /> Amén ({t.likes || 0})
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Publicar Testimonio */}
        <div className="bg-[#FAF8F3] dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-[#E2DEC9] dark:border-slate-800 max-w-2xl mx-auto space-y-4">
          <h4 className="font-bold text-[#2D3831] dark:text-emerald-100 text-sm text-center flex items-center justify-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-[#7C9885]" /> ¿Tienes un testimonio para compartir?
          </h4>
          <form onSubmit={handleTestimonySubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Tu Nombre o Familia"
                value={testimonyAuthor}
                onChange={(e) => setTestimonyAuthor(e.target.value)}
                className="bg-white dark:bg-slate-950 p-3 rounded-xl border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-100 outline-none focus:border-[#7C9885]"
              />
              <input
                type="text"
                required
                placeholder="Título del Testimonio *"
                value={testimonyTitle}
                onChange={(e) => setTestimonyTitle(e.target.value)}
                className="bg-white dark:bg-slate-950 p-3 rounded-xl border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-100 outline-none focus:border-[#7C9885]"
              />
            </div>
            <textarea
              rows={3}
              required
              placeholder="Escribe brevemente tu testimonio de gratitud... *"
              value={testimonyContent}
              onChange={(e) => setTestimonyContent(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 p-3 rounded-xl border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-100 outline-none focus:border-[#7C9885]"
            ></textarea>
            <button
              type="submit"
              disabled={loadingTestimony}
              className="w-full py-3 bg-[#7C9885] hover:bg-[#6B8774] text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> {loadingTestimony ? 'Publicando...' : 'Publicar Testimonio en el Muro'}
            </button>
          </form>
        </div>
      </section>

      {/* Formulario de Petición de Oración */}
      <section className="max-w-3xl mx-auto px-4">
        <div className="bg-[#FAF8F3] dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xs border border-[#E2DEC9] dark:border-slate-800 space-y-5">
          <div className="text-center space-y-1">
            <Heart className="w-8 h-8 text-[#E08A72] mx-auto" />
            <h2 className="text-xl font-bold text-[#2D3831] dark:text-emerald-100">¿Podemos Orar por Ti?</h2>
            <p className="text-xs text-[#66756C] dark:text-slate-400">
              Escribe tu motivo de oración para que nuestra comunidad interceda por ti.
            </p>
          </div>

          <form onSubmit={handlePrayerSubmit} className="space-y-4 text-xs">
            <input
              type="text"
              placeholder="Tu Nombre (Opcional)"
              value={prayerName}
              onChange={(e) => setPrayerName(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 p-3 rounded-xl border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-100 outline-none focus:border-[#7C9885]"
            />
            <textarea
              rows={3}
              required
              placeholder="Escribe aquí tu motivo o pedido de oración... *"
              value={prayerRequest}
              onChange={(e) => setPrayerRequest(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 p-3 rounded-xl border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-100 outline-none focus:border-[#7C9885]"
            ></textarea>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="priv"
                checked={prayerPrivate}
                onChange={(e) => setPrayerPrivate(e.target.checked)}
                className="accent-[#7C9885]"
              />
              <label htmlFor="priv" className="text-xs text-[#526157] dark:text-slate-300 cursor-pointer">
                Mantener este pedido en privado (solo con equipo pastoral)
              </label>
            </div>
            <button
              type="submit"
              disabled={loadingPrayer}
              className="w-full py-3.5 bg-[#7C9885] hover:bg-[#6B8774] text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4" /> {loadingPrayer ? 'Guardando...' : 'Enviar Pedido de Oración'}
            </button>
          </form>
        </div>
      </section>

      {/* Modal para Subida de Materiales R2 */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#2D3831]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F3] dark:bg-slate-900 w-full max-w-md rounded-3xl overflow-hidden shadow-xl p-6 space-y-4 border border-[#E2DEC9] dark:border-slate-800">
            <div className="flex justify-between items-center border-b border-[#E8E4D5] dark:border-slate-800 pb-3">
              <h3 className="font-bold text-[#2D3831] dark:text-emerald-100 text-sm flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-[#7C9885]" /> Subir Nuevo Material
              </h3>
              <button 
                onClick={() => setUploadModalOpen(false)} 
                className="text-[#66756C] hover:text-[#2D3831] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#2D3831] dark:text-slate-200 mb-1">
                  Título del Recurso *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Guía de Escuela Sabática"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 p-3 rounded-xl border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-100 outline-none focus:border-[#7C9885]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2D3831] dark:text-slate-200 mb-1">
                  Seleccionar Archivo (PDF, PPTX, MP3) *
                </label>
                <input
                  type="file"
                  required
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-[#526157] dark:text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#E8F0EA] file:text-[#546E5C] hover:file:bg-[#D8E6DB]"
                />
              </div>

              <button
                type="submit"
                disabled={loadingUpload}
                className="w-full py-3 bg-[#7C9885] hover:bg-[#6B8774] text-white font-semibold text-xs rounded-xl shadow-xs disabled:opacity-50 cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" /> {loadingUpload ? 'Guardando en Cloudflare R2...' : 'Publicar Archivo'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}