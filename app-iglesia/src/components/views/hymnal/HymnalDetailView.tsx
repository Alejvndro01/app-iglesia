'use client';

import React, { useState, useEffect, useRef } from 'react';
import { HimnoDetail } from '@/types';
import { BookOpen, Volume2, Mic, Music, Loader2 } from 'lucide-react';
import { db } from '@/lib/db';
import { apiClient } from '@/lib/api-client';

interface HymnalDetailViewProps {
  // hymn is now optional because we can load it from local DB
  hymn?: HimnoDetail;
  hymnId?: number;
}

export function HymnalDetailView({ hymn: initialHymn, hymnId }: HymnalDetailViewProps) {
  const [hymn, setHymn] = useState<HimnoDetail | null>(initialHymn || null);
  const [loading, setLoading] = useState(!initialHymn && !!hymnId);
  const vocalAudioRef = useRef<HTMLAudioElement | null>(null);
  const instrAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const loadHymn = async () => {
      if (!hymnId) return;

      setLoading(true);
      try {
        // 1. Try to load from local DB first for instant feel
        const localHymn = await db.hymns.get(hymnId);
        if (localHymn) {
          setHymn(localHymn);
          setLoading(false);
        }

        // 2. Sync with API to get latest data and update local DB
        const apiHymn = await apiClient.getHimno(hymnId);
        if (apiHymn) {
          await db.hymns.put(apiHymn as import('@/lib/db').LocalHymn);
          setHymn(apiHymn);
        }
      } catch (error) {
        console.error('Error loading hymn offline/online:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHymn();
  }, [hymnId]);

  const handleVocalPlay = () => {
    if (instrAudioRef.current && !instrAudioRef.current.paused) {
      instrAudioRef.current.pause();
    }
  };

  const handleInstrPlay = () => {
    if (vocalAudioRef.current && !vocalAudioRef.current.paused) {
      vocalAudioRef.current.pause();
    }
  };

  if (loading && !hymn) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-[#7C9885] text-xs font-semibold space-y-2">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span>Cargando himno...</span>
      </div>
    );
  }

  if (!hymn) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-[#66756C] dark:text-slate-400 text-xs font-semibold text-center space-y-2">
        <Music className="w-8 h-8 text-[#7C9885]/60" />
        <span>Himno no encontrado. Intente conectar el dispositivo a internet para descargarlo.</span>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F3] dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-[#E2DEC9] dark:border-slate-800 shadow-xs min-h-[400px] space-y-6">
      <div className="border-b border-[#E8E4D5] dark:border-slate-800 pb-4 space-y-1">
        <span className="text-xs font-bold text-[#7C9885] dark:text-emerald-400">
          HIMNO #{hymn.number}
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-[#2D3831] dark:text-emerald-100">
          {hymn.title}
        </h3>
        {hymn.bibleReference && (
          <p className="text-xs text-[#66756C] dark:text-slate-400 font-medium flex items-center gap-1.5 mt-1">
            <BookOpen className="w-3.5 h-3.5 text-[#7C9885]" /> {hymn.bibleReference}
          </p>
        )}
      </div>

      {(hymn.mp3Url || hymn.mp3UrlInstr) && (
        <div className="bg-[#E8F0EA] dark:bg-slate-800/80 p-4 rounded-2xl border border-[#C5D8CC] dark:border-slate-700 space-y-4">
          <h4 className="text-xs font-bold text-[#2D3831] dark:text-emerald-200 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-[#7C9885]" /> Reproductor de Audio
          </h4>

          {hymn.mp3Url && (
            <div className="space-y-1">
              <p className="text-[10px] text-[#546E5C] dark:text-slate-400 font-semibold flex items-center gap-1">
                <Mic className="w-3 h-3" /> Audio Cantado:
              </p>
              <audio
                ref={vocalAudioRef}
                key={`cantado-${hymn.number}`}
                controls
                onPlay={handleVocalPlay}
                preload="metadata"
                className="w-full h-9 rounded-lg"
                src={hymn.mp3Url}
              >
                Tu navegador no soporta el reproductor de audio.
              </audio>
            </div>
          )}

          {hymn.mp3UrlInstr && (
            <div className="space-y-1">
              <p className="text-[10px] text-[#546E5C] dark:text-slate-400 font-semibold flex items-center gap-1">
                <Music className="w-3 h-3" /> Pista / Instrumental:
              </p>
              <audio
                ref={instrAudioRef}
                key={`instr-${hymn.number}`}
                controls
                onPlay={handleInstrPlay}
                preload="metadata"
                className="w-full h-9 rounded-lg"
                src={hymn.mp3UrlInstr}
              >
                Tu navegador no soporta el reproductor de audio.
              </audio>
            </div>
          )}
        </div>
      )}

      <div className="space-y-4 text-xs sm:text-sm text-[#3A473E] dark:text-slate-300 leading-relaxed">
        {hymn.verses?.map((verse, index) => (
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
  );
}
