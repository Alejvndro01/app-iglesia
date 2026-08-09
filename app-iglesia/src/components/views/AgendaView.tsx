'use client';

import React from 'react';
import { CHURCH_CALENDAR_EVENTS } from '@/data/mockData';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <span className="bg-[#eca489] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
          Comunidad Unida
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#486379] mt-1">Agenda Eclesial & Cumpleaños</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h3 className="font-extrabold text-[#486379] text-lg">📅 Próximos Eventos</h3>
          <div className="space-y-3">
            {CHURCH_CALENDAR_EVENTS.map((e: EventItem) => (
              <div key={e.id} className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs flex items-center justify-between">
                <div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${e.type === 'Cumpleaños' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'}`}>
                    {e.type}
                  </span>
                  <h4 className="font-black text-[#486379] text-sm mt-1">{e.title}</h4>
                  <p className="text-xs text-slate-400">📅 {e.date} • ⏰ {e.time}</p>
                </div>
                <button
                  onClick={() => showToast(`Agendado: ${e.title}`)}
                  className="px-3.5 py-1.5 bg-[#f0f6fb] text-[#486379] font-bold text-xs rounded-full hover:bg-[#eca489] hover:text-white"
                >
                  ➕ Agendar
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-xs space-y-4 h-fit">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎂</span>
            <h3 className="font-extrabold text-[#486379] text-base">Cumpleaños del Mes</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-amber-50 rounded-2xl flex justify-between items-center">
              <span className="font-bold text-amber-900">🎉 Hna. Carmen Reyes</span>
              <span className="text-[10px] font-semibold text-amber-700">25 de Agosto</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-2xl flex justify-between items-center">
              <span className="font-bold text-amber-900">🎈 Pr. Alejandro Silva</span>
              <span className="text-[10px] font-semibold text-amber-700">30 de Agosto</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}