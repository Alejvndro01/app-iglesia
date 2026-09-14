'use client';

import React, { useState } from 'react';
import { BookOpen, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Verse {
  verse: number;
  text: string;
}

const BIBLE_VERSIONS = [
  { id: 'RVR1960', name: 'Reina Valera 1960 (RVR1960)' },
  { id: 'NVI', name: 'Nueva Versión Internacional (NVI)' },
  { id: 'LBLA', name: 'La Biblia de las Américas (LBLA)' },
  { id: 'DHH', name: 'Dios Habla Hoy (DHH)' },
  { id: 'PDT', name: 'Palabra de Dios para Todos (PDT)' },
  { id: 'NTV', name: 'Nueva Traducción Viviente (NTV)' }
];

export default function BibleReader({ libro, capitulo, verses, version }: { libro: string, capitulo: number, verses: Verse[], version: string }) {
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const router = useRouter();

  const handleCopyChapter = () => {
    const textToCopy = verses.map((v) => `${v.verse}. ${v.text}`).join('\n');
    navigator.clipboard.writeText(`${libro} ${capitulo} (${version})\n\n${textToCopy}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVersionChange = (newVersion: string) => {
    router.push(`/biblia/${libro}/${capitulo}?version=${newVersion}`);
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm': return 'text-xs sm:text-sm';
      case 'lg': return 'text-base sm:text-lg';
      default: return 'text-sm sm:text-base';
    }
  };

  return (
    <div className="bg-[#FAF8F3] dark:bg-slate-900/80 border border-[#E2DEC9] dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DEC9] dark:border-slate-800 pb-5">
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
             <select
                value={version}
                onChange={(e) => handleVersionChange(e.target.value)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#FAF8F3] dark:bg-slate-900 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-200 outline-none focus:border-[#7C9885] cursor-pointer"
              >
                {BIBLE_VERSIONS.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
        </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#7C9885] dark:text-emerald-400">
              Lectura Sagrada
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#2D3831] dark:text-emerald-100">
              {libro} {capitulo}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyChapter}
            className="px-3 py-1.5 rounded-xl border border-[#DCD7C5] dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-[#526157] dark:text-slate-300 hover:bg-[#E8F0EA] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>

          <div className="flex items-center gap-1 p-1 bg-[#E8F0EA] dark:bg-slate-800 rounded-xl border border-[#C5D8CC]/60 dark:border-slate-700">
            <button
              onClick={() => setFontSize('sm')}
              className={`px-2 py-0.5 rounded-md text-xs font-bold transition-colors ${
                fontSize === 'sm' ? 'bg-[#7C9885] text-white' : 'text-[#526157] dark:text-slate-300'
              }`}
            >
              A-
            </button>
            <button
              onClick={() => setFontSize('base')}
              className={`px-2 py-0.5 rounded-md text-xs font-bold transition-colors ${
                fontSize === 'base' ? 'bg-[#7C9885] text-white' : 'text-[#526157] dark:text-slate-300'
              }`}
            >
              A
            </button>
            <button
              onClick={() => setFontSize('lg')}
              className={`px-2 py-0.5 rounded-md text-xs font-bold transition-colors ${
                fontSize === 'lg' ? 'bg-[#7C9885] text-white' : 'text-[#526157] dark:text-slate-300'
              }`}
            >
              A+
            </button>
          </div>
        </div>
      </div>

      <div className={`space-y-3 font-serif leading-relaxed text-[#2D3831] dark:text-slate-200 ${getFontSizeClass()}`}>
        {verses.map((v) => (
          <p key={v.verse} className="flex items-start gap-2.5 hover:bg-[#E8F0EA]/30 dark:hover:bg-slate-800/40 p-1.5 rounded-lg transition-colors">
            <span className="text-[11px] font-sans font-bold text-[#7C9885] dark:text-emerald-400 select-none min-w-[20px] pt-0.5">
              {v.verse}
            </span>
            <span>{v.text}</span>
          </p>
        ))}
      </div>

      <div className="pt-6 border-t border-[#E8E4D5] dark:border-slate-800 flex items-center justify-between gap-4">
        <button
          onClick={() => {
             // Logic for previous chapter handled by the selector or simple logic here
             // For now, let's use the router to navigate. This is simplified.
             // In a full impl, we'd check if it's chapter 1 and navigate to previous book.
             router.push(`/biblia/${libro}/${Math.max(1, capitulo - 1)}`);
          }}
          disabled={capitulo <= 1}
          className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-[#DCD7C5] dark:border-slate-700 text-xs font-bold text-[#526157] dark:text-slate-300 hover:bg-[#E8F0EA] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4" /> Capítulo Anterior
        </button>

        <button
          onClick={() => {
            router.push(`/biblia/${libro}/${capitulo + 1}`);
          }}
          className="px-4 py-2 rounded-xl bg-[#7C9885] hover:bg-[#6B8774] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          Capítulo Siguiente <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
