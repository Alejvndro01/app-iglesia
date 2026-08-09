'use client';

import React, { useState } from 'react';
import { INITIAL_HYMNS } from '@/data/mockData';

interface HymnalViewProps {
  showToast: (msg: string) => void;
}

export function HimnarioPageView({ showToast }: HymnalViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHymn, setSelectedHymn] = useState(INITIAL_HYMNS[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const filteredHymns = INITIAL_HYMNS.filter(
    (h) =>
      h.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.number.toString().includes(searchTerm)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <span className="bg-[#eca489] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
          Alabanza Congregacional
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#486379] mt-1">
          Himnario Adventista Digital
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Busca por número de himno o por título de la alabanza.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-xs space-y-4 h-fit">
          <input
            type="text"
            placeholder="🔍 Buscar himno por # o título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#fbf6ee] text-xs p-3 rounded-2xl border border-amber-100 outline-none"
          />

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredHymns.map((h) => (
              <div
                key={h.number}
                onClick={() => {
                  setSelectedHymn(h);
                  setIsPlayingAudio(false);
                }}
                className={`p-3 rounded-2xl cursor-pointer text-xs transition-all flex items-center justify-between ${
                  selectedHymn.number === h.number
                    ? 'bg-[#486379] text-white font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span>
                  #{h.number} - {h.title}
                </span>
                <span className="text-[10px] opacity-70">{h.key}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-sky-100 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-4 border-slate-100 gap-2">
            <div>
              <span className="text-xs font-extrabold text-[#eca489] uppercase">
                {selectedHymn.category}
              </span>
              <h3 className="text-2xl font-black text-[#486379]">
                #{selectedHymn.number} - {selectedHymn.title}
              </h3>
              <p className="text-xs text-slate-400">Tono musical: {selectedHymn.key}</p>
            </div>

            <button
              onClick={() => {
                setIsPlayingAudio(!isPlayingAudio);
                showToast(
                  isPlayingAudio
                    ? 'Audio pausado'
                    : 'Reproduciendo pista instrumental...'
                );
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center space-x-1 ${
                isPlayingAudio
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-[#eca489] text-white hover:bg-[#e49375]'
              }`}
            >
              <span>{isPlayingAudio ? '⏸ Pausar Pista' : '▶ Reproducir Audio'}</span>
            </button>
          </div>

          <div className="whitespace-pre-line text-sm sm:text-base text-slate-700 leading-relaxed font-medium bg-[#f0f6fb] p-6 rounded-2xl border border-sky-100">
            {selectedHymn.lyrics}
          </div>
        </div>
      </div>
    </div>
  );
}