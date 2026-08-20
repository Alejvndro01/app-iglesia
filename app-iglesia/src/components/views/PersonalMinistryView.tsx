'use client';

import React, { useState } from 'react';
import {
  HeartHandshake,
  BookOpen,
  Send,
  Users,
  Target,
  Download,
  Share2,
  CheckCircle2,
  Sparkles,
  MapPin,
  Calendar,
  PhoneCall,
  Flame,
  ArrowRight
} from 'lucide-react';

interface StudyRequestForm {
  studentName: string;
  phone: string;
  topic: string;
  modality: 'presencial' | 'online';
}

export default function PersonalMinistryView() {
  const [activeTab, setActiveTab] = useState<'dar' | 'recibir'>('dar');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState<StudyRequestForm>({
    studentName: '',
    phone: '',
    topic: 'La Fe y la Esperanza',
    modality: 'presencial'
  });

  const missionMetrics = [
    { label: 'Estudios Activos', value: '42', desc: 'En toda la comuna' },
    { label: 'Parejas Misioneras', value: '18', desc: 'Capacitadas y en terreno' },
    { label: 'Bautismos este Trimestre', value: '7', desc: 'Nuevos discípulos' }
  ];

  const missionMaterials = [
    {
      title: 'Guía "La Fe de Jesús"',
      category: 'Estudio Fundamental',
      lessons: '20 Lecciones',
      format: 'PDF Digital',
      badge: 'Básico'
    },
    {
      title: 'Manual de Parejas Misioneras',
      category: 'Capacitación',
      lessons: '8 Módulos',
      format: 'Guía Práctica',
      badge: 'Liderazgo'
    },
    {
      title: 'Esperanza en Tiempos de Crisis',
      category: 'Folleto Rápido',
      lessons: '4 Encuentros',
      format: 'Imprimible',
      badge: 'Comunitario'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.phone) return;
    setFormSubmitted(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 antialiased text-[#2D3831] dark:text-slate-200">
      
      {/* 1. HEADER EDITORIAL CON PROPÓSITO MISIONERO */}
      <div className="border-b border-[#E2DEC9] dark:border-slate-800 pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F0EA] dark:bg-slate-800 text-[#7C9885] dark:text-emerald-400 text-xs font-bold uppercase tracking-wider border border-[#C5D8CC]/60 dark:border-slate-700">
              <HeartHandshake className="w-3.5 h-3.5" /> Ministerio Personal & Evangelismo
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#2D3831] dark:text-emerald-100 tracking-tight">
              Cada miembro un <span className="text-[#E0A96D] italic">misionero</span>, cada hogar una iglesia.
            </h1>
            <p className="text-xs sm:text-sm text-[#526157] dark:text-slate-400 leading-relaxed">
              Equipamos, motivamos y acompañamos a la hermandad para llevar el mensaje de esperanza mediante parejas misioneras y discipulado bíblico directo.
            </p>
          </div>

          {/* Banner de Impacto Rápido */}
          <div className="flex items-center gap-4 bg-[#FAF8F3] dark:bg-slate-900/80 p-4 rounded-2xl border border-[#E2DEC9] dark:border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-[#7C9885] text-white flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#7C9885] dark:text-emerald-400">
                Meta Distrital
              </div>
              <div className="font-bold text-sm text-[#2D3831] dark:text-slate-100">
                100 Nuevos Estudios Bíblicos
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DASHBOARD DE ACCIÓN MISIONERA (SPLIT 5 / 7) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Columna Izquierda: Métricas & Formación de Parejas */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Métricas Visuales */}
          <div className="grid grid-cols-3 gap-3">
            {missionMetrics.map((m, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#FAF8F3] dark:bg-slate-900/60 border border-[#E2DEC9] dark:border-slate-800 text-center space-y-1">
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#7C9885] dark:text-emerald-400">{m.value}</div>
                <div className="text-[11px] font-bold text-[#2D3831] dark:text-slate-200 leading-tight">{m.label}</div>
                <div className="text-[9px] text-[#66756C] dark:text-slate-400">{m.desc}</div>
              </div>
            ))}
          </div>

          {/* Tarjeta de Formación Misionera */}
          <div className="p-6 rounded-3xl bg-[#2D3831] text-white space-y-4 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_top_right,_rgba(124,152,133,0.3)_0%,_transparent_70%)] pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#E0A96D]">Capacitación Continua</span>
              <Sparkles className="w-4 h-4 text-[#E0A96D]" />
            </div>
            <h3 className="text-xl font-serif font-bold relative z-10">
              Escuela de Parejas Misioneras
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed relative z-10">
              Aprende cómo iniciar conversaciones espirituales, utilizar la Biblia de manera pedagógica y cerrar estudios con llamados claros.
            </p>
            <div className="pt-2 flex items-center gap-3 relative z-10">
              <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold">
                <Calendar className="w-3.5 h-3.5" /> Cada 1er Sábado • 16:30 hrs
              </div>
            </div>
          </div>

          {/* Contacto Directo con el Director de Ministerio Personal */}
          <div className="p-5 rounded-2xl bg-[#FAF8F3] dark:bg-slate-900/60 border border-[#E2DEC9] dark:border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-[#2D3831] dark:text-slate-200">Director: Hno. Mauricio Tapia</div>
              <div className="text-[11px] text-[#526157] dark:text-slate-400">Coordinación de parejas y territorios</div>
            </div>
            <a
              href="https://wa.me/56912345678"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-[#E8F0EA] dark:bg-slate-800 text-[#7C9885] dark:text-emerald-400 hover:bg-[#7C9885] hover:text-white transition-colors"
              title="Contactar vía WhatsApp"
            >
              <PhoneCall className="w-4 h-4" />
            </a>
          </div>

        </div>

        {/* Columna Derecha: Hub de Solicitud y Registro de Estudios */}
        <div className="lg:col-span-7 bg-[#FAF8F3] dark:bg-slate-900/60 border border-[#E2DEC9] dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DEC9] dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-serif font-bold text-[#2D3831] dark:text-emerald-100">
                Registro de Estudio Bíblico
              </h3>
              <p className="text-xs text-[#526157] dark:text-slate-400">
                Conecta a una persona interesada con un instructor bíblico de la iglesia.
              </p>
            </div>

            <div className="flex gap-1 p-1 bg-[#E8F0EA] dark:bg-slate-800 rounded-xl border border-[#C5D8CC]/60 dark:border-slate-700 self-start sm:self-auto">
              <button
                onClick={() => setActiveTab('dar')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'dar'
                    ? 'bg-[#7C9885] text-white shadow-xs'
                    : 'text-[#526157] dark:text-slate-300'
                }`}
              >
                Inscribir Interesado
              </button>
              <button
                onClick={() => setActiveTab('recibir')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'recibir'
                    ? 'bg-[#7C9885] text-white shadow-xs'
                    : 'text-[#526157] dark:text-slate-300'
                }`}
              >
                Quiero Ser Instructor
              </button>
            </div>
          </div>

          {formSubmitted ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#E8F0EA] dark:bg-emerald-950/60 text-[#7C9885] dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-lg text-[#2D3831] dark:text-slate-100">
                ¡Solicitud Registrada en el Sistema!
              </h4>
              <p className="text-xs text-[#526157] dark:text-slate-400 max-w-sm mx-auto">
                El equipo de Ministerio Personal coordinará la entrega de guías de estudio y el contacto inicial.
              </p>
              <button
                onClick={() => setFormSubmitted(false)}
                className="mt-2 text-xs font-bold text-[#7C9885] dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Registrar otro estudio
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#66756C] dark:text-slate-400">
                    {activeTab === 'dar' ? 'Nombre del Amigo / Familiar *' : 'Tu Nombre Completo *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Juan Pérez"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-200 focus:outline-none focus:border-[#7C9885]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#66756C] dark:text-slate-400">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+56 9 1234 5678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-200 focus:outline-none focus:border-[#7C9885]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#66756C] dark:text-slate-400">
                    Serie de Estudio
                  </label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-200 focus:outline-none focus:border-[#7C9885]"
                  >
                    <option value="La Fe de Jesús">La Fe de Jesús (Doctrinal completo)</option>
                    <option value="Esperanza Viva">Esperanza Viva (Profecías y Actualidad)</option>
                    <option value="Sentimientos y Salud">Salud Emocional & Esperanza</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#66756C] dark:text-slate-400">
                    Preferencia de Modalidad
                  </label>
                  <div className="flex gap-2 pt-0.5">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, modality: 'presencial' })}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        formData.modality === 'presencial'
                          ? 'bg-[#E8F0EA] dark:bg-slate-800 border-[#7C9885] text-[#7C9885] dark:text-emerald-300'
                          : 'border-[#DCD7C5] dark:border-slate-700 text-[#66756C] dark:text-slate-400'
                      }`}
                    >
                      Presencial
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, modality: 'online' })}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        formData.modality === 'online'
                          ? 'bg-[#E8F0EA] dark:bg-slate-800 border-[#7C9885] text-[#7C9885] dark:text-emerald-300'
                          : 'border-[#DCD7C5] dark:border-slate-700 text-[#66756C] dark:text-slate-400'
                      }`}
                    >
                      Online / Video
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#7C9885] hover:bg-[#6B8774] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Send className="w-3.5 h-3.5" />
                {activeTab === 'dar' ? 'Registrar y Asignar Pareja Misionera' : 'Inscribirme como Instructor Bíblico'}
              </button>
            </form>
          )}

        </div>

      </div>

      {/* 3. RECURSOS Y GUÍAS DE DISCIPULADO EN FILA DIRECTA */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#7C9885] dark:text-emerald-400">
              Material de Apoyo
            </span>
            <h3 className="text-2xl font-serif font-bold text-[#2D3831] dark:text-emerald-100">
              Guías de Discipulado Descargables
            </h3>
          </div>
          <span className="text-xs text-[#66756C] dark:text-slate-400 font-medium">
            Formato oficial IASD
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {missionMaterials.map((mat, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-[#FAF8F3] dark:bg-slate-900/60 border border-[#E2DEC9] dark:border-slate-800 flex items-center justify-between hover:border-[#7C9885] transition-all group"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E8F0EA] dark:bg-slate-800 text-[#7C9885] dark:text-emerald-300">
                  {mat.badge}
                </span>
                <h4 className="font-bold text-sm text-[#2D3831] dark:text-slate-100 group-hover:text-[#7C9885] transition-colors">
                  {mat.title}
                </h4>
                <p className="text-[11px] text-[#526157] dark:text-slate-400">
                  {mat.lessons} • {mat.format}
                </p>
              </div>

              <button
                title="Descargar Material"
                className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-[#E8E4D5] dark:border-slate-700 flex items-center justify-center text-[#7C9885] dark:text-emerald-400 hover:bg-[#7C9885] hover:text-white transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}