'use client';

import React, { useEffect, useState } from 'react';

interface BulletinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BulletinModal({ isOpen, onClose }: BulletinModalProps) {
  const [bulletinData, setBulletinData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/boletin')
        .then((res) => res.json())
        .then((data) => {
          setBulletinData(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-sky-100 dark:border-slate-800 transition-colors duration-300">
        {/* Cabecera del Modal */}
        <div className="bg-[#486379] dark:bg-slate-800 text-white p-6 flex justify-between items-center border-b border-transparent dark:border-slate-700">
          <div>
            <span className="bg-[#eca489] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
              Boletín Informativo
            </span>
            <h3 className="text-xl font-black mt-2 text-white dark:text-sky-300">
              📜 Boletín Sabático
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white font-bold transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {/* Creador de Contenido / Lectura */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {loading ? (
            <div className="py-16 text-center text-xs font-bold text-slate-400 dark:text-slate-500">
              Sincronizando boletín con la base de datos...
            </div>
          ) : bulletinData ? (
            <div className="space-y-4">
              <div className="border-b dark:border-slate-800 pb-3">
                <h4 className="text-lg font-black text-[#486379] dark:text-amber-400">
                  {bulletinData.titulo || 'Boletín Sabático de la Semana'}
                </h4>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Sábado, {bulletinData.fecha || 'Fecha no disponible'}
                </p>
              </div>

              {/* Anuncios Principales */}
              <div className="bg-[#f0f6fb] dark:bg-slate-800 p-5 rounded-2xl border border-sky-100 dark:border-slate-700 space-y-2">
                <h5 className="text-xs font-bold text-[#486379] dark:text-sky-300 uppercase tracking-wider">
                  📢 Anuncios Eclesiales
                </h5>
                <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                  {bulletinData.anuncios || 'No hay anuncios registrados para este sábado.'}
                </p>
              </div>

              {/* Programa del Culto */}
              {bulletinData.programa && (
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-[#eca489] dark:text-amber-400 uppercase tracking-wider">
                    ⛪ Orden del Culto
                  </h5>
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                    {bulletinData.programa}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-16 text-center text-xs text-slate-400 dark:text-slate-500 font-bold">
              No hay un boletín cargado para este sábado.
            </div>
          )}
        </div>

        {/* Pie del Modal */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#eca489] hover:bg-[#e49375] text-white font-bold text-xs rounded-full shadow-xs cursor-pointer transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}