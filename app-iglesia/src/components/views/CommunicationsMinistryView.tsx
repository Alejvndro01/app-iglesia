'use client';

import React, { useState } from 'react';
import {
  Radio,
  Video,
  Mic2,
  Tv,
  UploadCloud,
  FileImage,
  Share2,
  Download,
  Calendar,
  CheckCircle2,
  Send,
  Sparkles,
  ExternalLink,
  Camera,
  Layers,
  MonitorPlay
} from 'lucide-react';

interface AnnouncementForm {
  ministry: string;
  applicant: string;
  phone: string;
  displayDate: string;
  announcementText: string;
}

export default function CommunicationsMinistryView() {
  const [streamActive, setStreamActive] = useState(false);
  const [announcementSent, setAnnouncementSent] = useState(false);
  const [form, setForm] = useState<AnnouncementForm>({
    ministry: 'Jóvenes JA',
    applicant: '',
    phone: '',
    displayDate: '',
    announcementText: ''
  });

  const mediaAssets = [
    {
      title: 'Plantilla Oficial PPT 2026',
      desc: 'Formato 16:9 con tipografías y logos institucionales',
      size: '12.4 MB',
      type: 'PowerPoint'
    },
    {
      title: 'Pack de Logos IASD Central Hualqui',
      desc: 'Versiones en PNG transparente, SVG vectorial y fondos oscuros',
      size: '8.2 MB',
      type: 'Vector / PNG'
    },
    {
      title: 'Fondos de Adoración & Countdown',
      desc: 'Loops de video sutiles en resolución Full HD para alabanza',
      size: '145 MB',
      type: 'Video MP4'
    }
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.applicant || !form.phone || !form.announcementText) return;
    setAnnouncementSent(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 antialiased text-[#2D3831] dark:text-slate-200">
      
      {/* 1. BROADCAST DECK / MONITOR DE TRANSMISIÓN EN VIVO */}
      <div className="rounded-3xl bg-[#1E2621] text-white border border-[#2D3831] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow decorativo de emisión */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_top_right,_rgba(124,152,133,0.2)_0%,_transparent_70%)] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-600/90 text-white shadow-xs animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white" /> {streamActive ? 'Al Aire • En Vivo' : 'Canal Oficial Listo'}
              </span>
              <span className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1">
                <Radio className="w-3.5 h-3.5" /> 1080p 60fps • YouTube & Facebook
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
              Ministerio de Comunicaciones & Medios
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Llevamos el mensaje de esperanza más allá de las cuatro paredes del templo mediante transmisión digital, sonido profesional, diseño y soporte multimedia.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="https://www.youtube.com/@IASDCentralHualqui"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#7C9885] hover:bg-[#6B8774] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                <Tv className="w-4 h-4" /> Canal de YouTube
              </a>
              <button
                onClick={() => setStreamActive(!streamActive)}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                {streamActive ? 'Desconectar Monitor' : 'Comprobar Señal de Cabina'}
              </button>
            </div>
          </div>

          {/* Tarjeta Monitor Visual */}
          <div className="lg:col-span-5 bg-black/40 border border-white/10 rounded-2xl p-5 backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <MonitorPlay className="w-4 h-4 text-[#7C9885]" /> Estado de Transmisión Sabática
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-400">10:30 hrs</span>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Próximo Culto:</span>
                <span className="font-semibold text-white">Culto de Adoración Central</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Operador de Audio:</span>
                <span className="font-semibold text-white">Equipo Técnico IASD</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Cámaras & Switcher:</span>
                <span className="font-semibold text-white">Cabina Audiovisual</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#7C9885]/10 border border-[#7C9885]/30 text-[11px] text-emerald-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E0A96D]" /> Transmisiones integradas con el Boletín Digital.
            </div>
          </div>

        </div>
      </div>

      {/* 2. TABLERO DE ENVÍO DE ANUNCIOS & PROYECCIONES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Guía de Envío */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#7C9885] dark:text-emerald-400">
              Gestión de Pantallas
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#2D3831] dark:text-emerald-100">
              Petición de Anuncios para el Sábado
            </h2>
            <p className="text-xs sm:text-sm text-[#526157] dark:text-slate-400 leading-relaxed">
              ¿Tu ministerio tiene una actividad o evento especial? Envía los datos antes del día **Jueves a las 22:00 hrs** para incluirlo en las diapositivas de avisos y boletín sabático.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-[#FAF8F3] dark:bg-slate-900/60 border border-[#E2DEC9] dark:border-slate-800 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#E8F0EA] dark:bg-slate-800 text-[#7C9885] dark:text-emerald-400">
                <FileImage className="w-4 h-4" />
              </div>
              <div className="text-xs space-y-0.5">
                <h4 className="font-bold text-[#2D3831] dark:text-slate-100">Formato de Afiches</h4>
                <p className="text-[#526157] dark:text-slate-400">
                  Resolución recomendada 1920x1080 (horizontal 16:9), formato JPG o PNG sin bordes cortados.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F3] dark:bg-slate-900/60 border border-[#E2DEC9] dark:border-slate-800 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#E8F0EA] dark:bg-slate-800 text-[#7C9885] dark:text-emerald-400">
                <Mic2 className="w-4 h-4" />
              </div>
              <div className="text-xs space-y-0.5">
                <h4 className="font-bold text-[#2D3831] dark:text-slate-100">Petición de Micrófonos / Instrumentos</h4>
                <p className="text-[#526157] dark:text-slate-400">
                  Si requieres prueba de sonido especial para cantos o partes especiales, avísanos con anticipación.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de Solicitud de Aviso */}
        <div className="lg:col-span-7 bg-[#FAF8F3] dark:bg-slate-900/60 border border-[#E2DEC9] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
          {announcementSent ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#E8F0EA] dark:bg-emerald-950/60 text-[#7C9885] dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-lg text-[#2D3831] dark:text-slate-100">
                ¡Anuncio Recibido por la Cabina!
              </h4>
              <p className="text-xs text-[#526157] dark:text-slate-400 max-w-sm mx-auto">
                El equipo revisará la información y la dejará programada en el sistema de proyección para este Sábado.
              </p>
              <button
                onClick={() => setAnnouncementSent(false)}
                className="mt-2 text-xs font-bold text-[#7C9885] dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Enviar otra solicitud
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2DEC9] dark:border-slate-800 pb-3">
                <h3 className="font-serif font-bold text-lg text-[#2D3831] dark:text-emerald-100">
                  Solicitud de Proyección
                </h3>
                <span className="text-[10px] font-bold uppercase text-[#7C9885] dark:text-emerald-400">
                  Uso Exclusivo Ministerios
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#66756C] dark:text-slate-400">
                    Ministerio Solicitante *
                  </label>
                  <select
                    value={form.ministry}
                    onChange={(e) => setForm({ ...form, ministry: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-200 focus:outline-none focus:border-[#7C9885]"
                  >
                    <option value="Jóvenes JA">Jóvenes JA</option>
                    <option value="Ministerio Personal">Ministerio Personal</option>
                    <option value="Hogar y Familia">Hogar y Familia</option>
                    <option value="Escuela Sabática">Escuela Sabática</option>
                    <option value="Mayordomía">Mayordomía</option>
                    <option value="Dorcas / Acción Social">Dorcas / Acción Social</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#66756C] dark:text-slate-400">
                    Fecha a Proyectar *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.displayDate}
                    onChange={(e) => setForm({ ...form, displayDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-200 focus:outline-none focus:border-[#7C9885]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#66756C] dark:text-slate-400">
                    Hermano Responsable *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Claudio Morales"
                    value={form.applicant}
                    onChange={(e) => setForm({ ...form, applicant: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-200 focus:outline-none focus:border-[#7C9885]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#66756C] dark:text-slate-400">
                    WhatsApp de Contacto *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+56 9 1234 5678"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-200 focus:outline-none focus:border-[#7C9885]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#66756C] dark:text-slate-400">
                  Detalle del Anuncio / Texto para Diapositiva *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Escribe el texto exacto, horario, lugar y llamado a la acción..."
                  value={form.announcementText}
                  onChange={(e) => setForm({ ...form, announcementText: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-200 focus:outline-none focus:border-[#7C9885] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#7C9885] hover:bg-[#6B8774] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Send className="w-3.5 h-3.5" /> Enviar a Equipo de Comunicaciones
              </button>
            </form>
          )}
        </div>

      </div>

      {/* 3. ASSETS & DESCARGAS AUDIOVISUALES */}
      <div className="space-y-4 pt-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#7C9885] dark:text-emerald-400">
            Recursos Gráficos
          </span>
          <h3 className="text-2xl font-serif font-bold text-[#2D3831] dark:text-emerald-100">
            Material Institucional Descargable
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mediaAssets.map((asset, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#FAF8F3] dark:bg-slate-900/60 border border-[#E2DEC9] dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-[#7C9885] transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E8F0EA] dark:bg-slate-800 text-[#7C9885] dark:text-emerald-300">
                    {asset.type}
                  </span>
                  <span className="text-[10px] text-[#66756C] dark:text-slate-400">{asset.size}</span>
                </div>
                <h4 className="font-bold text-sm text-[#2D3831] dark:text-slate-100">{asset.title}</h4>
                <p className="text-xs text-[#526157] dark:text-slate-400 leading-relaxed">{asset.desc}</p>
              </div>

              <button
                className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-[#E8E4D5] dark:border-slate-700 text-[#7C9885] dark:text-emerald-400 font-bold text-xs hover:bg-[#7C9885] hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" /> Descargar Archivo
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}