'use client';

import React, { useState, useEffect } from 'react';
import {
  Flame,
  Clock,
  MapPin,
  Users,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  ArrowUpRight,
  Send,
  Compass,
  Award,
  Play,
  Volume2,
  CalendarDays,
  Target,
  Layers,
  HeartHandshake
} from 'lucide-react';

interface CalebForm {
  name: string;
  phone: string;
  age: string;
}

export default function YouthView() {
  const [activeFilter, setActiveFilter] = useState<'todos' | 'comunion' | 'servicio' | 'devocion'>('todos');
  const [joinedCaleb, setJoinedCaleb] = useState(false);
  const [challengeDone, setChallengeDone] = useState(false);
  const [calebForm, setCalebForm] = useState<CalebForm>({ name: '', phone: '', age: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reproductor de música joven simulado
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const playlist = [
    { title: 'Firme en la Tempestad', artist: 'Alabanza JA', duration: '3:45' },
    { title: 'Generación Esperanza', artist: 'Música & Misión', duration: '4:10' },
    { title: 'Brilla en Mí', artist: 'Acústico Hualqui', duration: '3:20' }
  ];

  // Cálculo simple para próximo sábado 18:00 hrs
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 8, minutes: 24 });

  const handleCalebSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!calebForm.name || !calebForm.phone) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setJoinedCaleb(true);
    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 antialiased text-[#2D3831] dark:text-slate-200">
      
      {/* 1. TOP BAR: BANNER DE VANGUARDIA & CONTROLES DE VISTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2DEC9] dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#FAF0E6] dark:bg-amber-950/40 text-[#D08A4D] border border-amber-200/60 dark:border-amber-900/40">
              <Flame className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#7C9885] dark:text-emerald-400">
              Sociedad JA • Distrito Hualqui
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D3831] dark:text-emerald-100 mt-1">
            Espacio Joven Central
          </h1>
        </div>

        {/* Selector de Perspectiva */}
        <div className="flex items-center gap-1.5 p-1 bg-[#E8F0EA]/70 dark:bg-slate-800/80 rounded-2xl border border-[#C5D8CC]/60 dark:border-slate-700 self-start md:self-auto overflow-x-auto max-w-full">
          {[
            { id: 'todos', label: 'Todo el Ecosistema', icon: Layers },
            { id: 'comunion', label: 'Comunión & GP', icon: Users },
            { id: 'servicio', label: 'Acción & Caleb', icon: Compass },
            { id: 'devocion', label: 'Retos & Música', icon: Sparkles }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  active
                    ? 'bg-[#7C9885] text-white shadow-xs'
                    : 'text-[#526157] dark:text-slate-300 hover:bg-[#FAF8F3] dark:hover:bg-slate-700/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. BENTO GRID ASIMÉTRICO */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* BLOQUE PRINCIPAL (Hero Asimétrico con Countdown) */}
        {(activeFilter === 'todos' || activeFilter === 'comunion') && (
          <div className="md:col-span-12 lg:col-span-7 bg-[#2D3831] text-white rounded-3xl p-7 sm:p-9 relative overflow-hidden flex flex-col justify-between shadow-xl min-h-[360px]">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_top_right,_rgba(224,169,109,0.25)_0%,_transparent_70%)] pointer-events-none" />
            
            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md border border-white/15 text-[#E0A96D]">
                <CalendarDays className="w-3.5 h-3.5" /> Próxima Sociedad JA
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold leading-tight">
                Culto Joven: <br />
                <span className="text-[#E0A96D] italic">&ldquo;Raíces Fuertes en Tiempos Líquidos&rdquo;</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
                Una experiencia participativa con música acústica, conversatorios abiertos sobre fe y desafíos de liderazgo.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="flex gap-2 text-center">
                  <div className="bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                    <span className="font-bold text-sm text-[#E0A96D]">{timeLeft.days}d</span>
                  </div>
                  <div className="bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                    <span className="font-bold text-sm text-[#E0A96D]">{timeLeft.hours}h</span>
                  </div>
                  <div className="bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-xs">
                    <span className="font-bold text-sm text-[#E0A96D]">{timeLeft.minutes}m</span>
                  </div>
                </div>
                <span className="text-xs text-slate-300 font-medium">para el inicio</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://chat.whatsapp.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#7C9885] hover:bg-[#6B8774] text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Unirme al Grupo JA
                </a>
              </div>
            </div>
          </div>
        )}

        {/* MINI REPRODUCTOR JA & ACORDES */}
        {(activeFilter === 'todos' || activeFilter === 'devocion') && (
          <div className="md:col-span-6 lg:col-span-5 bg-[#FAF8F3] dark:bg-slate-900/70 border border-[#E2DEC9] dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E8F0EA] dark:bg-slate-800 flex items-center justify-center text-[#7C9885] dark:text-emerald-400">
                  <Volume2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-[#2D3831] dark:text-slate-200 uppercase tracking-wider">
                  Música & Acordes JA
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#7C9885] dark:text-emerald-400 bg-[#E8F0EA] dark:bg-slate-800 px-2 py-0.5 rounded-md">
                Sesión Acústica
              </span>
            </div>

            <div className="my-6 space-y-2">
              <div className="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-[#E8E4D5] dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#2D3831] dark:text-slate-100">
                    {playlist[currentTrackIndex].title}
                  </h4>
                  <p className="text-[11px] text-[#526157] dark:text-slate-400">
                    {playlist[currentTrackIndex].artist} • {playlist[currentTrackIndex].duration}
                  </p>
                </div>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-xl bg-[#7C9885] hover:bg-[#6B8774] text-white flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-xs"
                >
                  <Play className={`w-4 h-4 fill-white ${isPlaying ? 'opacity-80' : ''}`} />
                </button>
              </div>

              {/* Lista pequeña de tracks */}
              <div className="space-y-1 pt-2">
                {playlist.map((track, i) => (
                  <div
                    key={i}
                    onClick={() => setCurrentTrackIndex(i)}
                    className={`px-3 py-2 rounded-xl text-xs flex justify-between items-center cursor-pointer transition-colors ${
                      currentTrackIndex === i
                        ? 'bg-[#E8F0EA] dark:bg-slate-800 text-[#7C9885] dark:text-emerald-300 font-bold'
                        : 'text-[#526157] dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <span>{i + 1}. {track.title}</span>
                    <span className="text-[10px] opacity-75">{track.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href="https://himnarioadventista.org"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#7C9885] dark:text-emerald-400 hover:underline flex items-center justify-center gap-1 text-center pt-2"
            >
              Explorar cancionero con acordes <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* RETO SEMANAL INTERACTIVO */}
        {(activeFilter === 'todos' || activeFilter === 'devocion') && (
          <div className="md:col-span-6 lg:col-span-4 bg-[#FAF0E6]/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-3xl p-6 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-white dark:bg-slate-800 text-[#D08A4D] shadow-2xs">
                  <Award className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D08A4D]">
                  Desafío Semanal
                </span>
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2D3831] dark:text-slate-100">
                &ldquo;Impacta a un amigo hoy&rdquo;
              </h3>
              <p className="text-xs text-[#526157] dark:text-slate-300 leading-relaxed">
                Envía un versículo personalizado a 3 personas que necesiten ánimo y ora por sus metas esta semana.
              </p>
            </div>

            <button
              onClick={() => setChallengeDone(!challengeDone)}
              className={`mt-6 w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                challengeDone
                  ? 'bg-[#7C9885] text-white'
                  : 'bg-[#D08A4D] hover:bg-[#BF7A3D] text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {challengeDone ? '¡Reto Cumplido!' : 'Marcar como Completado'}
            </button>
          </div>
        )}

        {/* GRUPOS PEQUEÑOS EN FORMATO TARJETAS LATERALES */}
        {(activeFilter === 'todos' || activeFilter === 'comunion') && (
          <div className="md:col-span-12 lg:col-span-8 bg-[#FAF8F3] dark:bg-slate-900/70 border border-[#E2DEC9] dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#7C9885] dark:text-emerald-400 uppercase tracking-wider">
                  Comunión en Hogares
                </span>
                <h3 className="text-xl font-serif font-bold text-[#2D3831] dark:text-slate-100">
                  Grupos Pequeños de Jóvenes
                </h3>
              </div>
              <span className="text-xs text-[#66756C] dark:text-slate-400 font-medium">
                Encuentros semanales
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-[#E8E4D5] dark:border-slate-700 space-y-2 hover:border-[#7C9885] transition-colors">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E8F0EA] dark:bg-slate-700 text-[#7C9885] dark:text-emerald-300">
                    15 - 21 AÑOS
                  </span>
                  <a href="https://chat.whatsapp.com" target="_blank" rel="noreferrer" className="text-[#7C9885] hover:text-[#6B8774]">
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
                <h4 className="font-bold text-sm text-[#2D3831] dark:text-slate-200">GP Maranatha</h4>
                <p className="text-[11px] text-[#526157] dark:text-slate-400">Líder: Claudio Morales</p>
                <div className="pt-2 border-t border-[#E8E4D5] dark:border-slate-700 text-[11px] text-[#66756C] dark:text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-[#7C9885]" /> Viernes • 20:00 hrs</div>
                  <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-[#7C9885]" /> La Concepción #450</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-[#E8E4D5] dark:border-slate-700 space-y-2 hover:border-[#7C9885] transition-colors">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E8F0EA] dark:bg-slate-700 text-[#7C9885] dark:text-emerald-300">
                    22 - 30+ AÑOS
                  </span>
                  <a href="https://chat.whatsapp.com" target="_blank" rel="noreferrer" className="text-[#7C9885] hover:text-[#6B8774]">
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
                <h4 className="font-bold text-sm text-[#2D3831] dark:text-slate-200">GP Josué</h4>
                <p className="text-[11px] text-[#526157] dark:text-slate-400">Líder: Priscila & Dilan</p>
                <div className="pt-2 border-t border-[#E8E4D5] dark:border-slate-700 text-[11px] text-[#66756C] dark:text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-[#7C9885]" /> Jueves • 20:30 hrs</div>
                  <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-[#7C9885]" /> Sector Templo</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 3. BLOQUE EXPANDIDO DE MISIÓN CALEB (Layout Horizontal de Impacto) */}
      {(activeFilter === 'todos' || activeFilter === 'servicio') && (
        <div id="caleb" className="rounded-3xl bg-[#E8F0EA]/50 dark:bg-slate-900 border border-[#C5D8CC] dark:border-slate-800 p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-[#7C9885] text-white">
                <Compass className="w-3 h-3" /> Voluntariado Juvenil en Terreno
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D3831] dark:text-emerald-100 leading-tight">
                Misión Caleb Hualqui
              </h2>
              <p className="text-xs sm:text-sm text-[#526157] dark:text-slate-400 leading-relaxed">
                Pasa de la teoría a la acción: limpieza comunitaria, ayuda social directa a adultos mayores y talleres para niños en vacaciones.
              </p>
              <div className="flex gap-4 pt-1 text-xs text-[#2D3831] dark:text-slate-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-[#7C9885]" /> Acción Comunitaria
                </span>
                <span className="flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-[#7C9885]" /> Servicio Social
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white dark:bg-slate-800 border border-[#E8E4D5] dark:border-slate-700 p-6 rounded-2xl shadow-xs">
              {joinedCaleb ? (
                <div className="text-center py-4 space-y-2">
                  <div className="w-10 h-10 bg-[#E8F0EA] text-[#7C9885] dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-[#2D3831] dark:text-slate-100">¡Registro Confirmado!</h4>
                  <p className="text-xs text-[#526157] dark:text-slate-400">
                    Nos pondremos en contacto vía WhatsApp para coordinar tu equipo de misión.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCalebSubmit} className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#7C9885] dark:text-emerald-400">
                    Inscripción de Voluntarios
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Nombre *"
                      required
                      value={calebForm.name}
                      onChange={(e) => setCalebForm({ ...calebForm, name: e.target.value })}
                      className="px-3 py-2 text-xs rounded-xl bg-[#FAF8F3] dark:bg-slate-900 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-200 focus:outline-none focus:border-[#7C9885]"
                    />
                    <input
                      type="tel"
                      placeholder="WhatsApp *"
                      required
                      value={calebForm.phone}
                      onChange={(e) => setCalebForm({ ...calebForm, phone: e.target.value })}
                      className="px-3 py-2 text-xs rounded-xl bg-[#FAF8F3] dark:bg-slate-900 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-200 focus:outline-none focus:border-[#7C9885]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-xl bg-[#7C9885] hover:bg-[#6B8774] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSubmitting ? 'Enviando...' : 'Unirme al Voluntariado Caleb'}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}