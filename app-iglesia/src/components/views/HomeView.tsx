'use client';

import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  BookOpen, 
  FileText, 
  Music, 
  Play, 
  ArrowRight,
  Sparkles,
  Flame,
  MessageCircle
} from 'lucide-react';
import { SERVICE_SCHEDULES } from '@/data/mockData';

interface HomeViewProps {
  navigateTo: (page: string) => void;
  setBulletinModalOpen?: (open: boolean) => void;
}

export function HomeView({ navigateTo, setBulletinModalOpen }: HomeViewProps) {
  // Datos mock para eventos destacados del Home (máximo 3 para no saturar)
  const upcomingEvents = [
    {
      id: '1',
      title: 'Sociedad de Jóvenes (JA)',
      date: 'Sábado, 18:30 hrs',
      location: 'Templo Central',
      badge: 'Jóvenes'
    },
    {
      id: '2',
      title: 'Semana de Oración Familiar',
      date: 'Miércoles a Viernes, 20:00 hrs',
      location: 'Templo & Online',
      badge: 'Especial'
    },
    {
      id: '3',
      title: 'Culto de Adoración Sabática',
      date: 'Sábado, 10:45 hrs',
      location: 'Templo Central',
      badge: 'Culto'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-12 antialiased">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#2D3831] via-[#1E2621] to-[#141A16] text-white px-6 py-20 sm:py-28 text-center shadow-xl">
        {/* Glow decorativo sutil de fondo */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,152,133,0.25)_0%,_transparent_65%)] pointer-events-none" />
        
        <div className="relative max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#7C9885]/20 border border-[#7C9885]/30 text-emerald-200 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" /> Bienvenido a Casa
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-white leading-tight">
            Un lugar para <br className="hidden sm:inline" />
            <span className="text-[#E0A96D] italic">crecer en fe</span> y comunidad
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Somos una iglesia apasionada por proclamar el evangelio eterno, la adoración en espíritu y el servicio mutuo en Hualqui.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <button
              onClick={() => {
                const el = document.getElementById('horarios-cultos');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-6 py-3 bg-[#E0A96D] hover:bg-[#D09657] text-[#2D3831] font-bold text-xs sm:text-sm rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              Planifica tu visita
            </button>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl backdrop-blur-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" /> Ver Online
            </a>
          </div>
        </div>
      </section>

      {/* 2. PRÓXIMO CULTO & HORARIOS */}
      <section id="horarios-cultos" className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-stretch gap-6 bg-[#FAF8F3] dark:bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-[#E2DEC9] dark:border-slate-800 shadow-xs">
          
          <div className="md:w-1/3 flex flex-col justify-between space-y-4 border-b md:border-b-0 md:border-r border-[#E2DEC9] dark:border-slate-800 pb-6 md:pb-0 md:pr-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#7C9885] dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Horarios de Adoración
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#2D3831] dark:text-emerald-100">
                Únete a nuestros cultos
              </h2>
              <p className="text-xs text-[#526157] dark:text-slate-400 leading-relaxed">
                Nuestras puertas están siempre abiertas para adorar juntos cada semana.
              </p>
            </div>
            <div className="text-[11px] text-[#66756C] dark:text-slate-500 font-medium">
              📍 Bulnes #450, Hualqui
            </div>
          </div>

          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICE_SCHEDULES.map((schedule) => (
              <div 
                key={schedule.id}
                className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-[#E8E4D5] dark:border-slate-700/80 space-y-1.5"
              >
                <span className="text-[10px] font-bold text-[#7C9885] dark:text-emerald-400 uppercase tracking-widest">
                  {schedule.day}
                </span>
                <h3 className="font-bold text-sm text-[#2D3831] dark:text-slate-200">
                  {schedule.name}
                </h3>
                <p className="text-xs text-[#526157] dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#7C9885]" /> {schedule.time} hrs
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. ACCESOS RÁPIDOS DIARIOS (Recursos clave para los miembros) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-xs font-bold text-[#7C9885] dark:text-emerald-400 uppercase tracking-widest">
            Recursos Espirituales
          </h2>
          <p className="text-2xl font-serif font-bold text-[#2D3831] dark:text-emerald-100">
            Estudio y adoración diaria
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card: Lección Diaria */}
          <div 
            onClick={() => navigateTo('leccion')}
            className="group bg-[#FAF8F3] dark:bg-slate-900/60 p-6 rounded-2xl border border-[#E2DEC9] dark:border-slate-800 hover:border-[#7C9885] dark:hover:border-emerald-500/50 transition-all cursor-pointer space-y-4"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E8F0EA] dark:bg-slate-800 flex items-center justify-center text-[#7C9885] dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-[#2D3831] dark:text-slate-100 group-hover:text-[#7C9885] dark:group-hover:text-emerald-400 transition-colors">
                Lección de Escuela Sabática
              </h3>
              <p className="text-xs text-[#526157] dark:text-slate-400 leading-relaxed">
                Estudio diario de la palabra de Dios para toda la familia.
              </p>
            </div>
          </div>

          {/* Card: Boletín Sabático */}
          <div 
            onClick={() => setBulletinModalOpen ? setBulletinModalOpen(true) : navigateTo('boletin')}
            className="group bg-[#FAF8F3] dark:bg-slate-900/60 p-6 rounded-2xl border border-[#E2DEC9] dark:border-slate-800 hover:border-[#7C9885] dark:hover:border-emerald-500/50 transition-all cursor-pointer space-y-4"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E8F0EA] dark:bg-slate-800 flex items-center justify-center text-[#7C9885] dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-[#2D3831] dark:text-slate-100 group-hover:text-[#7C9885] dark:group-hover:text-emerald-400 transition-colors">
                Boletín Sabático
              </h3>
              <p className="text-xs text-[#526157] dark:text-slate-400 leading-relaxed">
                Orden de culto, avisos importantes y anuncios de la semana.
              </p>
            </div>
          </div>

          {/* Card: Himnario */}
          <div 
            onClick={() => navigateTo('himnario')}
            className="group bg-[#FAF8F3] dark:bg-slate-900/60 p-6 rounded-2xl border border-[#E2DEC9] dark:border-slate-800 hover:border-[#7C9885] dark:hover:border-emerald-500/50 transition-all cursor-pointer space-y-4"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E8F0EA] dark:bg-slate-800 flex items-center justify-center text-[#7C9885] dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <Music className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-[#2D3831] dark:text-slate-100 group-hover:text-[#7C9885] dark:group-hover:text-emerald-400 transition-colors">
                Himnario Adventista
              </h3>
              <p className="text-xs text-[#526157] dark:text-slate-400 leading-relaxed">
                Cantos de alabanza y adoración con letras completas.
              </p>
            </div>
          </div>

          {/* Card: Jóvenes JA */}
          <div 
            onClick={() => navigateTo('jovenes')}
            className="group bg-[#FAF8F3] dark:bg-slate-900/60 p-6 rounded-2xl border border-[#E2DEC9] dark:border-slate-800 hover:border-[#7C9885] dark:hover:border-emerald-500/50 transition-all cursor-pointer space-y-4"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E8F0EA] dark:bg-slate-800 flex items-center justify-center text-[#7C9885] dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <Flame className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-[#2D3831] dark:text-slate-100 group-hover:text-[#7C9885] dark:group-hover:text-emerald-400 transition-colors">
                Ministerio Joven (JA)
              </h3>
              <p className="text-xs text-[#526157] dark:text-slate-400 leading-relaxed">
                Actividades, proyectos comunitarios y sociedad de jóvenes.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. EVENTOS PRÓXIMOS / AGENDA CORTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xs font-bold text-[#7C9885] dark:text-emerald-400 uppercase tracking-widest">
              Comunidad Activa
            </h2>
            <h3 className="text-2xl font-serif font-bold text-[#2D3831] dark:text-emerald-100">
              Próximos Eventos
            </h3>
          </div>
          <button 
            onClick={() => navigateTo('agenda')}
            className="text-xs font-semibold text-[#7C9885] dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            Ver toda la agenda <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {upcomingEvents.map((ev) => (
            <div 
              key={ev.id}
              className="bg-white dark:bg-slate-900/60 p-5 rounded-2xl border border-[#E2DEC9] dark:border-slate-800 flex flex-col justify-between space-y-4 shadow-2xs"
            >
              <div className="space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F0EA] dark:bg-slate-800 text-[#7C9885] dark:text-emerald-400 border border-[#C5D8CC]/50">
                  {ev.badge}
                </span>
                <h4 className="font-bold text-sm text-[#2D3831] dark:text-slate-200">
                  {ev.title}
                </h4>
              </div>

              <div className="space-y-1 text-xs text-[#526157] dark:text-slate-400 border-t border-[#E8E4D5] dark:border-slate-800 pt-3">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#7C9885]" />
                  <span>{ev.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#7C9885]" />
                  <span>{ev.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CONTACTO Y UBICACIÓN RÁPIDA (CTA Final) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-[#E8F0EA] dark:bg-slate-800/60 border border-[#C5D8CC] dark:border-slate-700 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-serif font-bold text-[#2D3831] dark:text-emerald-100">
              ¿Te gustaría estudiar la Biblia o pedir oración?
            </h3>
            <p className="text-xs sm:text-sm text-[#526157] dark:text-slate-400 max-w-xl">
              Estamos a tu disposición para acompañarte espiritualmente y responder tus dudas sobre la fe.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => navigateTo('estudios-biblicos')}
              className="px-5 py-2.5 bg-[#7C9885] hover:bg-[#6B8774] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer text-center"
            >
              Solicitar Estudio Bíblico
            </button>
            <a
              href="https://wa.me/56912345678"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 bg-white dark:bg-slate-700 border border-[#DCD7C5] dark:border-slate-600 text-[#2D3831] dark:text-slate-200 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4 text-[#7C9885] dark:text-emerald-400" /> WhatsApp Pastoral
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}