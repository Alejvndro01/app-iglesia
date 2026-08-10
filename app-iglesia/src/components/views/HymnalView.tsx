'use client';

import React, { useState, useEffect } from 'react';

interface HimnarioPageViewProps {
  showToast?: (msg: string) => void;
}

export function HimnarioPageView({ showToast }: HimnarioPageViewProps) {
  const [search, setSearch] = useState('');
  const [hymns, setHymns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHymn, setSelectedHymn] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setLoading(true);
      fetch(`/api/himnario?q=${encodeURIComponent(search)}`)
        .then((res) => res.json())
        .then((data) => {
          setHymns(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleSelectHymn = (number: number) => {
    setLoadingDetail(true);
    fetch(`/api/himnario/${number}`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedHymn(data);
        setLoadingDetail(false);
      })
      .catch(() => setLoadingDetail(false));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="bg-[#eca489] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
          Alabanza y Adoración
        </span>
        <h2 className="text-3xl font-black text-[#486379]">Himnario Adventista</h2>
        <p className="text-xs text-slate-500">Busca por número o título del himno</p>
      </div>

      <div className="relative max-w-md mx-auto">
        <input
          type="text"
          placeholder="🔍 Escribe el número o título (ej. 250 o Grande es tu fidelidad)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white text-xs px-5 py-3.5 rounded-full border border-sky-100 shadow-xs outline-none focus:border-[#eca489] transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lista de Resultados */}
        <div className="md:col-span-1 space-y-2 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
          {loading ? (
            <p className="text-xs text-slate-400 text-center py-6">Conectando con la API...</p>
          ) : hymns.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No se encontraron himnos.</p>
          ) : (
            hymns.map((h) => (
              <div
                key={h.number}
                onClick={() => handleSelectHymn(h.number)}
                className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex items-center space-x-3 ${
                  selectedHymn?.number === h.number
                    ? 'bg-[#eca489] text-white border-[#eca489] shadow-xs'
                    : 'bg-white border-sky-100 text-[#486379] hover:bg-slate-50'
                }`}
              >
                <span
                  className={`text-xs font-black px-2.5 py-1 rounded-xl ${
                    selectedHymn?.number === h.number
                      ? 'bg-white/20 text-white'
                      : 'bg-[#f0f6fb] text-[#eca489]'
                  }`}
                >
                  #{h.number}
                </span>
                <span className="text-xs font-bold line-clamp-1">{h.title}</span>
              </div>
            ))
          )}
        </div>

        {/* Visor de Himno */}
        <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-xs min-h-[400px]">
          {loadingDetail ? (
            <div className="text-center py-20 text-slate-400 text-xs">Cargando himno desde la API...</div>
          ) : selectedHymn && !selectedHymn.error ? (
            <div className="space-y-6">
              <div className="border-b pb-4 space-y-1">
                <span className="text-xs font-black text-[#eca489]">HIMNO #{selectedHymn.number}</span>
                <h3 className="text-2xl font-black text-[#486379]">{selectedHymn.title}</h3>
                {selectedHymn.bibleReference && (
                  <p className="text-xs text-slate-400 font-bold">📖 {selectedHymn.bibleReference}</p>
                )}
              </div>

              {/* Reproductores de Audio */}
              {(selectedHymn.mp3Url || selectedHymn.mp3UrlInstr) && (
                <div className="bg-[#f0f6fb] p-4 rounded-2xl border border-sky-100 space-y-3">
                  <h4 className="text-xs font-bold text-[#486379]">🎵 Reproductor de Audio</h4>
                  {selectedHymn.mp3Url && (
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold mb-1">Cantado:</p>
                      <audio controls className="w-full h-8" src={selectedHymn.mp3Url} />
                    </div>
                  )}
                  {selectedHymn.mp3UrlInstr && (
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold mb-1">Instrumental / Pista:</p>
                      <audio controls className="w-full h-8" src={selectedHymn.mp3UrlInstr} />
                    </div>
                  )}
                </div>
              )}

              {/* Estrofas */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {selectedHymn.verses?.map((verse: any, index: number) => (
                  <div
                    key={index}
                    className={`p-4 rounded-2xl border ${
                      verse.type === 'chorus'
                        ? 'bg-[#fbf6ee] border-amber-200'
                        : 'bg-[#f0f6fb] border-sky-100'
                    }`}
                  >
                    <p className="text-[10px] font-extrabold text-[#eca489] uppercase mb-1">
                      {verse.type === 'chorus' ? 'Coro' : `Estrofa ${verse.number}`}
                    </p>
                    <p className="whitespace-pre-line font-medium leading-relaxed">{verse.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-24 text-slate-400 text-xs font-bold">
              👈 Selecciona un himno para escuchar su pista y ver su letra
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { HimnarioPageView as HymnalView };