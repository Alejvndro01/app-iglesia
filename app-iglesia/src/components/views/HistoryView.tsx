'use client';

import React, { useState } from 'react';
import { 
  Church, 
  MapPin, 
  Sparkles, 
  Users, 
  Calendar, 
  Heart, 
  Compass, 
  ShieldCheck, 
  BookOpen, 
  ArrowRight,
  Flame,
  Globe2,
  Scroll,
  Award,
  LucideIcon
} from 'lucide-react';

// --- DEFINICIONES DE TIPOS (CLEAN ARCHITECTURE) ---
type PillarKey = 'mision' | 'vision' | 'santuario' | 'sabado' | 'esperanza';

interface Pioneer {
  name: string;
  role: string;
  period: string;
  contribution: string;
  quote: string;
}

interface TimelineItem {
  year: string;
  scope: 'global' | 'local';
  title: string;
  desc: string;
}

interface HistoryViewProps {
  navigateTo?: (page: string) => void;
}

// --- CONSTANTES MODULARIZADAS FUERA DEL CICLO DE RENDER ---
const PIONEERS_DATA: Pioneer[] = [
  {
    name: 'Elena G. de White',
    role: 'Mensajera del Señor y Escritora',
    period: '1827 – 1915',
    contribution: 'Orientación profética fundamental para la organización eclesial, el sistema de salud y la educación adventista a nivel global.',
    quote: 'No tenemos nada que temer del futuro, a menos que olvidemos la manera en que el Señor nos ha conducido.'
  },
  {
    name: 'José Bates',
    role: 'Pionero del Sábado y Co-Fundador',
    period: '1792 – 1872',
    contribution: 'Capitán de marina retirado que integró la observancia del Santo Sábado con el mensaje de la tercera hora profética.',
    quote: 'Las buenas nuevas son que el séptimo día sigue siendo el reposo del Señor nuestro Dios.'
  },
  {
    name: 'Guillermo Miller',
    role: 'Líder del Movimiento Adventista',
    period: '1782 – 1849',
    contribution: 'Estudioso riguroso de las profecías de Daniel y Apocalipsis que reavivó la esperanza milenial en el siglo XIX.',
    quote: 'Mi corazón ardía con la convicción del pronto regreso de nuestro Redentor.'
  }
];

const TIMELINE_DATA: TimelineItem[] = [
  {
    year: '1844',
    scope: 'global',
    title: 'El Gran Chasco e Investigación Profética',
    desc: 'El movimiento millerita profundiza en Daniel 8:14, redescubriendo el ministerio sacerdotal de Cristo en el Santuario Celestial.'
  },
  {
    year: '1863',
    scope: 'global',
    title: 'Organización de la Conferencia General',
    desc: 'Se funda formalmente la Iglesia Adventista del Séptimo Día en Battle Creek, Michigan, adoptando un plan de publicaciones y salud.'
  },
  {
    year: '1894',
    scope: 'global',
    title: 'Llegada del Mensaje a Chile',
    desc: 'Los misioneros Clair Wilson y F. W. Bishop arriban a Valparaíso; se establece la primera iglesia formal en Iquique (1895).'
  },
  {
    year: '1984',
    scope: 'local',
    title: 'Semilla Adventista en Hualqui',
    desc: 'Grupos familiares inician reuniones de oración y Escuela Sabática en hogares del sector La Concepción.'
  },
  {
    year: '1996',
    scope: 'local',
    title: 'Organización Oficial de la Congregación',
    desc: 'La Asociación Centro Sur de Chile formaliza la Iglesia de Hualqui con más de 40 miembros de base comprometidos con la misión.'
  },
  {
    year: '2008',
    scope: 'local',
    title: 'Edificación del Templo Central',
    desc: 'Apertura de la sede en Calle La Concepción #450, equipada con salas pedagógicas y espacios de servicio asistencial.'
  },
  {
    year: '2026',
    scope: 'local',
    title: 'Pilar Espiritual e Innovación Misionera',
    desc: 'Comunidad discipuladora consolidada con iniciativas Caleb, grupos pequeños integrados y alcance territorial activo.'
  }
];

export function HistoryView({ navigateTo }: HistoryViewProps) {
  const [activePillar, setActivePillar] = useState<PillarKey>('mision');
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'global' | 'local'>('all');

  const filteredTimeline = timelineFilter === 'all' 
    ? TIMELINE_DATA 
    : TIMELINE_DATA.filter((e) => e.scope === timelineFilter);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-20 antialiased text-[#2D3831] dark:text-slate-200">
      
      {/* 1. HERO INSTITUCIONAL */}
      <section className="relative rounded-3xl bg-gradient-to-br from-[#1b221e] via-[#242e27] to-[#121714] text-white p-8 sm:p-16 overflow-hidden shadow-2xl border border-white/5 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,152,133,0.35)_0%,_transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7C9885]/20 border border-[#7C9885]/40 text-emerald-200 text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
            <Flame className="w-4 h-4 text-[#E0A96D]" /> Herencia Profética y Fe Viva
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
            Guiados por la Palabra: <br className="hidden sm:inline" />
            <span className="text-[#E0A96D] italic">De Battle Creek a Hualqui</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Somos parte de un remanente profético global convocado a proclamar el evangelio eterno de Apocalipsis 14. 
            Conoce las raíces, los hombres y mujeres de fe, y la marcha histórica que sostiene a nuestra iglesia local.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><Globe2 className="w-4 h-4 text-[#7C9885]" /> +22 Millones a nivel mundial</span>
            <span className="flex items-center gap-1.5"><Church className="w-4 h-4 text-[#7C9885]" /> Sede Hualqui (Asociación Centro Sur)</span>
            <span className="flex items-center gap-1.5"><Scroll className="w-4 h-4 text-[#7C9885]" /> 28 Creencias Fundamentales</span>
          </div>
        </div>
      </section>

      {/* 2. PIONEROS HISTÓRICOS */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#7C9885] dark:text-emerald-400">
            Los Fundamentos
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#2D3831] dark:text-emerald-100">
            Pioneros de la Esperanza
          </h2>
          <p className="text-xs sm:text-sm text-[#526157] dark:text-slate-400">
            Hombres y mujeres consagrados que escudriñaron las Escrituras para fundar una iglesia fundada en la verdad bíblica.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PIONEERS_DATA.map((pioneer, idx) => (
            <div 
              key={idx} 
              className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-[#FAF8F3] dark:bg-slate-900/60 border border-[#E2DEC9] dark:border-slate-800 shadow-sm hover:shadow-md hover:border-[#7C9885]/60 transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-[#E8F0EA] dark:bg-slate-800 text-[#7C9885] group-hover:bg-[#7C9885] group-hover:text-white transition-colors">
                    <Scroll className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#7C9885] dark:text-emerald-400">{pioneer.period}</span>
                </div>

                <div>
                  <h3 className="text-lg font-serif font-bold text-[#2D3831] dark:text-slate-100">{pioneer.name}</h3>
                  <p className="text-xs font-medium text-[#7C9885] dark:text-emerald-400/80 mb-2">{pioneer.role}</p>
                  <p className="text-xs text-[#526157] dark:text-slate-400 leading-relaxed">{pioneer.contribution}</p>
                </div>
              </div>

              <blockquote className="mt-6 pt-4 border-t border-[#E8E4D5] dark:border-slate-800 italic text-[11px] text-[#66756C] dark:text-slate-400">
                "{pioneer.quote}"
              </blockquote>
            </div>
          ))}
        </div>
      </section>

      {/* 3. LÍNEA DE TIEMPO INTERACTIVA */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E2DEC9] dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#7C9885] dark:text-emerald-400">
              Cronología Eclesial
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D3831] dark:text-emerald-100">
              Hitos que forjaron nuestra identidad
            </h2>
          </div>

          <div className="flex items-center gap-2 p-1 bg-[#FAF8F3] dark:bg-slate-900 border border-[#E2DEC9] dark:border-slate-800 rounded-xl">
            {(['all', 'global', 'local'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setTimelineFilter(mode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  timelineFilter === mode 
                    ? 'bg-[#7C9885] text-white shadow-xs' 
                    : 'text-[#526157] dark:text-slate-400 hover:text-[#2D3831]'
                }`}
              >
                {mode === 'all' ? 'Completa' : mode === 'global' ? 'IASD Mundial' : 'Hualqui'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredTimeline.map((item, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-[#E2DEC9] dark:border-slate-800 space-y-3 flex flex-col justify-between hover:border-[#7C9885] transition-all shadow-xs"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-serif font-bold text-[#7C9885] dark:text-emerald-400">{item.year}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    item.scope === 'global' 
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300' 
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                  }`}>
                    {item.scope === 'global' ? 'Mundial' : 'Local'}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#2D3831] dark:text-slate-100">{item.title}</h4>
              </div>
              <p className="text-xs text-[#526157] dark:text-slate-400 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PILARES DOCTRINALES E IDENTITARIOS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-4 space-y-3">
          {[
            { id: 'mision', label: 'Nuestra Misión', icon: BookOpen, sub: 'Proclamación global' },
            { id: 'vision', label: 'Nuestra Visión', icon: Sparkles, sub: 'Hacia dónde marchamos' },
            { id: 'santuario', label: 'Santuario Celestial', icon: ShieldCheck, sub: 'Cristo, Sumo Sacerdote' },
            { id: 'sabado', label: 'El Santo Sábado', icon: Calendar, sub: 'Monumento de la Creación' },
            { id: 'esperanza', label: 'La Segunda Venida', icon: Compass, sub: 'Esperanza Bienaventurada' }
          ].map((item) => {
            const Icon = item.icon as LucideIcon;
            const active = activePillar === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActivePillar(item.id as PillarKey)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  active
                    ? 'bg-[#E8F0EA] dark:bg-slate-800 border-[#7C9885] shadow-xs'
                    : 'bg-[#FAF8F3] dark:bg-slate-900/60 border-[#E2DEC9] dark:border-slate-800 hover:border-[#7C9885]/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${active ? 'bg-[#7C9885] text-white' : 'bg-white dark:bg-slate-800 text-[#7C9885]'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#2D3831] dark:text-slate-100">{item.label}</h4>
                    <p className="text-[11px] text-[#526157] dark:text-slate-400">{item.sub}</p>
                  </div>
                </div>
                <ArrowRight className={`w-4 h-4 transition-transform ${active ? 'translate-x-1 text-[#7C9885]' : 'opacity-30'}`} />
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-8 bg-[#FAF8F3] dark:bg-slate-900/60 border border-[#E2DEC9] dark:border-slate-800 rounded-3xl p-6 sm:p-10 flex flex-col justify-center shadow-xs">
          {activePillar === 'mision' && (
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C9885] dark:text-emerald-400">Declaración de Misión</span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D3831] dark:text-emerald-100">
                Hacer discípulos de Jesucristo que vivan y compartan el evangelio eterno
              </h3>
              <p className="text-xs sm:text-sm text-[#526157] dark:text-slate-300 leading-relaxed">
                Fundamentados en los mensajes de los tres ángeles de Apocalipsis 14:6-12, preparamos a la comuna de Hualqui y al mundo para el inminente regreso de Jesucristo, mediante la predicación, la enseñanza y el servicio integral.
              </p>
            </div>
          )}

          {activePillar === 'vision' && (
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C9885] dark:text-emerald-400">Declaración de Visión</span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D3831] dark:text-emerald-100">
                Ser una comunidad modelo de santidad, servicio e integración misionera
              </h3>
              <p className="text-xs sm:text-sm text-[#526157] dark:text-slate-300 leading-relaxed">
                Armonizados con la imagen de Dios, buscamos que cada creyente desarrolle plenamente sus dones espirituales, integrándose en grupos pequeños y transformando positivamente su entorno social y familiar.
              </p>
            </div>
          )}

          {activePillar === 'santuario' && (
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C9885] dark:text-emerald-400">Doctrina Central</span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D3831] dark:text-emerald-100">
                El Santuario Celestial y la Intercesión de Cristo
              </h3>
              <p className="text-xs sm:text-sm text-[#526157] dark:text-slate-300 leading-relaxed">
                Reconocemos a Jesús como nuestro único Sumo Sacerdote en el Santuario Celestial (Hebreos 8:1-2). Su sacrificio en el Calvario asegura nuestra salvación completa y su juicio investigador vindica la justicia divina ante el universo.
              </p>
            </div>
          )}

          {activePillar === 'sabado' && (
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C9885] dark:text-emerald-400">Descanso Sagrado</span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D3831] dark:text-emerald-100">
                El Sábado como Señal Eterna del Creador
              </h3>
              <p className="text-xs sm:text-sm text-[#526157] dark:text-slate-300 leading-relaxed">
                El séptimo día de la semana (desde la puesta de sol del viernes hasta la del sábado) es un monumento perpetual a la creación divina y la redención (Éxodo 20:8-11). Un tiempo sagrado para comunión, familia y adoración.
              </p>
            </div>
          )}

          {activePillar === 'esperanza' && (
            <div className="space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C9885] dark:text-emerald-400">Meta Profética</span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D3831] dark:text-emerald-100">
                El Advenimiento Literal y Visible del Salvador
              </h3>
              <p className="text-xs sm:text-sm text-[#526157] dark:text-slate-300 leading-relaxed">
                Aguardamos con certeza la Segunda Venida visible, audible e inminente de Jesús (1 Tesalonicenses 4:16-17), cuando restaurará todas las cosas y el mal será erradicado por la eternidad.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 5. METRICAS / IMPACTO LOCAL & LIDERAZGO */}
      <section className="p-8 sm:p-10 rounded-3xl bg-[#FAF8F3] dark:bg-slate-900/60 border border-[#E2DEC9] dark:border-slate-800 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#7C9885] dark:text-emerald-400">40+</div>
            <div className="text-xs font-semibold text-[#2D3831] dark:text-slate-200">Años en Hualqui</div>
            <div className="text-[10px] text-[#66756C] dark:text-slate-400">Desde 1984</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#7C9885] dark:text-emerald-400">100%</div>
            <div className="text-xs font-semibold text-[#2D3831] dark:text-slate-200">Bíblica</div>
            <div className="text-[10px] text-[#66756C] dark:text-slate-400">Sola Scriptura</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#7C9885] dark:text-emerald-400">8+</div>
            <div className="text-xs font-semibold text-[#2D3831] dark:text-slate-200">Grupos Pequeños</div>
            <div className="text-[10px] text-[#66756C] dark:text-slate-400">Red en Hogares</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#7C9885] dark:text-emerald-400">2026</div>
            <div className="text-xs font-semibold text-[#2D3831] dark:text-slate-200">Visión Presente</div>
            <div className="text-[10px] text-[#66756C] dark:text-slate-400">Caleb y Discipulado</div>
          </div>
        </div>
      </section>

    </div>
  );
}