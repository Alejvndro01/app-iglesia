'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Copy, 
  Check, 
  Loader2,
  Bookmark,
  Layers
} from 'lucide-react';

interface Verse {
  verse: number;
  text: string;
}

// Canónicos completos (66 libros con capítulos exactos)
const CANON_BOOKS = [
  // Antiguo Testamento (39)
  { name: 'Génesis', testament: 'AT', chapters: 50 },
  { name: 'Éxodo', testament: 'AT', chapters: 40 },
  { name: 'Levítico', testament: 'AT', chapters: 27 },
  { name: 'Números', testament: 'AT', chapters: 36 },
  { name: 'Deuteronomio', testament: 'AT', chapters: 34 },
  { name: 'Josué', testament: 'AT', chapters: 24 },
  { name: 'Jueces', testament: 'AT', chapters: 21 },
  { name: 'Rut', testament: 'AT', chapters: 4 },
  { name: '1 Samuel', testament: 'AT', chapters: 31 },
  { name: '2 Samuel', testament: 'AT', chapters: 24 },
  { name: '1 Reyes', testament: 'AT', chapters: 22 },
  { name: '2 Reyes', testament: 'AT', chapters: 25 },
  { name: '1 Crónicas', testament: 'AT', chapters: 29 },
  { name: '2 Crónicas', testament: 'AT', chapters: 36 },
  { name: 'Esdras', testament: 'AT', chapters: 10 },
  { name: 'Nehemías', testament: 'AT', chapters: 13 },
  { name: 'Ester', testament: 'AT', chapters: 10 },
  { name: 'Job', testament: 'AT', chapters: 42 },
  { name: 'Salmos', testament: 'AT', chapters: 150 },
  { name: 'Proverbios', testament: 'AT', chapters: 31 },
  { name: 'Eclesiastés', testament: 'AT', chapters: 12 },
  { name: 'Cantares', testament: 'AT', chapters: 8 },
  { name: 'Isaías', testament: 'AT', chapters: 66 },
  { name: 'Jeremías', testament: 'AT', chapters: 52 },
  { name: 'Lamentaciones', testament: 'AT', chapters: 5 },
  { name: 'Ezequiel', testament: 'AT', chapters: 48 },
  { name: 'Daniel', testament: 'AT', chapters: 12 },
  { name: 'Oseas', testament: 'AT', chapters: 14 },
  { name: 'Joel', testament: 'AT', chapters: 3 },
  { name: 'Amós', testament: 'AT', chapters: 9 },
  { name: 'Abdías', testament: 'AT', chapters: 1 },
  { name: 'Jonás', testament: 'AT', chapters: 4 },
  { name: 'Miqueas', testament: 'AT', chapters: 7 },
  { name: 'Nahúm', testament: 'AT', chapters: 3 },
  { name: 'Habacuc', testament: 'AT', chapters: 3 },
  { name: 'Sofonías', testament: 'AT', chapters: 3 },
  { name: 'Hageo', testament: 'AT', chapters: 2 },
  { name: 'Zacarías', testament: 'AT', chapters: 14 },
  { name: 'Malaquías', testament: 'AT', chapters: 4 },

  // Nuevo Testamento (27)
  { name: 'Mateo', testament: 'NT', chapters: 28 },
  { name: 'Marcos', testament: 'NT', chapters: 16 },
  { name: 'Lucas', testament: 'NT', chapters: 24 },
  { name: 'Juan', testament: 'NT', chapters: 21 },
  { name: 'Hechos', testament: 'NT', chapters: 28 },
  { name: 'Romanos', testament: 'NT', chapters: 16 },
  { name: '1 Corintios', testament: 'NT', chapters: 16 },
  { name: '2 Corintios', testament: 'NT', chapters: 13 },
  { name: 'Gálatas', testament: 'NT', chapters: 6 },
  { name: 'Efesios', testament: 'NT', chapters: 6 },
  { name: 'Filipenses', testament: 'NT', chapters: 4 },
  { name: 'Colosenses', testament: 'NT', chapters: 4 },
  { name: '1 Tesalonicenses', testament: 'NT', chapters: 5 },
  { name: '2 Tesalonicenses', testament: 'NT', chapters: 3 },
  { name: '1 Timoteo', testament: 'NT', chapters: 6 },
  { name: '2 Timoteo', testament: 'NT', chapters: 4 },
  { name: 'Tito', testament: 'NT', chapters: 3 },
  { name: 'Filemón', testament: 'NT', chapters: 1 },
  { name: 'Hebreos', testament: 'NT', chapters: 13 },
  { name: 'Santiago', testament: 'NT', chapters: 5 },
  { name: '1 Pedro', testament: 'NT', chapters: 5 },
  { name: '2 Pedro', testament: 'NT', chapters: 3 },
  { name: '1 Juan', testament: 'NT', chapters: 5 },
  { name: '2 Juan', testament: 'NT', chapters: 1 },
  { name: '3 Juan', testament: 'NT', chapters: 1 },
  { name: 'Judas', testament: 'NT', chapters: 1 },
  { name: 'Apocalipsis', testament: 'NT', chapters: 22 }
];

const BIBLE_VERSIONS = [
  { id: 'RVR1960', name: 'Reina Valera 1960 (RVR1960)' },
  { id: 'NVI', name: 'Nueva Versión Internacional (NVI)' },
  { id: 'LBLA', name: 'La Biblia de las Américas (LBLA)' },
  { id: 'DHH', name: 'Dios Habla Hoy (DHH)' },
  { id: 'PDT', name: 'Palabra de Dios para Todos (PDT)' },
  { id: 'NTV', name: 'Nueva Traducción Viviente (NTV)' }
];

export function BibleView() {
  const [selectedVersion, setSelectedVersion] = useState<string>('RVR1960');
  const [selectedTestament, setSelectedTestament] = useState<'AT' | 'NT'>('NT');
  const [selectedBook, setSelectedBook] = useState<string>('Juan');
  const [selectedChapter, setSelectedChapter] = useState<number>(3);
  const [searchFilter, setSearchFilter] = useState('');
  
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');

  const currentBookData = CANON_BOOKS.find((b) => b.name === selectedBook) || CANON_BOOKS[42];

  // Carga asíncrona conectada al API
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`/api/biblia?libro=${encodeURIComponent(selectedBook)}&capitulo=${selectedChapter}&version=${selectedVersion}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setVerses(data.verses || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error cargando pasaje bíblico:', err);
        if (isMounted) {
          setVerses([]);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedBook, selectedChapter, selectedVersion]);

  const handleBookChange = (bookName: string) => {
    setSelectedBook(bookName);
    setSelectedChapter(1);
  };

  const handleCopyChapter = () => {
    const textToCopy = verses.map((v) => `${v.verse}. ${v.text}`).join('\n');
    navigator.clipboard.writeText(`${selectedBook} ${selectedChapter} (${selectedVersion})\n\n${textToCopy}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredBooks = CANON_BOOKS.filter(
    (b) =>
      b.testament === selectedTestament &&
      b.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm': return 'text-xs sm:text-sm';
      case 'lg': return 'text-base sm:text-lg';
      default: return 'text-sm sm:text-base';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 antialiased text-[#2D3831] dark:text-slate-200">
      
      {/* 1. ENCABEZADO Y SELECTOR DE VERSIONES */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E2DEC9] dark:border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#E8F0EA] dark:bg-slate-800 text-[#7C9885] dark:text-emerald-400">
              <BookOpen className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#7C9885] dark:text-emerald-400">
              Santas Escrituras
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D3831] dark:text-emerald-100">
            {selectedBook} {selectedChapter}
          </h1>
        </div>

        {/* Controles de Versión y Testamento */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Selector de Traducción */}
          <select
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(e.target.value)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#FAF8F3] dark:bg-slate-900 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-200 outline-none focus:border-[#7C9885] cursor-pointer"
          >
            {BIBLE_VERSIONS.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>

          {/* Testamento */}
          <div className="flex gap-1 p-1 bg-[#E8F0EA] dark:bg-slate-800 rounded-xl border border-[#C5D8CC]/60 dark:border-slate-700">
            <button
              onClick={() => setSelectedTestament('AT')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedTestament === 'AT' ? 'bg-[#7C9885] text-white shadow-xs' : 'text-[#526157] dark:text-slate-300'
              }`}
            >
              AT (39)
            </button>
            <button
              onClick={() => setSelectedTestament('NT')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedTestament === 'NT' ? 'bg-[#7C9885] text-white shadow-xs' : 'text-[#526157] dark:text-slate-300'
              }`}
            >
              NT (27)
            </button>
          </div>
        </div>
      </div>

      {/* 2. SPLIT CANÓNICO: SELECTOR DE LIBROS (4 Cols) & LECTURA (8 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Panel Lateral: Libros y Capítulos */}
        <div className="lg:col-span-4 bg-[#FAF8F3] dark:bg-slate-900/70 border border-[#E2DEC9] dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-xs">
          
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#7C9885]" />
            <input
              type="text"
              placeholder="Buscar libro bíblico..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-200 focus:outline-none focus:border-[#7C9885]"
            />
          </div>

          <div className="grid grid-cols-2 gap-1.5 max-h-[260px] overflow-y-auto pr-1">
            {filteredBooks.map((b) => {
              const isSelected = selectedBook === b.name;
              return (
                <button
                  key={b.name}
                  onClick={() => handleBookChange(b.name)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all cursor-pointer truncate ${
                    isSelected
                      ? 'bg-[#7C9885] text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 border border-[#E8E4D5] dark:border-slate-700/80 text-[#2D3831] dark:text-slate-200 hover:border-[#7C9885]'
                  }`}
                >
                  {b.name}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#E8E4D5] dark:border-slate-700/80 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#66756C] dark:text-slate-400 uppercase">Capítulos</span>
              <span className="font-semibold text-[#7C9885] dark:text-emerald-400">{currentBookData.chapters} caps</span>
            </div>
            
            <div className="grid grid-cols-6 gap-1.5 max-h-[160px] overflow-y-auto pr-1">
              {Array.from({ length: currentBookData.chapters }, (_, i) => i + 1).map((cap) => {
                const isSelected = selectedChapter === cap;
                return (
                  <button
                    key={cap}
                    onClick={() => setSelectedChapter(cap)}
                    className={`h-8 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#7C9885] text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 border border-[#E8E4D5] dark:border-slate-700/80 text-[#526157] dark:text-slate-300 hover:border-[#7C9885]'
                    }`}
                  >
                    {cap}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Panel de Lectura del Capítulo */}
        <div className="lg:col-span-8 bg-[#FAF8F3] dark:bg-slate-900/80 border border-[#E2DEC9] dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DEC9] dark:border-slate-800 pb-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#7C9885] dark:text-emerald-400">
                Lectura Sagrada
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#2D3831] dark:text-emerald-100">
                {selectedBook} {selectedChapter}
              </h2>
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

          {/* Versículos */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3 text-[#7C9885]">
              <Loader2 className="w-7 h-7 animate-spin" />
              <p className="text-xs font-semibold text-[#66756C] dark:text-slate-400">
                Cargando {selectedBook} {selectedChapter} ({selectedVersion})...
              </p>
            </div>
          ) : verses.length > 0 ? (
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
          ) : (
            <div className="py-16 text-center text-xs text-[#66756C] dark:text-slate-400">
              No se encontraron versículos disponibles para este capítulo en la versión seleccionada.
            </div>
          )}

          {/* Navegación Inferior */}
          <div className="pt-6 border-t border-[#E8E4D5] dark:border-slate-800 flex items-center justify-between gap-4">
            <button
              disabled={selectedChapter <= 1}
              onClick={() => setSelectedChapter((prev) => Math.max(1, prev - 1))}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-[#DCD7C5] dark:border-slate-700 text-xs font-bold text-[#526157] dark:text-slate-300 hover:bg-[#E8F0EA] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" /> Capítulo Anterior
            </button>

            <button
              disabled={selectedChapter >= currentBookData.chapters}
              onClick={() => setSelectedChapter((prev) => Math.min(currentBookData.chapters, prev + 1))}
              className="px-4 py-2 rounded-xl bg-[#7C9885] hover:bg-[#6B8774] text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              Capítulo Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}