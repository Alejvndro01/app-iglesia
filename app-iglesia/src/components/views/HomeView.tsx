'use client';

import React, { useState, useEffect } from 'react';

interface Testimonio {
  id: string;
  autor?: string;
  author?: string;
  titulo?: string;
  title?: string;
  contenido?: string;
  content?: string;
  likes?: number;
}

interface Material {
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

interface HomeViewProps {
  navigateTo: (page: string) => void;
  showToast: (msg: string) => void;
  setSelectedSermon?: (sermon: any) => void;
}

export function HomeView({ navigateTo, showToast, setSelectedSermon }: HomeViewProps) {
  // Estados de Testimonios
  const [testimonies, setTestimonies] = useState<Testimonio[]>([]);
  const [testimonyTitle, setTestimonyTitle] = useState('');
  const [testimonyAuthor, setTestimonyAuthor] = useState('');
  const [testimonyContent, setTestimonyContent] = useState('');
  const [loadingTestimony, setLoadingTestimony] = useState(false);

  // Estados de Oración
  const [prayerName, setPrayerName] = useState('');
  const [prayerRequest, setPrayerRequest] = useState('');
  const [prayerPrivate, setPrayerPrivate] = useState(false);
  const [loadingPrayer, setLoadingPrayer] = useState(false);

  // Estados para Archivos / Materiales
  const [materials, setMaterials] = useState<Material[]>([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [materialSearch, setMaterialSearch] = useState('');

  // Helper para obtener etiqueta de extensión limpia
  const getExtensionLabel = (mimeType: string, path: string) => {
    if (mimeType.includes('pdf') || path.endsWith('.pdf')) return 'PDF';
    if (mimeType.includes('word') || mimeType.includes('officedocument') || path.endsWith('.docx')) return 'DOCX';
    if (mimeType.includes('presentation') || path.endsWith('.pptx')) return 'PPTX';
    if (mimeType.includes('plain') || path.endsWith('.txt')) return 'TXT';
    if (mimeType.includes('mpeg') || mimeType.includes('mp3')) return 'MP3';
    return 'DOCUMENTO';
  };

  // Cargar Testimonios
  const fetchTestimonies = async () => {
    try {
      const res = await fetch('/api/testimonios');
      if (res.ok) {
        const data = await res.json();
        setTestimonies(Array.isArray(data) ? data : data.testimonios || []);
      }
    } catch (err) {
      console.error('Error cargando testimonios:', err);
    }
  };

  // Cargar Archivos
  const fetchMaterials = async () => {
    try {
      const res = await fetch('/api/archivos');
      if (res.ok) {
        const data = await res.json();
        setMaterials(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error cargando archivos:', err);
    }
  };

  useEffect(() => {
    fetchTestimonies();
    fetchMaterials();
  }, []);

  // Handler Oraciones
  const handlePrayerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prayerRequest.trim()) return;

    setLoadingPrayer(true);
    try {
      const res = await fetch('/api/oraciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: prayerName.trim() || 'Anónimo',
          peticion: prayerRequest,
          esPrivado: prayerPrivate,
        }),
      });

      if (!res.ok) throw new Error();

      setPrayerName('');
      setPrayerRequest('');
      setPrayerPrivate(false);
      showToast('¡Pedido de oración guardado!');
    } catch (err) {
      showToast('Error al enviar pedido de oración');
    } finally {
      setLoadingPrayer(false);
    }
  };

  // Handler Testimonios
  const handleTestimonySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonyContent.trim() || !testimonyTitle.trim()) return;

    setLoadingTestimony(true);
    try {
      const res = await fetch('/api/testimonios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          autor: testimonyAuthor.trim() || 'Hermano de Iglesia',
          titulo: testimonyTitle,
          contenido: testimonyContent,
        }),
      });

      if (!res.ok) throw new Error();

      setTestimonyTitle('');
      setTestimonyAuthor('');
      setTestimonyContent('');
      showToast('¡Testimonio publicado con éxito!');
      await fetchTestimonies();
    } catch (err) {
      showToast('Error al publicar testimonio');
    } finally {
      setLoadingTestimony(false);
    }
  };

  // Handler Subida de Archivos a Servidor
  const handleUploadSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedFile) {
    showToast('Selecciona un archivo');
    return;
  }

  setLoadingUpload(true);
  try {
    // Paso 1: Pedir URL presignada a nuestro backend
      const presignedRes = await fetch('/api/archivos/presigned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: selectedFile.name,
          fileType: selectedFile.type || 'application/octet-stream',
        }),
      });

      if (!presignedRes.ok) {
        const errData = await presignedRes.json();
        throw new Error(errData.error || 'Error obteniendo permiso de subida');
      }

      const { uploadUrl, publicUrl } = await presignedRes.json();

      // Paso 2: Subir archivo DIRECTO a Cloudflare R2 desde el navegador (sin pasar por Vercel)
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

      // Paso 3: Guardar el registro en la base de datos Neon PostgreSQL
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

  // Helper para descarga robusta (Soporta Base64/Data URLs y URLs tradicionales)
  const handleDownload = (m: Material) => {
    try {
      const link = document.createElement('a');
      link.href = m.path;
      link.download = m.titulo || 'archivo_descarga';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error al descargar:', error);
      showToast('Error al iniciar la descarga');
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

  const filteredMaterials = materials.filter(item =>
    item.titulo.toLowerCase().includes(materialSearch.toLowerCase())
  );

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Banner */}
      <section className="bg-[#d0e2f1] pt-12 pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="w-full md:w-1/2 text-center md:text-left space-y-5">
            <div className="inline-flex items-center space-x-2 bg-white/80 px-4 py-1.5 rounded-full text-xs font-bold text-[#486379] shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Iglesia Abierta en Bulnes 450, Hualqui</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#486379] leading-tight">
              Un lugar para <br />
              <span className="text-[#eca489]">Creer, Pertenecer</span> <br />
              y Servir.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl">
              Bienvenido a la casa de Dios. Te invitamos a compartir con nosotros el estudio de la Biblia y la comunión fraternal.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <button
                onClick={() => navigateTo('estudios-biblicos')}
                className="px-6 py-3.5 bg-[#eca489] hover:bg-[#e49375] text-white font-bold rounded-full text-xs shadow-md cursor-pointer"
              >
                Solicitar Estudio Bíblico
              </button>
              <button
                onClick={() => navigateTo('leccion')}
                className="px-6 py-3.5 bg-white hover:bg-slate-50 text-[#486379] font-bold rounded-full text-xs shadow-sm border border-sky-100 flex items-center space-x-1 cursor-pointer"
              >
                <span>📖 Lección de Escuela Sabática</span>
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md h-72 sm:h-88 rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
              <img
                src="/landscape.jpg"
                alt="IASD Hualqui"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <span className="bg-[#eca489] text-[10px] font-bold px-3 py-1 rounded-full uppercase">Bulnes 450, Hualqui</span>
                  <h3 className="text-lg font-bold mt-2">Templo Central Hualqui</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Horarios de Culto */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h3 className="text-xs font-bold text-[#eca489] uppercase tracking-widest">Horarios de Culto</h3>
          <h2 className="text-3xl font-black text-[#486379] mt-1">Nuestras Reuniones Semanales</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#f0f6fb] p-6 rounded-3xl border border-sky-100">
            <div className="text-3xl mb-3">📖</div>
            <span className="text-[10px] font-extrabold text-[#eca489] uppercase">Sábados</span>
            <h4 className="text-lg font-black text-[#486379]">Escuela Sabática</h4>
            <p className="text-2xl font-black text-[#eca489] mt-1">10:00 <span className="text-xs text-slate-500">hrs</span></p>
          </div>
          <div className="bg-[#486379] text-white p-6 rounded-3xl shadow-md">
            <div className="text-3xl mb-3">⛪</div>
            <span className="text-[10px] font-extrabold text-[#eca489] uppercase">Sábados</span>
            <h4 className="text-lg font-black text-white">Culto Divino</h4>
            <p className="text-2xl font-black text-[#eca489] mt-1">11:30 <span className="text-xs text-slate-200">hrs</span></p>
          </div>
          <div className="bg-[#f0f6fb] p-6 rounded-3xl border border-sky-100">
            <div className="text-3xl mb-3">🔥</div>
            <span className="text-[10px] font-extrabold text-[#eca489] uppercase">Sábados</span>
            <h4 className="text-lg font-black text-[#486379]">Culto JA (Jóvenes)</h4>
            <p className="text-2xl font-black text-[#eca489] mt-1">18:00 <span className="text-xs text-slate-500">hrs</span></p>
          </div>
          <div className="bg-[#f0f6fb] p-6 rounded-3xl border border-sky-100">
            <div className="text-3xl mb-3">🙏</div>
            <span className="text-[10px] font-extrabold text-[#eca489] uppercase">Miércoles</span>
            <h4 className="text-lg font-black text-[#486379]">Culto de Oración</h4>
            <p className="text-2xl font-black text-[#eca489] mt-1">19:00 <span className="text-xs text-slate-500">hrs</span></p>
          </div>
        </div>
      </section>

      {/* Predicaciones */}
      <section className="bg-[#f0f6fb] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h3 className="text-xs font-bold text-[#eca489] uppercase tracking-widest">Predicaciones</h3>
              <h2 className="text-3xl font-black text-[#486379] mt-1">Sermones Recientes</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sermons.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelectedSermon && setSelectedSermon(s)}
                className="bg-white rounded-3xl overflow-hidden border border-sky-100 shadow-xs hover:shadow-md cursor-pointer group"
              >
                <div className="relative aspect-video bg-slate-800">
                  <img src={s.thumbnail} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-[#eca489] text-white flex items-center justify-center">▶</div>
                  </div>
                </div>
                <div className="p-5">
                  <span className="text-[10px] font-bold text-[#eca489]">{s.category}</span>
                  <h4 className="text-sm font-bold text-[#486379] mt-1">{s.title}</h4>
                  <p className="text-xs text-slate-500 mt-2">👤 {s.speaker}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Descargas / Materiales */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h3 className="text-xs font-bold text-[#eca489] uppercase tracking-widest">Descargas</h3>
            <h2 className="text-3xl font-black text-[#486379] mt-1">Materiales y Recursos</h2>
          </div>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-5 py-2.5 bg-[#eca489] hover:bg-[#e49375] text-white font-bold text-xs rounded-full shadow-md cursor-pointer"
          >
            📤 Subir Material
          </button>
        </div>

        <div className="mb-6 flex justify-between items-center bg-[#f0f6fb] p-3 rounded-2xl border border-sky-100">
          <input
            type="text"
            placeholder="🔍 Buscar recurso por título..."
            value={materialSearch}
            onChange={(e) => setMaterialSearch(e.target.value)}
            className="w-full md:w-72 bg-white text-xs px-4 py-2 rounded-full border border-sky-200 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredMaterials.length === 0 ? (
            <p className="text-xs text-slate-400 col-span-3 text-center">No hay archivos registrados.</p>
          ) : (
            filteredMaterials.map((m) => (
              <div key={m.id} className="bg-white rounded-3xl p-5 border border-sky-100 shadow-xs flex flex-col justify-between space-y-3">
                <div>
                  <span className="bg-[#d0e2f1] text-[#486379] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                    {getExtensionLabel(m.mimeType, m.path)}
                  </span>
                  <h4 className="text-sm font-bold text-[#486379] mt-2">{m.titulo}</h4>
                  <p className="text-xs text-slate-400 mt-1">Subido por: {m.usuario?.nombre || 'Miembro'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownload(m)}
                  className="w-full py-2 bg-[#eca489] hover:bg-[#e49375] text-white font-bold text-xs rounded-full text-center shadow-xs block cursor-pointer transition-colors"
                >
                  Descargar Archivo
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Muro de Testimonios */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="bg-[#eca489] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
            Agradecimientos y Fe
          </span>
          <h2 className="text-3xl font-black text-[#486379] mt-1">Muro de Testimonios</h2>
          <p className="text-xs text-slate-500 mt-1">
            Compartiendo las grandes maravillas que Dios hace en Hualqui.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonies.length === 0 ? (
            <p className="text-xs text-slate-400 col-span-3 text-center">
              Aún no hay testimonios registrados. ¡Sé el primero en compartir!
            </p>
          ) : (
            testimonies.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-3xl p-6 border border-sky-100 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl block mb-2">✨</span>
                  <h4 className="text-base font-bold text-[#486379]">
                    {t.titulo || t.title || 'Agradecimiento al Señor'}
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    "{t.contenido || t.content || 'Sin contenido'}"
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
                  <span>👤 {t.autor || t.author || 'Hermano de Iglesia'}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Formulario de Testimonio */}
        <div className="mt-8 bg-[#f0f6fb] p-6 rounded-3xl border border-sky-100 max-w-2xl mx-auto space-y-3">
          <h4 className="font-extrabold text-[#486379] text-sm text-center">
            ¿Tienes un testimonio o agradecimiento que compartir?
          </h4>
          <form onSubmit={handleTestimonySubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Tu Nombre"
                value={testimonyAuthor}
                onChange={(e) => setTestimonyAuthor(e.target.value)}
                className="bg-white text-xs p-3 rounded-xl border border-sky-200 outline-none"
              />
              <input
                type="text"
                required
                placeholder="Título del Testimonio *"
                value={testimonyTitle}
                onChange={(e) => setTestimonyTitle(e.target.value)}
                className="bg-white text-xs p-3 rounded-xl border border-sky-200 outline-none"
              />
            </div>
            <textarea
              rows={3}
              required
              placeholder="Cuenta brevemente lo que el Señor ha hecho por ti... *"
              value={testimonyContent}
              onChange={(e) => setTestimonyContent(e.target.value)}
              className="w-full bg-white text-xs p-3 rounded-xl border border-sky-200 outline-none"
            ></textarea>
            <button
              type="submit"
              disabled={loadingTestimony}
              className="w-full py-2.5 bg-[#eca489] hover:bg-[#e49375] text-white font-bold text-xs rounded-full shadow-sm cursor-pointer disabled:opacity-50"
            >
              {loadingTestimony ? 'Publicando...' : 'Publicar Testimonio en el Muro'}
            </button>
          </form>
        </div>
      </section>

      {/* Formulario de Pedido de Oración */}
      <section className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-sky-100">
          <div className="text-center mb-6">
            <span className="text-3xl block mb-2">🙏</span>
            <h2 className="text-2xl font-black text-[#486379]">¿Podemos Orar por Ti?</h2>
            <p className="text-xs text-slate-500 mt-1">
              Escribe tu motivo de oración y lo guardaremos en nuestra lista intercesora.
            </p>
          </div>

          <form onSubmit={handlePrayerSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Tu nombre (opcional)"
              value={prayerName}
              onChange={(e) => setPrayerName(e.target.value)}
              className="w-full bg-[#fbf6ee] text-xs p-3.5 rounded-2xl border border-amber-100 outline-none"
            />
            <textarea
              rows={3}
              required
              placeholder="Escribe aquí tu motivo de oración... *"
              value={prayerRequest}
              onChange={(e) => setPrayerRequest(e.target.value)}
              className="w-full bg-[#fbf6ee] text-xs p-3.5 rounded-2xl border border-amber-100 outline-none"
            ></textarea>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="priv"
                checked={prayerPrivate}
                onChange={(e) => setPrayerPrivate(e.target.checked)}
                className="accent-[#eca489]"
              />
              <label htmlFor="priv" className="text-xs text-slate-600 cursor-pointer">
                Mantener este pedido en privado
              </label>
            </div>
            <button
              type="submit"
              disabled={loadingPrayer}
              className="w-full py-3.5 bg-[#eca489] hover:bg-[#e49375] text-white font-bold text-xs rounded-full shadow-md cursor-pointer disabled:opacity-50"
            >
              {loadingPrayer ? 'Guardando...' : 'Enviar Pedido de Oración'}
            </button>
          </form>
        </div>
      </section>

      {/* Modal para Subir Material */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-[#486379] text-sm">Subir Nuevo Material</h3>
              <button onClick={() => setUploadModalOpen(false)} className="text-slate-400 font-bold cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#486379] mb-1">Título del Recurso</label>
                <input
                  type="text"
                  placeholder="Ej. Guía de Escuela Sabática"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full bg-[#fbf6ee] text-xs p-3 rounded-xl border border-amber-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#486379] mb-1">Seleccionar Archivo (PDF, PPTX, MP3)</label>
                <input
                  type="file"
                  required
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-slate-500"
                />
              </div>

              <button
                type="submit"
                disabled={loadingUpload}
                className="w-full py-3 bg-[#eca489] hover:bg-[#e49375] text-white font-bold text-xs rounded-full shadow-md disabled:opacity-50 cursor-pointer"
              >
                {loadingUpload ? 'Guardando en Servidor...' : 'Publicar Archivo'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}