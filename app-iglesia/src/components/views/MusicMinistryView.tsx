'use client';

import React, { useState } from 'react';
import {
  Music,
  Mic2,
  Calendar,
  Clock,
  Sparkles,
  Download,
  Send,
  CheckCircle2,
  Volume2,
  FileMusic,
  Headphones,
  Users,
  Play,
  Heart
} from 'lucide-react';

interface SpecialItemForm {
  performerName: string;
  songTitle: string;
  serviceType: 'culto-divino' | 'sociedad-ja' | 'culto-oracion';
  performanceType: 'canto' | 'instrumental' | 'grupo';
  date: string;
  phone: string;
  needsTrack: boolean;
}

export default function MusicMinistryView() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [form, setForm] = useState<SpecialItemForm>({
    performerName: '',
    songTitle: '',
    serviceType: 'culto-divino',
    performanceType: 'canto',
    date: '',
    phone: '',
    needsTrack: false
  });

  const rehearsals = [
    {
      group: 'Coro Central Hualqui',
      director: 'Hna. Marcela Reyes',
      day: 'Sábados',
      time: '16:30 hrs',
      location: 'Nave Central del Templo',
      badge: 'Coral'
    },
    {
      group: 'Equipo de Alabanza Congregacional',
      director: 'Claudio Morales',
      day: 'Viernes',
      time: '19:30 hrs',
      location: 'Sala de Música',
      badge: 'Alabanza'
    },
    {
      group: 'Ensamble Juvenil JA',
      director: 'Directiva JA',
      day: 'Sábados',
      time: '17:15 hrs',
      location: 'Salón Juvenil',
      badge: 'Acústico'
    }
  ];

  const sheetMusicAssets = [
    {
      title: 'Cantos de Apertura & Doxología',
      format: 'PDF / Partitura Coral',
      size: '3.4 MB',
      type: 'Coro'
    },
    {
      title: 'Cifrados & Acordes Himnario Joven',
      format: 'PDF / Letras y Acordes',
      size: '18.1 MB',
      type: 'Guitarra / Piano'
    },
    {
      title: 'Pack de Pistas Oficiales IASD',
      format: 'Audio MP3 / HQ',
      size: '85.6 MB',
      type: 'Pistas'
    }
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.performerName || !form.songTitle || !form.date || !form.phone) return;
    setFormSubmitted(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 antialiased text-[#2D3831] dark:text-slate-200">
      
      {/* 1. HERO CONSOLA DE ADORACIÓN */}
      <div className="rounded-3xl bg-gradient-to-b from-[#2D3831] via-[#1E2621] to-[#141A16] text-white p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_top_right,_rgba(124,152,133,0.3)_0%,_transparent_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7C9885]/20 border border-[#7C9885]/30 text-emerald-200 text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
            <Music className="w-3.5 h-3.5 text-[#E0A96D]" /> Ministerio de Música & Alabanza
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
            Adoración en espíritu, verdad y <br className="hidden sm:inline" />
            <span className="text-[#E0A96D] italic">excelencia musical</span>.
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            La música sacra eleva el alma a la presencia de Dios. Coordinamos los himnos congregacionales, coros, instrumentos y partes especiales para cada servicio de culto.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#solicitar-canto"
              className="px-5 py-2.5 bg-[#7C9885] hover:bg-[#6B8774] text-white font-bold text-xs rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Mic2 className="w-4 h-4" /> Inscribir Canto / Parte Especial
            </a>
            <a
              href="#ensayos"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs rounded-xl backdrop-blur-sm transition-colors cursor-pointer"
            >
              Horarios de Ensayo
            </a>
          </div>
        </div>
      </div>

      {/* 2. SOLICITUD DE CANTO & CRONOGRAMA DE ENSAYOS (SPLIT 7 / 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Formulario de Registro de Parte Especial (7 Cols) */}
        <div id="solicitar-canto" className="lg:col-span-7 bg-[#FAF8F3] dark:bg-slate-900/60 border border-[#E2DEC9] dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-1 border-b border-[#E2DEC9] dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7C9885] dark:text-emerald-400">
              <Mic2 className="w-4 h-4" /> Participación en el Culto
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#2D3831] dark:text-emerald-100">
              Inscripción de Parte Especial
            </h2>
            <p className="text-xs text-[#526157] dark:text-slate-400">
              Registra tu participación para el Culto Divino o Sociedad JA (sujeto a coordinación de la comisión de música).
            </p>
          </div>

          {formSubmitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#E8F0EA] dark:bg-emerald-950/60 text-[#7C9885] dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2D3831] dark:text-slate-100">
                ¡Solicitud de Participación Registrada!
              </h3>
              <p className="text-xs text-[#526157] dark:text-slate-400 max-w-sm mx-auto">
                El director de música se pondrá en contacto contigo para confirmar la fecha y coordinar la prueba de sonido previa.
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="mt-2 text-xs font-bold text-[#7C9885] dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Inscribir otra parte especial
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#66756C] dark:text-slate-400">
                    Solista / Coro / Grupo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Trío Esperanza o Familia Morales"
                    value={form.performerName}
                    onChange={(e) => setForm({ ...form, performerName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-200 focus:outline-none focus:border-[#7C9885]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#66756C] dark:text-slate-400">
                    Título del Canto o Himno *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Castillo Fuerte o Sublime Gracia"
                    value={form.songTitle}
                    onChange={(e) => setForm({ ...form, songTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-200 focus:outline-none focus:border-[#7C9885]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#66756C] dark:text-slate-400">
                    Servicio
                  </label>
                  <select
                    value={form.serviceType}
                    onChange={(e) => setForm({ ...form, serviceType: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-200 focus:outline-none focus:border-[#7C9885]"
                  >
                    <option value="culto-divino">Culto Divino (Sábado Mañana)</option>
                    <option value="sociedad-ja">Sociedad JA (Sábado Tarde)</option>
                    <option value="culto-oracion">Culto de Oración (Miércoles)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#66756C] dark:text-slate-400">
                    Tipo de Ejecución
                  </label>
                  <select
                    value={form.performanceType}
                    onChange={(e) => setForm({ ...form, performanceType: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-200 focus:outline-none focus:border-[#7C9885]"
                  >
                    <option value="canto">Canto Solista / Dúo</option>
                    <option value="instrumental">Instrumental (Violín, Piano, etc.)</option>
                    <option value="grupo">Grupo Vocal / Coro</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#66756C] dark:text-slate-400">
                    Fecha Propuesta *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-200 focus:outline-none focus:border-[#7C9885]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
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

                <label className="flex items-center gap-2 text-xs text-[#526157] dark:text-slate-300 font-semibold cursor-pointer pt-4">
                  <input
                    type="checkbox"
                    checked={form.needsTrack}
                    onChange={(e) => setForm({ ...form, needsTrack: e.target.checked })}
                    className="rounded border-[#DCD7C5] text-[#7C9885] focus:ring-[#7C9885] w-4 h-4"
                  />
                  <span>Requiere pista musical desde la cabina de audio</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#7C9885] hover:bg-[#6B8774] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Send className="w-3.5 h-3.5" /> Enviar Solicitud a Comisión de Música
              </button>
            </form>
          )}
        </div>

        {/* Cronograma de Ensayos (5 Cols) */}
        <div id="ensayos" className="lg:col-span-5 space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#7C9885] dark:text-emerald-400">
              Preparación y Ensayo
            </span>
            <h3 className="text-xl font-serif font-bold text-[#2D3831] dark:text-emerald-100">
              Horarios Semanales
            </h3>
          </div>

          <div className="space-y-3">
            {rehearsals.map((r, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-[#FAF8F3] dark:bg-slate-900/60 border border-[#E2DEC9] dark:border-slate-800 space-y-2 hover:border-[#7C9885] transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E8F0EA] dark:bg-slate-800 text-[#7C9885] dark:text-emerald-300">
                    {r.badge}
                  </span>
                  <span className="text-xs font-bold text-[#2D3831] dark:text-slate-100 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#7C9885]" /> {r.day} • {r.time}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-[#2D3831] dark:text-slate-100">{r.group}</h4>
                <p className="text-[11px] text-[#526157] dark:text-slate-400">Director: {r.director}</p>
                <p className="text-[10px] text-[#66756C] dark:text-slate-500">📍 {r.location}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. DESCARGAS & MATERIAL PARA MÚSICOS */}
      <div className="space-y-4 pt-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#7C9885] dark:text-emerald-400">
            Recursos para Adoradores
          </span>
          <h3 className="text-2xl font-serif font-bold text-[#2D3831] dark:text-emerald-100">
            Partituras, Acordes & Pistas Oficiales
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sheetMusicAssets.map((asset, idx) => (
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
                <p className="text-xs text-[#526157] dark:text-slate-400">{asset.format}</p>
              </div>

              <button
                className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-[#E8E4D5] dark:border-slate-700 text-[#7C9885] dark:text-emerald-400 font-bold text-xs hover:bg-[#7C9885] hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" /> Descargar Material
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}