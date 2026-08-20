'use client';

import React, { useState } from 'react';
import {
  Heart,
  Home,
  Shield,
  Smile,
  MessageSquareHeart,
  Sparkles,
  Calendar,
  Lock,
  Send,
  CheckCircle2,
  ChevronRight,
  Sun,
  Coffee,
  HelpCircle
} from 'lucide-react';

interface CounselingForm {
  coupleName: string;
  phone: string;
  category: 'matrimonio' | 'crianza' | 'duelo' | 'otro';
  notes: string;
}

export default function FamilyMinistryView() {
  const [activeCategory, setActiveCategory] = useState<'matrimonio' | 'crianza' | 'devocion'>('matrimonio');
  const [counselingDone, setCounselingDone] = useState(false);
  const [form, setForm] = useState<CounselingForm>({
    coupleName: '',
    phone: '',
    category: 'matrimonio',
    notes: ''
  });

  // Estado del Termómetro Familiar Interactivo
  const [selectedPillar, setSelectedPillar] = useState<number>(0);

  const familyPillars = [
    {
      title: 'Culto Familiar Diario',
      subtitle: 'Comunión espiritual en el hogar',
      icon: Sun,
      tip: 'Dedica 15 minutos en la mañana o noche sin pantallas; cantar un himno y leer una historia bíblica fortalece la seguridad emocional de tus hijos.'
    },
    {
      title: 'Comunicación en Pareja',
      subtitle: 'Tiempo intencional a solas',
      icon: Coffee,
      tip: 'Aparta al menos una cita semanal de 30 minutos sin distracciones laborales para hablar sobre sus sentimientos y planes futuros.'
    },
    {
      title: 'Límites con Amor',
      subtitle: 'Crianza bíblica balanceada',
      icon: Shield,
      tip: 'La disciplina efectiva enseña autocontrol y valores, no castiga por frustración. Corrige siempre en privado y con empatía.'
    }
  ];

  const articles = {
    matrimonio: [
      {
        title: 'Los 5 lenguajes del amor en el matrimonio cristiano',
        time: '5 min de lectura',
        desc: 'Cómo identificar y suplir las necesidades emocionales de tu cónyuge según los principios bíblicos.'
      },
      {
        title: 'Resolución pacífica de conflictos en el hogar',
        time: '7 min de lectura',
        desc: 'Estrategias para escuchar activamente y perdonar antes de que se ponga el sol (Efesios 4:26).'
      }
    ],
    crianza: [
      {
        title: 'Cómo blindar a tus hijos frente a la era digital',
        time: '6 min de lectura',
        desc: 'Guía práctica para establecer acuerdos saludables de uso de dispositivos y redes en casa.'
      },
      {
        title: 'Educando hijos con inteligencia emocional y fe',
        time: '4 min de lectura',
        desc: 'Cómo validar sus emociones sin perder la autoridad paternal benevolente.'
      }
    ],
    devocion: [
      {
        title: 'Ideas creativas para el Culto Familiar infantil',
        time: '4 min de lectura',
        desc: 'Dinámicas, dramatizaciones y manualidades para que los niños amen la hora del culto.'
      },
      {
        title: 'La bendición del Sábado en familia',
        time: '5 min de lectura',
        desc: 'Cómo preparar la casa el viernes para recibir las horas sagradas con paz y alegría.'
      }
    ]
  };

  const handleCounselingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.coupleName || !form.phone) return;
    setCounselingDone(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 antialiased text-[#2D3831] dark:text-slate-200">
      
      {/* 1. HERO EDITORIAL CÁLIDO */}
      <div className="relative rounded-3xl bg-[#FAF8F3] dark:bg-slate-900 border border-[#E2DEC9] dark:border-slate-800 p-8 sm:p-12 overflow-hidden shadow-xs">
        <div className="absolute -top-16 -right-16 w-80 h-80 bg-[#E8F0EA] dark:bg-emerald-950/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0EA] dark:bg-slate-800 text-[#7C9885] dark:text-emerald-400 text-xs font-bold uppercase tracking-wider border border-[#C5D8CC]/60 dark:border-slate-700">
            <Home className="w-3.5 h-3.5" /> Ministerio del Hogar y la Familia (MIFAM)
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#2D3831] dark:text-emerald-100 leading-tight">
            Hogares fuertes, <br />
            <span className="text-[#E0A96D] italic">familias sanas</span> y en paz.
          </h1>

          <p className="text-xs sm:text-sm text-[#526157] dark:text-slate-400 leading-relaxed">
            Acompañamos a matrimonios, padres e hijos en cada etapa de la vida mediante principios bíblicos prácticos de convivencia, crianza y restauración emocional.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="#consejeria"
              className="px-5 py-2.5 bg-[#7C9885] hover:bg-[#6B8774] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" /> Solicitar Consejería Privada
            </a>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#66756C] dark:text-slate-400">
              <Sparkles className="w-4 h-4 text-[#E0A96D]" /> Coordinación Pastoral IASD Hualqui
            </div>
          </div>
        </div>
      </div>

      {/* 2. TERMÓMETRO DEL HOGAR (INTERACTIVO 3 PILARES) */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#7C9885] dark:text-emerald-400">
            Diagnóstico Práctico
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#2D3831] dark:text-emerald-100">
            Pilares para un Hogar en Armonía
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Selector de Pilares */}
          <div className="lg:col-span-5 space-y-3">
            {familyPillars.map((p, idx) => {
              const Icon = p.icon;
              const isSelected = selectedPillar === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedPillar(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#E8F0EA] dark:bg-slate-800 border-[#7C9885] shadow-xs'
                      : 'bg-[#FAF8F3] dark:bg-slate-900/60 border-[#E2DEC9] dark:border-slate-800 hover:border-[#7C9885]/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-[#7C9885] text-white' : 'bg-white dark:bg-slate-800 text-[#7C9885] dark:text-emerald-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[#2D3831] dark:text-slate-100">{p.title}</h4>
                      <p className="text-[11px] text-[#526157] dark:text-slate-400">{p.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90 text-[#7C9885]' : 'opacity-40'}`} />
                </div>
              );
            })}
          </div>

          {/* Panel con la Recomendación Activa */}
          <div className="lg:col-span-7 bg-[#FAF8F3] dark:bg-slate-900/60 border border-[#E2DEC9] dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#FAF0E6] dark:bg-amber-950/40 text-[#D08A4D]">
                  Consejo Pastoral & Clínico
                </span>
              </div>
              <h3 className="text-xl font-serif font-bold text-[#2D3831] dark:text-slate-100">
                {familyPillars[selectedPillar].title}
              </h3>
              <p className="text-xs sm:text-sm text-[#526157] dark:text-slate-300 leading-relaxed">
                {familyPillars[selectedPillar].tip}
              </p>
            </div>

            <div className="pt-6 border-t border-[#E8E4D5] dark:border-slate-800 flex items-center justify-between text-xs text-[#66756C] dark:text-slate-400">
              <span>MIFAM Hualqui • Material para la familia</span>
              <span className="font-semibold text-[#7C9885] dark:text-emerald-400">Consejo #0{selectedPillar + 1}</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. GUÍAS Y RECURSOS EN FORMATO REVISTA CÁLIDA */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#7C9885] dark:text-emerald-400">
              Biblioteca Familiar
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#2D3831] dark:text-emerald-100">
              Temas de Orientación
            </h2>
          </div>

          {/* Filtro de Pestañas */}
          <div className="flex gap-1.5 p-1 bg-[#E8F0EA] dark:bg-slate-800/80 rounded-xl border border-[#C5D8CC]/60 dark:border-slate-700 self-start sm:self-auto">
            <button
              onClick={() => setActiveCategory('matrimonio')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategory === 'matrimonio'
                  ? 'bg-[#7C9885] text-white shadow-xs'
                  : 'text-[#526157] dark:text-slate-300 hover:text-[#2D3831]'
              }`}
            >
              Matrimonio
            </button>
            <button
              onClick={() => setActiveCategory('crianza')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategory === 'crianza'
                  ? 'bg-[#7C9885] text-white shadow-xs'
                  : 'text-[#526157] dark:text-slate-300 hover:text-[#2D3831]'
              }`}
            >
              Crianza & Hijos
            </button>
            <button
              onClick={() => setActiveCategory('devocion')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeCategory === 'devocion'
                  ? 'bg-[#7C9885] text-white shadow-xs'
                  : 'text-[#526157] dark:text-slate-300 hover:text-[#2D3831]'
              }`}
            >
              Culto Familiar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {articles[activeCategory].map((art, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-[#E2DEC9] dark:border-slate-800 space-y-3 hover:border-[#7C9885] transition-all shadow-2xs group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[#7C9885] dark:text-emerald-400 uppercase tracking-wider">
                  {art.time}
                </span>
                <h3 className="font-serif font-bold text-base text-[#2D3831] dark:text-slate-100 group-hover:text-[#7C9885] transition-colors">
                  {art.title}
                </h3>
                <p className="text-xs text-[#526157] dark:text-slate-400 leading-relaxed">
                  {art.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E8E4D5] dark:border-slate-800 flex items-center text-xs font-bold text-[#7C9885] dark:text-emerald-400 gap-1 cursor-pointer">
                Leer artículo completo <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. SECCIÓN DE CONSEJERÍA PASTORAL DISCRETA (CTA Formulario Privado) */}
      <div id="consejeria" className="rounded-3xl bg-[#FAF8F3] dark:bg-slate-900/70 border border-[#E2DEC9] dark:border-slate-800 p-6 sm:p-10 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-[#E8F0EA] dark:bg-slate-800 text-[#7C9885] dark:text-emerald-400">
              <Lock className="w-3 h-3" /> Atención Confidencial
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D3831] dark:text-emerald-100 leading-tight">
              Orientación y Consejería Familiar
            </h3>
            <p className="text-xs sm:text-sm text-[#526157] dark:text-slate-400 leading-relaxed">
              Si tú o tu familia están atravesando un momento de crisis, desacuerdo matrimonial o duelo, nuestro equipo pastoral y líderes de familia están disponibles para orar y orientarles en estricta reserva.
            </p>
            <div className="text-[11px] text-[#66756C] dark:text-slate-500 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#7C9885]" /> Total privacidad y confidencialidad garantizada.
            </div>
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-slate-800 border border-[#E8E4D5] dark:border-slate-700 p-6 rounded-2xl shadow-xs">
            {counselingDone ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#E8F0EA] dark:bg-emerald-950/60 text-[#7C9885] dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-base text-[#2D3831] dark:text-slate-100">
                  Solicitud Enviada con Éxito
                </h4>
                <p className="text-xs text-[#526157] dark:text-slate-400 max-w-sm mx-auto">
                  El Pastor o el Director de Hogar y Familia se comunicará discretamente a tu número de contacto.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCounselingSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#66756C] dark:text-slate-400">
                      Nombre o Familia *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Familia Morales"
                      value={form.coupleName}
                      onChange={(e) => setForm({ ...form, coupleName: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#FAF8F3] dark:bg-slate-900 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-200 focus:outline-none focus:border-[#7C9885]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#66756C] dark:text-slate-400">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+56 9 1234 5678"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#FAF8F3] dark:bg-slate-900 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-200 focus:outline-none focus:border-[#7C9885]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#66756C] dark:text-slate-400">
                    Área Principal de Consulta
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#FAF8F3] dark:bg-slate-900 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-200 focus:outline-none focus:border-[#7C9885]"
                  >
                    <option value="matrimonio">Orientación Matrimonial</option>
                    <option value="crianza">Crianza y Relación con Hijos</option>
                    <option value="duelo">Duelo o Pérdida Familiar</option>
                    <option value="otro">Oración y Acompañamiento Espiritual</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#66756C] dark:text-slate-400">
                    Mensaje / Motivo Breve (Opcional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Escribe brevemente tu inquietud..."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#FAF8F3] dark:bg-slate-900 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-200 focus:outline-none focus:border-[#7C9885] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#7C9885] hover:bg-[#6B8774] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                >
                  <Send className="w-3.5 h-3.5" /> Enviar Solicitud Reservada
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}