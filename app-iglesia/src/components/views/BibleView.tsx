'use client';

import React, { useState, useEffect } from 'react';

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
      try {
        const res = await fetch(`/api/biblia?libro=${encodeURIComponent(libro)}&capitulo=${capitulo}`);
        const data = await res.json();

        if (data.verses && Array.isArray(data.verses) && data.verses.length > 0) {
          setVersiculos(data.verses);
        } else {
          setVersiculos([]);
          setErrorMsg('No se encontraron versículos para este capítulo.');
        }
      } catch (err) {
        console.error('Error al cargar pasaje bíblico:', err);
        setErrorMsg('Error de conexión al consultar la Biblia.');
      } finally {
        setLoading(false);
      }
    }

    fetchCapitulo();
  }, [libro, capitulo]);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Selector de Libro y Capítulo */}
      <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-sky-100 dark:border-slate-800">
        <select
          value={libro}
          onChange={(e) => { setLibro(e.target.value); setCapitulo('1'); }}
          className="bg-slate-100 dark:bg-slate-800 text-xs font-bold p-3 rounded-2xl outline-none border border-transparent focus:border-[#486379] dark:text-slate-200 cursor-pointer"
        >
          {LIBROS_BIBLIA.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Capítulo:</span>
          <input
            type="number"
            min="1"
            max="150"
            value={capitulo}
            onChange={(e) => setCapitulo(e.target.value || '1')}
            className="w-16 bg-slate-100 dark:bg-slate-800 text-xs font-bold p-3 rounded-2xl outline-none text-center border border-transparent focus:border-[#486379] dark:text-slate-200"
          />
        </div>
      </div>

      {/* Contenedor del Texto */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-xl border border-sky-100 dark:border-slate-800 transition-colors">
        <h2 className="text-xl sm:text-2xl font-black text-[#486379] dark:text-sky-300 mb-6 flex items-center gap-2">
          <span>📖</span> {libro} {capitulo}
        </h2>

        {loading && (
          <div className="py-12 text-center space-y-2">
            <p className="text-xs font-bold text-slate-400 animate-pulse">Cargando las Escrituras...</p>
          </div>
        )}

        {errorMsg && !loading && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-2xl text-xs font-bold">
            ⚠️ {errorMsg}
          </div>
        )}

        {!loading && !errorMsg && versiculos.length > 0 && (
          <div className="space-y-4 leading-relaxed text-sm sm:text-base text-slate-700 dark:text-slate-200">
            {versiculos.map((v) => (
              <p key={v.verse} className="text-justify">
                <sup className="font-bold text-[#eca489] mr-1.5 text-xs">{v.verse}</sup>
                {v.text}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}