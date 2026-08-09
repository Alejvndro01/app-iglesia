'use client';

import React, { useState, useEffect } from 'react';

interface Testimonio {
  id: string;
  author: string;
  title: string;
  content: string;
  likes: number;
}

interface HomeViewProps {
  navigateTo: (page: string) => void;
  showToast: (msg: string) => void;
}

export function HomeView({ navigateTo, showToast }: HomeViewProps) {
  // Estados para Testimonios
  const [testimonies, setTestimonies] = useState<Testimonio[]>([]);
  const [testimonyTitle, setTestimonyTitle] = useState('');
  const [testimonyAuthor, setTestimonyAuthor] = useState('');
  const [testimonyContent, setTestimonyContent] = useState('');
  const [loadingTestimony, setLoadingTestimony] = useState(false);

  // Estados para Oración
  const [prayerName, setPrayerName] = useState('');
  const [prayerRequest, setPrayerRequest] = useState('');
  const [prayerPrivate, setPrayerPrivate] = useState(false);
  const [loadingPrayer, setLoadingPrayer] = useState(false);

  // Cargar Testimonios desde PostgreSQL
  const fetchTestimonies = async () => {
    try {
      const res = await fetch('/api/testimonios');
      if (res.ok) {
        const data = await res.json();
        setTestimonies(data.testimonios || []);
      }
    } catch (err) {
      console.error('Error cargando testimonios:', err);
    }
  };

  useEffect(() => {
    fetchTestimonies();
  }, []);

  // Handler para Pedido de Oración
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
          request: prayerRequest,
          isPrivate: prayerPrivate,
        }),
      });

      if (!res.ok) throw new Error();

      setPrayerName('');
      setPrayerRequest('');
      setPrayerPrivate(false);
      showToast('¡Pedido de oración guardado en la base de datos!');
    } catch (err) {
      showToast('Error al enviar el pedido de oración');
    } finally {
      setLoadingPrayer(false);
    }
  };

  // Handler para Publicar Testimonio
  const handleTestimonySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonyContent.trim() || !testimonyTitle.trim()) return;

    setLoadingTestimony(true);
    try {
      const res = await fetch('/api/testimonios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: testimonyAuthor.trim() || 'Hermano de Iglesia',
          title: testimonyTitle,
          content: testimonyContent,
        }),
      });

      if (!res.ok) throw new Error();

      setTestimonyTitle('');
      setTestimonyAuthor('');
      setTestimonyContent('');
      showToast('¡Testimonio publicado correctamente!');
      await fetchTestimonies();
    } catch (err) {
      showToast('Error al publicar testimonio');
    } finally {
      setLoadingTestimony(false);
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Muro de Testimonios */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
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
                  <h4 className="text-base font-bold text-[#486379]">{t.title}</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">"{t.content}"</p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
                  <span>👤 {t.author}</span>
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
    </div>
  );
}