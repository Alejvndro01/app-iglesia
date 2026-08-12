'use client';

import React, { useState, useEffect } from 'react';

const LIBROS_BIBLIA = [
  'Génesis', 'Éxodo', 'Levítico', 'Números', 'Deuteronomio',
  'Josué', 'Jueces', 'Rut', '1 Samuel', '2 Samuel', '1 Reyes', '2 Reyes',
  'Salmos', 'Proverbios', 'Isaías', 'Mateo', 'Marcos', 'Lucas', 'Juan', 'Hechos', 'Romanos', 'Apocalipsis'
];

export function BibleView() {
  const [libro, setLibro] = useState('Salmos');
  const [capitulo, setCapitulo] = useState('23');
  const [contenido, setContenido] = useState<{ number: number; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchCapitulo() {
      setLoading(true);
      try {
        const res = await fetch(`/api/biblia?libro=${encodeURIComponent(libro)}&capitulo=${capitulo}`);
        const data = await res.json();
        if (data.verses) {
          setContenido(data.verses);
        }
      } catch (err) {
        console.error('Error cargando pasaje bíblico', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCapitulo();
  }, [libro, capitulo]);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Selector de Libro y Capítulo */}
      <div className="flex flex-wrap gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-sky-100 dark:border-slate-800">
        <select
          value={libro}
          onChange={(e) => { setLibro(e.target.value); setCapitulo('1'); }}
          className="bg-slate-100 dark:bg-slate-800 text-xs font-bold p-3 rounded-2xl outline-none"
        >
          {LIBROS_BIBLIA.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          max="150"
          value={capitulo}
          onChange={(e) => setCapitulo(e.target.value)}
          className="w-20 bg-slate-100 dark:bg-slate-800 text-xs font-bold p-3 rounded-2xl outline-none text-center"
        />
      </div>

      {/* Visor del Texto Bíblico */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-xl border border-sky-100 dark:border-slate-800">
        <h2 className="text-xl font-black text-[#486379] dark:text-sky-300 mb-6">
          📖 {libro} {capitulo}
        </h2>

        {loading ? (
          <p className="text-xs text-slate-400 animate-pulse">Cargando las Escrituras...</p>
        ) : (
          <div className="space-y-3 leading-relaxed text-sm sm:text-base">
            {contenido.map((v) => (
              <p key={v.number} className="text-slate-700 dark:text-slate-200">
                <sup className="font-bold text-[#eca489] mr-1.5">{v.number}</sup>
                {v.text}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}