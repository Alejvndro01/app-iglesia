'use client';

import React from 'react';

interface BulletinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BulletinModal({ isOpen, onClose }: BulletinModalProps) {
  if (!isOpen) return null;

  // Datos estáticos del boletín para no depender de la base de datos
  const bulletinData = {
    titulo: 'Boletín Sabático',
    fecha: 'Sábado de Culto Especial',
    anuncios: `• Culto de Oración: Miércoles a las 19:30 hrs.
• Reunión de Jóvenes (JA): Sábado a las 18:00 hrs.
• Almuerzo Fraternal: Próximo sábado después del Culto Divino.
• Recepción de Sábado: Viernes a las 19:00 hrs vía Zoom.`,
    programa: `10:00 hrs - Escuela Sabática
11:15 hrs - Anuncios y Bienvenida
11:30 hrs - Culto Divino & Predicación
12:30 hrs - Cierre y Bendición Final`,
  };

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
              📜 {bulletinData.titulo}
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

        {/* Contenido del Boletín */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="border-b dark:border-slate-800 pb-3">
              <h4 className="text-lg font-black text-[#486379] dark:text-amber-400">
                IASD Central de Hualqui
              </h4>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {bulletinData.fecha}
              </p>
            </div>

            {/* Anuncios Principales */}
            <div className="bg-[#f0f6fb] dark:bg-slate-800 p-5 rounded-2xl border border-sky-100 dark:border-slate-700 space-y-2">
              <h5 className="text-xs font-bold text-[#486379] dark:text-sky-300 uppercase tracking-wider">
                📢 Anuncios Eclesiales
              </h5>
              <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {bulletinData.anuncios}
              </p>
            </div>

            {/* Programa del Culto */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-[#eca489] dark:text-amber-400 uppercase tracking-wider">
                ⛪ Orden del Culto
              </h5>
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                {bulletinData.programa}
              </div>
            </div>
          </div>
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