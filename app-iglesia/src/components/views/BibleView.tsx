'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

const LIBROS_BIBLIA = [
  'Génesis', 'Éxodo', 'Levítico', 'Números', 'Deuteronomio',
  'Josué', 'Jueces', 'Rut', '1 Samuel', '2 Samuel', '1 Reyes', '2 Reyes',
  '1 Crónicas', '2 Crónicas', 'Esdras', 'Nehemías', 'Ester', 'Job', 'Salmos',
  'Proverbios', 'Eclesiastés', 'Cantares', 'Isaías', 'Jeremías', 'Lamentaciones',
  'Ezequiel', 'Daniel', 'Oseas', 'Joel', 'Amós', 'Abdías', 'Jonás', 'Miqueas',
  'Nahúm', 'Habacuc', 'Sofonías', 'Hageo', 'Zacarías', 'Malaquías', 'Mateo',
  'Marcos', 'Lucas', 'Juan', 'Hechos', 'Romanos', '1 Corintios', '2 Corintios',
  'Gálatas', 'Efesios', 'Filipenses', 'Colosenses', '1 Tesalonicenses',
  '2 Tesalonicenses', '1 Timoteo', '2 Timoteo', 'Tito', 'Filemón', 'Hebreos',
  'Santiago', '1 Pedro', '2 Pedro', '1 Juan', '2 Juan', '3 Juan', 'Judas', 'Apocalipsis'
];

// Mapeo numérico oficial canónico (1 a 66)
const LIBROS_ID_MAP: Record<string, number> = {
  'Génesis': 1, 'Éxodo': 2, 'Levítico': 3, 'Números': 4, 'Deuteronomio': 5,
  'Josué': 6, 'Jueces': 7, 'Rut': 8, '1 Samuel': 9, '2 Samuel': 10,
  '1 Reyes': 11, '2 Reyes': 12, '1 Crónicas': 13, '2 Crónicas': 14,
  'Esdras': 15, 'Nehemías': 16, 'Ester': 17, 'Job': 18, 'Salmos': 19,
  'Proverbios': 20, 'Eclesiastés': 21, 'Cantares': 22, 'Isaías': 23,
  'Jeremías': 24, 'Lamentaciones': 25, 'Ezequiel': 26, 'Daniel': 27,
  'Oseas': 28, 'Joel': 29, 'Amós': 30, 'Abdías': 31, 'Jonás': 32,
  'Miqueas': 33, 'Nahúm': 34, 'Habacuc': 35, 'Sofonías': 36, 'Hageo': 37,
  'Zacarías': 38, 'Malaquías': 39, 'Mateo': 40, 'Marcos': 41, 'Lucas': 42,
  'Juan': 43, 'Hechos': 44, 'Romanos': 45, '1 Corintios': 46, '2 Corintios': 47,
  'Gálatas': 48, 'Efesios': 49, 'Filipenses': 50, 'Colosenses': 51,
  '1 Tesalonicenses': 52, '2 Tesalonicenses': 53, '1 Timoteo': 54, '2 Timoteo': 55,
  'Tito': 56, 'Filemón': 57, 'Hebreos': 58, 'Santiago': 59, '1 Pedro': 60,
  '2 Pedro': 61, '1 Juan': 62, '2 Juan': 63, '3 Juan': 64, 'Judas': 65,
  'Apocalipsis': 66
};

interface Versiculo {
  verse: number;
  text: string;
}

export function BibleView() {
  const [libro, setLibro] = useState('Génesis');
  const [capitulo, setCapitulo] = useState('1');
  const [versiculos, setVersiculos] = useState<Versiculo[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCapitulo() {
      setLoading(true);
      setErrorMsg(null);
      
      const bookId = LIBROS_ID_MAP[libro] || 1;
      const capNum = parseInt(capitulo, 10) || 1;

      try {
        // 1. Intento primario: Bolls API (Soporta CORS directo en navegador)
        const primaryRes = await fetch(`https://bolls.life/get-chapter/RVR1960/${bookId}/${capNum}/`);
        
        if (primaryRes.ok) {
          const data = await primaryRes.json();
          if (Array.isArray(data) && data.length > 0) {
            const list: Versiculo[] = data.map((v: { verse: number; text: string }) => ({
              verse: v.verse,
              text: v.text.replace(/<[^>]*>?/gm, '').trim()
            }));
            setVersiculos(list);
            setLoading(false);
            return;
          }
        }

        // 2. Intento secundario: GitHub Raw CDN (Estructura de respaldo en JSON)
        const slug = libro.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
        const secondaryRes = await fetch(`https://bible-api.deno.dev/api/read/rv1960/${slug}/${capNum}`);
        
        if (secondaryRes.ok) {
          const data = await secondaryRes.json();
          if (Array.isArray(data?.vers) && data.vers.length > 0) {
            const list: Versiculo[] = data.vers.map((v: { number: number; verse: string }) => ({
              verse: v.number,
              text: v.verse.trim()
            }));
            setVersiculos(list);
            setLoading(false);
            return;
          }
        }

        // Si ninguna fuente responde
        setVersiculos([]);
        setErrorMsg('No se pudieron obtener los versículos para este capítulo.');
      } catch (err) {
        console.error('Error al cargar pasaje bíblico:', err);
        setErrorMsg('Error de conexión al consultar las Sagradas Escrituras.');
      } finally {
        setLoading(false);
      }
    }

    fetchCapitulo();
  }, [libro, capitulo]);

  const handlePrevCapitulo = () => {
    const num = parseInt(capitulo, 10);
    if (num > 1) {
      setCapitulo((num - 1).toString());
    }
  };

  const handleNextCapitulo = () => {
    const num = parseInt(capitulo, 10);
    setCapitulo((num + 1).toString());
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 antialiased">
      {/* Encabezado */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="bg-[#E8F0EA] text-[#546E5C] dark:bg-emerald-950/50 dark:text-emerald-300 text-[11px] font-bold px-3 py-1 rounded-full border border-[#7C9885]/30">
          Escrituras Sagradas
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2D3831] dark:text-emerald-100 flex items-center justify-center gap-2">
          <BookOpen className="w-6 h-6 text-[#7C9885]" /> Santa Biblia
        </h2>
        <p className="text-xs sm:text-sm text-[#66756C] dark:text-slate-400">
          Lectura y meditación de la Palabra de Dios — Reina-Valera 1960
        </p>
      </div>

      {/* Selector de Libro, Capítulo y Navegación */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAF8F3] dark:bg-slate-900 p-4 rounded-3xl shadow-xs border border-[#E2DEC9] dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={libro}
            onChange={(e) => { setLibro(e.target.value); setCapitulo('1'); }}
            className="bg-white dark:bg-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl outline-none border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-100 focus:border-[#7C9885] cursor-pointer"
          >
            {LIBROS_BIBLIA.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#66756C] dark:text-slate-400">Capítulo:</span>
            <input
              type="number"
              min="1"
              max="150"
              value={capitulo}
              onChange={(e) => setCapitulo(e.target.value || '1')}
              className="w-16 bg-white dark:bg-slate-950 text-xs font-bold p-2.5 rounded-xl outline-none text-center border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-100 focus:border-[#7C9885]"
            />
          </div>
        </div>

        {/* Botones de navegación directa */}
        <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
          <button
            type="button"
            onClick={handlePrevCapitulo}
            disabled={parseInt(capitulo, 10) <= 1}
            className="p-2.5 bg-white dark:bg-slate-950 hover:bg-[#E8F0EA] dark:hover:bg-slate-800 disabled:opacity-40 text-[#2D3831] dark:text-slate-200 border border-[#DCD7C5] dark:border-slate-700 rounded-xl cursor-pointer transition-colors"
            title="Capítulo anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextCapitulo}
            className="p-2.5 bg-white dark:bg-slate-950 hover:bg-[#E8F0EA] dark:hover:bg-slate-800 text-[#2D3831] dark:text-slate-200 border border-[#DCD7C5] dark:border-slate-700 rounded-xl cursor-pointer transition-colors"
            title="Capítulo siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Contenedor del Texto Bíblico */}
      <div className="bg-[#FAF8F3] dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-[#E2DEC9] dark:border-slate-800 shadow-xs transition-colors">
        <div className="border-b border-[#E8E4D5] dark:border-slate-800 pb-4 mb-6 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-[#2D3831] dark:text-emerald-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#7C9885]" /> {libro} {capitulo}
          </h2>
          <span className="text-xs font-semibold text-[#7C9885] dark:text-emerald-400 bg-[#E8F0EA] dark:bg-slate-800 px-3 py-1 rounded-full">
            Reina-Valera 1960
          </span>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-2 text-[#7C9885]">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p className="text-xs font-semibold text-[#66756C] dark:text-slate-400">
              Cargando las Escrituras...
            </p>
          </div>
        )}

        {errorMsg && !loading && (
          <div className="p-4 bg-[#F8F5EC] dark:bg-slate-800/80 border border-[#E8E4D5] dark:border-slate-700 text-[#E08A72] dark:text-amber-400 rounded-2xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {errorMsg}
          </div>
        )}

        {!loading && !errorMsg && versiculos.length > 0 && (
          <div className="space-y-3.5 leading-relaxed text-sm sm:text-base text-[#3A473E] dark:text-slate-200">
            {versiculos.map((v) => (
              <p key={v.verse} className="text-justify leading-relaxed">
                <sup className="font-bold text-[#7C9885] dark:text-emerald-400 mr-1.5 text-xs select-none">
                  {v.verse}
                </sup>
                {v.text}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}