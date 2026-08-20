'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { apiClient } from '@/lib/api-client';
import { 
  BookOpen, 
  Calendar, 
  Loader2, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  X, 
  Copy, 
  Check 
} from 'lucide-react';

interface LessonDay {
  id?: string | number;
  title: string;
  date: string;
  html?: string;
}

interface LessonData {
  portada?: string;
  tituloSemana?: string;
  fechaInicio?: string;
  fechaFin?: string;
  dias?: LessonDay[];
}

interface VerseData {
  verse: number;
  text: string;
}

interface ScriptureModalState {
  isOpen: boolean;
  rawRef: string;
  book: string;
  chapter: number;
  verseStart?: number;
  verseEnd?: number;
}

interface SabbathLessonPageViewProps {
  showToast?: (msg: string) => void;
  navigateTo?: (page: string) => void;
}

// Lista canónica completa de libros
const BIBLE_BOOKS_REGEX = [
  'Génesis', 'Genesis', 'Éxodo', 'Exodo', 'Levítico', 'Levitico', 'Números', 'Numeros', 'Deuteronomio',
  'Josué', 'Josue', 'Jueces', 'Rut', '1 Samuel', '2 Samuel', '1 Reyes', '2 Reyes',
  '1 Crónicas', '1 Cronicas', '2 Crónicas', '2 Cronicas', 'Esdras', 'Nehemías', 'Nehemias',
  'Ester', 'Job', 'Salmos', 'Salmo', 'Proverbios', 'Eclesiastés', 'Eclesiastes', 'Cantares',
  'Isaías', 'Isaias', 'Jeremías', 'Jeremias', 'Lamentaciones', 'Ezequiel', 'Daniel',
  'Oseas', 'Joel', 'Amós', 'Amos', 'Abdías', 'Abdias', 'Jonás', 'Jonas', 'Miqueas',
  'Nahúm', 'Nahum', 'Habacuc', 'Sofonías', 'Sofonias', 'Hageo', 'Zacarías', 'Zacarias', 'Malaquías', 'Malaquias',
  'Mateo', 'Marcos', 'Lucas', 'Juan', 'Hechos', 'Romanos',
  '1 Corintios', '2 Corintios', 'Gálatas', 'Galatas', 'Efesios', 'Filipenses', 'Colosenses',
  '1 Tesalonicenses', '2 Tesalonicenses', '1 Timoteo', '2 Timoteo', 'Tito', 'Filemón', 'Filemon',
  'Hebreos', 'Santiago', '1 Pedro', '2 Pedro', '1 Juan', '2 Juan', '3 Juan', 'Judas', 'Apocalipsis'
];

export function SabbathLessonPageView({ showToast }: SabbathLessonPageViewProps) {
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  
  // Tamaño tipográfico del lector
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');

  // Estado del Modal Bíblico
  const [modalState, setModalState] = useState<ScriptureModalState>({
    isOpen: false,
    rawRef: '',
    book: 'Juan',
    chapter: 3,
    verseStart: undefined,
    verseEnd: undefined
  });
  
  const [bibleVersion, setBibleVersion] = useState<string>('RVR1960');
  const [modalVerses, setModalVerses] = useState<VerseData[]>([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    apiClient.getLeccionActual()
      .then((data: LessonData) => {
        setLessonData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error cargando lección:', err);
        setError(true);
        setLoading(false);
        if (showToast) showToast('No se pudo sincronizar la lección actual.');
      });
  }, [showToast]);

  // Carga asíncrona de versículos al abrir el modal o cambiar la traducción
  useEffect(() => {
    if (!modalState.isOpen || !modalState.book || !modalState.chapter) return;

    let isMounted = true;
    setModalLoading(true);

    fetch(`/api/biblia?libro=${encodeURIComponent(modalState.book)}&capitulo=${modalState.chapter}&version=${bibleVersion}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;

        let allVerses: VerseData[] = data.verses || [];

        // Filtrado por rango exacto si se especificó
        if (modalState.verseStart !== undefined) {
          const vStart = modalState.verseStart;
          const vEnd = modalState.verseEnd || vStart;
          allVerses = allVerses.filter((v) => v.verse >= vStart && v.verse <= vEnd);
        }

        setModalVerses(allVerses);
        setModalLoading(false);
      })
      .catch((err) => {
        console.error('Error al cargar pasaje modal:', err);
        if (isMounted) {
          setModalVerses([]);
          setModalLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [modalState, bibleVersion]);

  // Parser optimizado de citas bíblicas con regex flexible
  const parsedDayHtml = useMemo(() => {
    const rawHtml = lessonData?.dias?.[selectedDayIndex]?.html || '';
    if (!rawHtml) return '<p class="text-xs text-[#66756C]">Contenido no disponible para este día.</p>';

    // Ordenar libros por longitud descendente para evitar colisiones (ej. "1 Juan" antes de "Juan")
    const sortedBooks = [...BIBLE_BOOKS_REGEX].sort((a, b) => b.length - a.length);
    const booksPattern = sortedBooks.join('|').replace(/\s+/g, '\\s+');

    // Soporta: Libro + Capítulo + (opcional: espacios + ":" + espacios + versículos y guiones largos)
    const bibleRegex = new RegExp(
      `\\b(${booksPattern})\\s+(\\d+)(?:\\s*[:.,]\\s*(\\d+)(?:\\s*[-–—]\\s*(\\d+))?)?`,
      'gi'
    );

    return rawHtml.replace(bibleRegex, (match, book, chapter, startVerse, endVerse) => {
      const vStart = startVerse ? startVerse.trim() : '';
      const vEnd = endVerse ? endVerse.trim() : '';
      const cleanBook = book.trim();
      
      const referenceLabel = `${cleanBook} ${chapter}${vStart ? `:${vStart}${vEnd ? `-${vEnd}` : ''}` : ''}`;
      
      return `<button 
        type="button" 
        data-bible-ref="${referenceLabel}" 
        data-book="${cleanBook}" 
        data-chapter="${chapter}" 
        data-vstart="${vStart}" 
        data-vend="${vEnd}" 
        class="inline-flex items-center gap-1 font-bold text-[#3B5E46] dark:text-emerald-300 bg-[#E8F0EA] dark:bg-slate-800 hover:bg-[#7C9885] hover:text-white px-2 py-0.5 rounded-lg cursor-pointer transition-all border border-[#C5D8CC]/80 dark:border-slate-700 mx-0.5 my-0.5 select-none text-xs align-baseline"
      >
        📖 ${referenceLabel}
      </button>`;
    });
  }, [lessonData, selectedDayIndex]);

  // Delegación de eventos para clicks en botones de versículos
  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = (e.target as HTMLElement).closest('button[data-bible-ref]');
    if (!target) return;

    e.preventDefault();
    const rawRef = target.getAttribute('data-bible-ref') || '';
    const book = target.getAttribute('data-book') || 'Juan';
    const chapter = parseInt(target.getAttribute('data-chapter') || '1', 10);
    const vStartStr = target.getAttribute('data-vstart');
    const vEndStr = target.getAttribute('data-vend');

    setModalState({
      isOpen: true,
      rawRef,
      book,
      chapter,
      verseStart: vStartStr ? parseInt(vStartStr, 10) : undefined,
      verseEnd: vEndStr ? parseInt(vEndStr, 10) : undefined
    });
  };

  const handleCopyModalText = () => {
    const textToCopy = modalVerses.map((v) => `${v.verse}. ${v.text}`).join('\n');
    navigator.clipboard.writeText(`${modalState.rawRef} (${bibleVersion})\n\n${textToCopy}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center py-24 space-y-4 text-[#7C9885]">
        <div className="p-4 rounded-3xl bg-[#E8F0EA] dark:bg-slate-800 border border-[#C5D8CC] dark:border-slate-700 animate-pulse">
          <Loader2 className="w-8 h-8 animate-spin text-[#7C9885] dark:text-emerald-400" />
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#526157] dark:text-slate-400">
          Sincronizando Lección Sabática...
        </p>
      </div>
    );
  }

  if (error || !lessonData) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-[#FAF8F3] dark:bg-slate-900 border border-[#E2DEC9] dark:border-slate-800 rounded-3xl text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-[#FAF0E6] dark:bg-amber-950/40 text-[#E08A72] flex items-center justify-center mx-auto border border-amber-200/50">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-serif font-bold text-base text-[#2D3831] dark:text-slate-200">
            Error al sincronizar la lección
          </h3>
          <p className="text-xs text-[#66756C] dark:text-slate-400 leading-relaxed">
            No se pudo obtener la guía de estudio diario. Comprueba tu conexión o inténtalo nuevamente más tarde.
          </p>
        </div>
      </div>
    );
  }

  const currentDay = lessonData.dias?.[selectedDayIndex];
  const totalDays = lessonData.dias?.length || 0;

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm': return 'text-xs sm:text-sm';
      case 'lg': return 'text-base sm:text-lg';
      default: return 'text-sm sm:text-base';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 antialiased text-[#2D3831] dark:text-slate-200">
      
      {/* 1. HERO EDITORIAL DE LA SEMANA */}
      <div className="rounded-3xl bg-[#FAF8F3] dark:bg-slate-900 border border-[#E2DEC9] dark:border-slate-800 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {lessonData.portada ? (
            <img
              src={lessonData.portada}
              alt="Portada Lección"
              className="w-24 h-32 sm:w-28 sm:h-36 object-cover rounded-2xl shadow-md flex-shrink-0 border border-[#DCD7C5] dark:border-slate-700"
            />
          ) : (
            <div className="w-24 h-32 rounded-2xl bg-[#E8F0EA] dark:bg-slate-800 border border-[#C5D8CC] dark:border-slate-700 flex items-center justify-center text-[#7C9885] dark:text-emerald-400 flex-shrink-0">
              <BookOpen className="w-8 h-8" />
            </div>
          )}

          <div className="space-y-3 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0EA] dark:bg-slate-800 text-[#7C9885] dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-[#C5D8CC]/60 dark:border-slate-700">
              <Sparkles className="w-3 h-3" /> Guía de Estudio Diario • Escuela Sabática
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#2D3831] dark:text-emerald-100 leading-tight">
              {lessonData.tituloSemana || 'Guía de Estudio de las Sagradas Escrituras'}
            </h1>

            {(lessonData.fechaInicio || lessonData.fechaFin) && (
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-[#66756C] dark:text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-[#7C9885]" />
                <span>{lessonData.fechaInicio} al {lessonData.fechaFin}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. SPLIT READER STUDIO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar de Días (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-[#7C9885] dark:text-emerald-400">
              Plan Semanal
            </span>
            <span className="text-[11px] text-[#66756C] dark:text-slate-400 font-medium">
              Día {selectedDayIndex + 1} de {totalDays}
            </span>
          </div>

          <div className="space-y-2">
            {lessonData.dias?.map((day, index) => {
              const isSelected = selectedDayIndex === index;
              return (
                <button
                  key={day.id || index}
                  onClick={() => setSelectedDayIndex(index)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#7C9885] text-white border-[#6B8774] shadow-xs scale-[1.01]'
                      : 'bg-[#FAF8F3] dark:bg-slate-900/60 text-[#2D3831] dark:text-slate-200 border-[#E2DEC9] dark:border-slate-800 hover:border-[#7C9885]/60 hover:bg-[#E8F0EA]/40'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-emerald-100' : 'text-[#7C9885] dark:text-emerald-400'}`}>
                      {day.date || `Día ${index + 1}`}
                    </div>
                    <div className="text-xs font-bold truncate leading-snug">
                      {day.title}
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform ${isSelected ? 'translate-x-0.5 text-white' : 'text-[#8A9A8F]'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Lienzo de Lectura Principal (8 Cols) */}
        <div className="lg:col-span-8 bg-[#FAF8F3] dark:bg-slate-900/80 border border-[#E2DEC9] dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
          
          {currentDay ? (
            <>
              {/* Barra de Herramientas */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DEC9] dark:border-slate-800 pb-5">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#7C9885] dark:text-emerald-400">
                    {currentDay.date}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2D3831] dark:text-emerald-100 leading-tight">
                    {currentDay.title}
                  </h2>
                </div>

                {/* Ajuste de Tamaño de Fuente */}
                <div className="flex items-center gap-1 p-1 bg-[#E8F0EA] dark:bg-slate-800 rounded-xl border border-[#C5D8CC]/60 dark:border-slate-700 self-start sm:self-auto">
                  <button
                    onClick={() => setFontSize('sm')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      fontSize === 'sm' ? 'bg-[#7C9885] text-white shadow-xs' : 'text-[#526157] dark:text-slate-300'
                    }`}
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setFontSize('base')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      fontSize === 'base' ? 'bg-[#7C9885] text-white shadow-xs' : 'text-[#526157] dark:text-slate-300'
                    }`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('lg')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      fontSize === 'lg' ? 'bg-[#7C9885] text-white shadow-xs' : 'text-[#526157] dark:text-slate-300'
                    }`}
                  >
                    A+
                  </button>
                </div>
              </div>

              {/* Contenedor HTML con Parser de Citas Bíblicas */}
              <div
                onClick={handleContentClick}
                className={`prose prose-slate dark:prose-invert max-w-none leading-relaxed text-[#2D3831] dark:text-slate-300 ${getFontSizeClass()} [&>p]:mb-4 [&>h3]:font-serif [&>h3]:text-lg [&>h3]:font-bold [&>blockquote]:border-l-4 [&>blockquote]:border-[#7C9885] [&>blockquote]:pl-4 [&>blockquote]:italic`}
                dangerouslySetInnerHTML={{ __html: parsedDayHtml }}
              />

              {/* Navegación entre Días */}
              <div className="pt-6 border-t border-[#E8E4D5] dark:border-slate-800 flex items-center justify-between gap-4">
                <button
                  disabled={selectedDayIndex === 0}
                  onClick={() => setSelectedDayIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-[#DCD7C5] dark:border-slate-700 text-xs font-bold text-[#526157] dark:text-slate-300 hover:bg-[#E8F0EA] dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <ChevronLeft className="w-4 h-4" /> Día Anterior
                </button>

                <button
                  disabled={selectedDayIndex === totalDays - 1}
                  onClick={() => setSelectedDayIndex((prev) => Math.min(totalDays - 1, prev + 1))}
                  className="px-4 py-2 rounded-xl bg-[#7C9885] hover:bg-[#6B8774] text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  Siguiente Día <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-xs text-[#66756C] dark:text-slate-400">
              Selecciona un día del plan semanal para comenzar la lectura.
            </div>
          )}

        </div>

      </div>

      {/* 3. MODAL DE VERSÍCULO BÍBLICO INTERACTIVO */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-50 bg-[#2D3831]/60 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity animate-in fade-in duration-150">
          <div className="bg-[#FAF8F3] dark:bg-slate-900 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-[#E2DEC9] dark:border-slate-800 flex flex-col max-h-[80vh]">
            
            {/* Header del Modal */}
            <div className="bg-[#7C9885] dark:bg-slate-900 text-white p-5 border-b border-[#6B8774] dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/20 text-white">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-100 tracking-wider">Pasaje de Consulta</span>
                  <h3 className="text-lg font-serif font-bold text-white leading-none mt-0.5">
                    {modalState.rawRef}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setModalState({ ...modalState, isOpen: false })}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selector de Versión & Copiar */}
            <div className="px-5 py-3 bg-[#E8F0EA]/70 dark:bg-slate-800/80 border-b border-[#E2DEC9] dark:border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#66756C] dark:text-slate-400">Versión:</span>
                <select
                  value={bibleVersion}
                  onChange={(e) => setBibleVersion(e.target.value)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white dark:bg-slate-900 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-200 outline-none focus:border-[#7C9885] cursor-pointer"
                >
                  <option value="RVR1960">Reina Valera 1960 (RVR1960)</option>
                  <option value="NVI">Nueva Versión Internacional (NVI)</option>
                  <option value="LBLA">La Biblia de las Américas (LBLA)</option>
                  <option value="DHH">Dios Habla Hoy (DHH)</option>
                  <option value="PDT">Palabra de Dios para Todos (PDT)</option>
                  <option value="NTV">Nueva Traducción Viviente (NTV)</option>
                </select>
              </div>

              <button
                onClick={handleCopyModalText}
                disabled={modalLoading || modalVerses.length === 0}
                className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-[#DCD7C5] dark:border-slate-700 text-xs font-semibold text-[#526157] dark:text-slate-300 hover:bg-[#E8F0EA] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>

            {/* Contenido del Pasaje */}
            <div className="p-6 overflow-y-auto space-y-3 flex-1 text-sm font-serif leading-relaxed text-[#2D3831] dark:text-slate-200">
              {modalLoading ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-2 text-[#7C9885]">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-xs font-sans text-[#66756C] dark:text-slate-400">
                    Buscando en {bibleVersion}...
                  </span>
                </div>
              ) : modalVerses.length > 0 ? (
                modalVerses.map((v) => (
                  <p key={v.verse} className="flex items-start gap-2.5">
                    <span className="text-[11px] font-sans font-bold text-[#7C9885] dark:text-emerald-400 min-w-[20px] pt-0.5 select-none">
                      {v.verse}
                    </span>
                    <span>{v.text}</span>
                  </p>
                ))
              ) : (
                <div className="py-8 text-center text-xs font-sans text-[#66756C] dark:text-slate-400">
                  No se encontró el versículo en la versión seleccionada.
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="p-4 bg-[#FAF8F3] dark:bg-slate-900 border-t border-[#E2DEC9] dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setModalState({ ...modalState, isOpen: false })}
                className="px-5 py-2 bg-[#7C9885] hover:bg-[#6B8774] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
              >
                Cerrar Lectura
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export { SabbathLessonPageView as LessonView };