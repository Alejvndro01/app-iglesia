'use client';

import React from 'react';
import { FileText, Megaphone, Church, X, Check, Clock } from 'lucide-react';
import { SERVICE_SCHEDULES } from '@/data/mockData';

interface BulletinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BulletinModal({ isOpen, onClose }: BulletinModalProps) {
  if (!isOpen) return null;

  const announcements = [
    '• Almuerzo Fraternal: Próximo sábado después del Culto Divino.',
    '• Recepción de Sábado: Viernes a las 19:00 hrs vía Zoom.',
    '• Club de Conquistadores: Domingos a las 10:00 hrs en el templo.',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#2D3831]/60 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity antialiased">
      <div className="bg-[#FAF8F3] dark:bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-xl border border-[#E2DEC9] dark:border-slate-800 transition-colors duration-300">
        
        {/* Cabecera del Modal */}
        <div className="bg-[#7C9885] dark:bg-slate-900 text-white p-6 flex justify-between items-center border-b border-[#6B8774] dark:border-slate-800">
          <div className="space-y-1">
            <span className="bg-white/20 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase border border-white/30">
              Boletín Informativo
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white dark:text-emerald-100 flex items-center gap-2 pt-1">
              <FileText className="w-5 h-5 text-[#FAF8F3]" /> Boletín Sabático
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-[#E8EFEA] hover:text-white transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido del Boletín */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          <div className="space-y-5">
            <div className="border-b border-[#E8E4D5] dark:border-slate-800 pb-3">
              <h4 className="text-base font-bold text-[#2D3831] dark:text-emerald-100">
                IASD Central de Hualqui
              </h4>
              <p className="text-xs text-[#66756C] dark:text-slate-400">
                La Concepción #450, Hualqui
              </p>
            </div>

            {/* Horarios Sincronizados de Cultos */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-[#7C9885] dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#7C9885]" /> Reuniones Semanales
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICE_SCHEDULES.map((schedule) => (
                  <div 
                    key={schedule.id} 
                    className="p-3 bg-white dark:bg-slate-950 rounded-2xl border border-[#E8E4D5] dark:border-slate-800 flex items-center justify-between shadow-2xs"
                  >
                    <div>
                      <p className="font-bold text-xs text-[#2D3831] dark:text-slate-100">{schedule.name}</p>
                      <span className="text-[10px] text-[#66756C] dark:text-slate-400">{schedule.day}</span>
                    </div>
                    <span className="text-xs font-black text-[#7C9885] dark:text-emerald-400 bg-[#E8F0EA] dark:bg-slate-800 px-2 py-1 rounded-lg">
                      {schedule.time} hrs
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Anuncios Principales */}
            <div className="bg-[#E8F0EA] dark:bg-slate-800/80 p-5 rounded-2xl border border-[#C5D8CC] dark:border-slate-700 space-y-2">
              <h5 className="text-xs font-bold text-[#546E5C] dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-[#7C9885]" /> Anuncios Eclesiales
              </h5>
              <ul className="text-xs text-[#2D3831] dark:text-slate-200 leading-relaxed space-y-1">
                {announcements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Orden de Culto */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-[#7C9885] dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Church className="w-4 h-4 text-[#7C9885]" /> Orden del Culto Divino
              </h5>
              <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-[#E8E4D5] dark:border-slate-800 text-xs text-[#3A473E] dark:text-slate-300 whitespace-pre-line leading-relaxed font-medium">
                {`10:00 hrs - Escuela Sabática
                  11:05 hrs - Anuncios y Bienvenida
                  11:30 hrs - Alabanza y Culto Divino
                  12:30 hrs - Cierre y Bendición`}
              </div>
            </div>
          </div>
        </div>

        {/* Pie del Modal */}
        <div className="bg-[#FAF8F3] dark:bg-slate-900 p-4 border-t border-[#E2DEC9] dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#7C9885] hover:bg-[#6B8774] text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Entendido
          </button>
        </div>
      </div>
    </div>
  );
}