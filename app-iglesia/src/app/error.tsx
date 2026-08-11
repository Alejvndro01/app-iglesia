'use client';

import React, { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error no controlado capturado en boundary:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white dark:bg-slate-900 border border-sky-100 dark:border-slate-800 rounded-3xl p-8 max-w-md shadow-xl space-y-4">
        <span className="text-5xl block">⚠️</span>
        <h2 className="text-xl font-black text-[#486379] dark:text-sky-300">
          Algo no salió como esperábamos
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Ocurrió un inconveniente temporal en la plataforma. Puedes intentar recargar la vista.
        </p>

        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-[#eca489] hover:bg-[#e49375] text-white font-bold text-xs rounded-full shadow-md transition-colors cursor-pointer"
        >
          Reintentar Cargar
        </button>
      </div>
    </div>
  );
}