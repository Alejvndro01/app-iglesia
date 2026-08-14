'use client';

import React from 'react';
import { CHURCH_CALENDAR_EVENTS } from '@/data/mockData';
import { Calendar, Cake, Plus, Clock, Sparkles } from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  date: string;
  type: string;
  time: string;
}

interface AgendaViewProps {
  showToast: (msg: string) => void;
}

export function AgendaView({ showToast }: AgendaViewProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 antialiased">
      {/* Encabezado */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="bg-[#E8F0EA] text-[#546E5C] dark:bg-emerald-950/50 dark:text-emerald-300 text-[11px] font-bold px-3 py-1 rounded-full border border-[#7C9885]/30">
          Comunidad Unida
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2D3831] dark:text-emerald-100 flex items-center justify-center gap-2">
          <Calendar className="w-6 h-6 text-[#7C9885]" /> Agenda Eclesial & Cumpleaños
        </h2>
        <p className="text-xs sm:text-sm text-[#66756C] dark:text-slate-400">
          Mantente al día con las actividades y celebraciones de la IASD Central Hualqui.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Próximos Eventos (Columna Izquierda / Central) */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="font-bold text-[#2D3831] dark:text-emerald-100 text-base flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#7C9885]" /> Próximos Eventos
          </h3>
          <div className="space-y-3">
            {CHURCH_CALENDAR_EVENTS.map((e: EventItem) => (
              <div
                key={e.id}
                className="bg-[#FAF8F3] dark:bg-slate-900 p-5 rounded-3xl border border-[#E2DEC9] dark:border-slate-800 shadow-xs flex items-center justify-between transition-colors gap-4"
              >
                <div className="space-y-1">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block ${
                      e.type === 'Cumpleaños'
                        ? 'bg-[#F8F5EC] text-[#E08A72] dark:bg-emerald-950/40 dark:text-emerald-300 border border-[#E2DEC9] dark:border-slate-700'
                        : 'bg-[#E8F0EA] text-[#546E5C] dark:bg-emerald-950/40 dark:text-emerald-300 border border-[#C5D8CC]/50 dark:border-slate-700'
                    }`}
                  >
                    {e.type}
                  </span>
                  <h4 className="font-bold text-[#2D3831] dark:text-slate-100 text-sm">
                    {e.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#66756C] dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#7C9885]" /> {e.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#7C9885]" /> {e.time}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => showToast(`Agendado: ${e.title}`)}
                  className="px-3.5 py-2 bg-white dark:bg-slate-800 text-[#2D3831] dark:text-emerald-300 border border-[#DCD7C5] dark:border-slate-700 font-semibold text-xs rounded-xl hover:bg-[#7C9885] hover:text-white dark:hover:bg-[#7C9885] dark:hover:text-white transition-all cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> Agendar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cumpleaños del Mes (Columna Derecha) */}
        <div className="bg-[#FAF8F3] dark:bg-slate-900 p-6 rounded-3xl border border-[#E2DEC9] dark:border-slate-800 shadow-xs space-y-4 h-fit">
          <div className="flex items-center gap-2 border-b border-[#E8E4D5] dark:border-slate-800 pb-3">
            <Cake className="w-5 h-5 text-[#E08A72]" />
            <h3 className="font-bold text-[#2D3831] dark:text-emerald-100 text-base">
              Cumpleaños del Mes
            </h3>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="p-3.5 bg-[#F8F5EC] dark:bg-slate-800/80 rounded-2xl flex justify-between items-center border border-[#E8E4D5] dark:border-slate-700">
              <span className="font-semibold text-[#2D3831] dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#E08A72]" /> Hna. Carmen Reyes
              </span>
              <span className="text-[10px] font-bold text-[#7C9885] dark:text-emerald-400 bg-[#E8F0EA] dark:bg-slate-900 px-2 py-0.5 rounded-full">
                25 de Agosto
              </span>
            </div>
            <div className="p-3.5 bg-[#F8F5EC] dark:bg-slate-800/80 rounded-2xl flex justify-between items-center border border-[#E8E4D5] dark:border-slate-700">
              <span className="font-semibold text-[#2D3831] dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#E08A72]" /> Pr. Alejandro Silva
              </span>
              <span className="text-[10px] font-bold text-[#7C9885] dark:text-emerald-400 bg-[#E8F0EA] dark:bg-slate-900 px-2 py-0.5 rounded-full">
                30 de Agosto
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}