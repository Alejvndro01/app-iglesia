'use client';

import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/lib/api-client';
import { HimnoDetail } from '@/types';
import { Search, Music, BookOpen, Volume2, Mic, Loader2 } from 'lucide-react';

interface HimnarioPageViewProps {
  showToast?: (msg: string) => void;
}

export function HimnarioPageView({ showToast }: HimnarioPageViewProps) {
  const [search, setSearch] = useState('');
  const [hymns, setHymns] = useState<HimnoDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHymn, setSelectedHymn] = useState<HimnoDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Referencias a los elementos de audio para control mutuo
  const vocalAudioRef = useRef<HTMLAudioElement | null>(null);
  const instrAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await apiClient.searchHimnos(search);
        setHymns(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error al cargar himnos:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleSelectHymn = async (number: number) => {
    // Detener y resetear cualquier audio en reproducción previa
    if (vocalAudioRef.current) {
      vocalAudioRef.current.pause();
      vocalAudioRef.current.currentTime = 0;
    }
    if (instrAudioRef.current) {
      instrAudioRef.current.pause();
      instrAudioRef.current.currentTime = 0;
    }

    setLoadingDetail(true);
    try {
      const data = await apiClient.getHimno(number);
      setSelectedHymn(data);
    } catch (err) {
      console.error('Error al obtener detalle del himno:', err);
      showToast?.('Error al cargar el himno seleccionado');
    } finally {
      setLoadingDetail(false);
    }
  };

  // Pausar audio instrumental cuando suena la versión cantada
  const handleVocalPlay = () => {
    if (instrAudioRef.current && !instrAudioRef.current.paused) {
      instrAudioRef.current.pause();
    }
  };

  // Pausar versión cantada cuando suena el audio instrumental
  const handleInstrPlay = () => {
    if (vocalAudioRef.current && !vocalAudioRef.current.paused) {
      vocalAudioRef.current.pause();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 antialiased">
      {/* Encabezado */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="bg-[#E8F0EA] text-[#546E5C] dark:bg-emerald-950/50 dark:text-emerald-300 text-[11px] font-bold px-3 py-1 rounded-full border border-[#7C9885]/30">
          Alabanza y Adoración
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2D3831] dark:text-emerald-100 flex items-center justify-center gap-2">
          <Music className="w-6 h-6 text-[#7C9885]" /> Himnario Adventista
        </h2>
        <p className="text-xs sm:text-sm text-[#66756C] dark:text-slate-400">
          Busca por número o título del himno
        </p>
      </div>

      {/* Barra de Búsqueda */}
      <div className="relative max-w-md mx-auto">
        <Search className="w-4 h-4 text-[#7C9885] absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Escribe el número o título (ej. 250 o Grande es tu fidelidad)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#FAF8F3] dark:bg-slate-900 text-xs pl-11 pr-5 py-3.5 rounded-full border border-[#E2DEC9] dark:border-slate-800 text-[#2D3831] dark:text-slate-100 shadow-xs outline-none focus:border-[#7C9885] transition-colors"
        />
      </div>

      {/* Contenido Principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lista de Himnos (Columna Izquierda) */}
        <div className="md:col-span-1 space-y-2 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
          {loading ? (
            <div className="flex justify-center items-center py-10 text-[#7C9885] text-xs font-semibold gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Buscando himnos...
            </div>
          ) : hymns.length === 0 ? (
            <p className="text-xs text-[#66756C] dark:text-slate-400 text-center py-8">
              No se encontraron himnos.
            </p>
          ) : (
            hymns.map((h) => {
              const isSelected = selectedHymn?.number === h.number;
              return (
                <div
                  key={h.number}
                  onClick={() => handleSelectHymn(h.number)}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex items-center space-x-3 ${
                    isSelected
                      ? 'bg-[#7C9885] text-white border-[#6B8774] shadow-xs'
                      : 'bg-[#FAF8F3] dark:bg-slate-900 border-[#E2DEC9] dark:border-slate-800 text-[#2D3831] dark:text-slate-200 hover:bg-[#E8F0EA] dark:hover:bg-slate-800'
                  }`}
                >
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-[#E8F0EA] dark:bg-slate-800 text-[#546E5C] dark:text-emerald-300'
                    }`}
                  >
                    #{h.number}
                  </span>
                  <span className="text-xs font-medium line-clamp-1">{h.title}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Detalle del Himno Seleccionado (Columna Derecha) */}
        <div className="md:col-span-2 bg-[#FAF8F3] dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-[#E2DEC9] dark:border-slate-800 shadow-xs min-h-[400px]">
          {loadingDetail ? (
            <div className="flex flex-col items-center justify-center py-24 text-[#7C9885] text-xs font-semibold space-y-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Cargando himno...</span>
            </div>
          ) : selectedHymn && !selectedHymn.error ? (
            <div className="space-y-6">
              {/* Título e Información Bíblica */}
              <div className="border-b border-[#E8E4D5] dark:border-slate-800 pb-4 space-y-1">
                <span className="text-xs font-bold text-[#7C9885] dark:text-emerald-400">
                  HIMNO #{selectedHymn.number}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#2D3831] dark:text-emerald-100">
                  {selectedHymn.title}
                </h3>
                {selectedHymn.bibleReference && (
                  <p className="text-xs text-[#66756C] dark:text-slate-400 font-medium flex items-center gap-1.5 mt-1">
                    <BookOpen className="w-3.5 h-3.5 text-[#7C9885]" /> {selectedHymn.bibleReference}
                  </p>
                )}
              </div>

              {/* Reproductor de Audio Exclusivo */}
              {(selectedHymn.mp3Url || selectedHymn.mp3UrlInstr) && (
                <div className="bg-[#E8F0EA] dark:bg-slate-800/80 p-4 rounded-2xl border border-[#C5D8CC] dark:border-slate-700 space-y-4">
                  <h4 className="text-xs font-bold text-[#2D3831] dark:text-emerald-200 flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-[#7C9885]" /> Reproductor de Audio
                  </h4>

                  {selectedHymn.mp3Url && (
                    <div className="space-y-1">
                      <p className="text-[10px] text-[#546E5C] dark:text-slate-400 font-semibold flex items-center gap-1">
                        <Mic className="w-3 h-3" /> Audio Cantado:
                      </p>
                      <audio
                        ref={vocalAudioRef}
                        key={`cantado-${selectedHymn.number}`}
                        controls
                        onPlay={handleVocalPlay}
                        preload="metadata"
                        className="w-full h-9 rounded-lg"
                        src={selectedHymn.mp3Url}
                      >
                        Tu navegador no soporta el reproductor de audio.
                      </audio>
                    </div>
                  )}

                  {selectedHymn.mp3UrlInstr && (
                    <div className="space-y-1">
                      <p className="text-[10px] text-[#546E5C] dark:text-slate-400 font-semibold flex items-center gap-1">
                        <Music className="w-3 h-3" /> Pista / Instrumental:
                      </p>
                      <audio
                        ref={instrAudioRef}
                        key={`instr-${selectedHymn.number}`}
                        controls
                        onPlay={handleInstrPlay}
                        preload="metadata"
                        className="w-full h-9 rounded-lg"
                        src={selectedHymn.mp3UrlInstr}
                      >
                        Tu navegador no soporta el reproductor de audio.
                      </audio>
                    </div>
                  )}
                </div>
              )}

              {/* Letra del Himno (Estrofas y Coros) */}
              <div className="space-y-4 text-xs sm:text-sm text-[#3A473E] dark:text-slate-300 leading-relaxed">
                {selectedHymn.verses?.map((verse, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-2xl border ${
                      verse.type === 'chorus'
                        ? 'bg-[#F8F5EC] dark:bg-emerald-950/20 border-[#E8E4D5] dark:border-emerald-900/40'
                        : 'bg-white dark:bg-slate-950 border-[#E8E4D5] dark:border-slate-800'
                    }`}
                  >
                    <p className="text-[10px] font-bold text-[#7C9885] dark:text-emerald-400 uppercase mb-1">
                      {verse.type === 'chorus' ? 'Coro' : `Estrofa ${verse.number}`}
                    </p>
                    <p className="whitespace-pre-line font-medium leading-relaxed">{verse.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-[#66756C] dark:text-slate-400 text-xs font-semibold text-center space-y-2">
              <Music className="w-8 h-8 text-[#7C9885]/60" />
              <span>Selecciona un himno para escuchar su pista y ver su letra</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { HimnarioPageView as HymnalView };