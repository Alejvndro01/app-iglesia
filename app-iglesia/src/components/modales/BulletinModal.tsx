'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Megaphone, 
  Church, 
  X, 
  Check, 
  Clock, 
  Calendar, 
  MapPin, 
  Share2, 
  Sparkles,
  ListOrdered,
  Bell
} from 'lucide-react';
import { SERVICE_SCHEDULES } from '@/data/mockData';

interface BulletinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BulletinModal({ isOpen, onClose }: BulletinModalProps) {
  const [activeTab, setActiveTab] = useState<'orden' | 'anuncios' | 'horarios'>('orden');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const announcements = [
    {
      title: 'Almuerzo Fraternal',
      desc: 'Próximo sábado después del Culto Divino en el salón multipropósito.',
      tag: 'Comunión'
    },
    {
      title: 'Recepción de Sábado',
      desc: 'Viernes a las 19:00 hrs vía Zoom y grupos pequeños en hogares.',
      tag: 'Oración'
    },
    {
      title: 'Club de Conquistadores',
      desc: 'Domingos a las 10:00 hrs en el templo central.',
      tag: 'Jóvenes'
    }
  ];

  const liturgyOrder = [
    { time: '09:30 hrs', title: 'Servicio de Canto & Alabanza', leader: 'Ministerio de Música' },
    { time: '10:00 hrs', title: 'Escuela Sabática (Repaso de Lección)', leader: 'Maestros por Clases' },
    { time: '11:05 hrs', title: 'Avisos & Bienvenida Misionera', leader: 'Directiva de Turno' },
    { time: '11:20 hrs', title: 'Culto Divino & Adoración', leader: 'Pastor / Predicador' },
    { time: '12:30 hrs', title: 'Cierre, Oración y Bendición', leader: 'Anciano de Turno' }
  ];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D3831]/60 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity antialiased">
      <div className="bg-[#FAF8F3] dark:bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-[#E2DEC9] dark:border-slate-800 transition-colors duration-300 flex flex-col max-h-[85vh]">
        
        {/* Cabecera Litúrgica */}
        <div className="bg-[#7C9885] dark:bg-slate-900 text-white p-6 pb-4 border-b border-[#6B8774] dark:border-slate-800 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-white/20 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase border border-white/30">
                  Edición Digital Sabática
                </span>
                <span className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#E0A96D]" /> Sábado Santo
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white dark:text-emerald-100 flex items-center gap-2 pt-1">
                <FileText className="w-5 h-5 text-[#FAF8F3]" /> Boletín Sabático
              </h3>
              <p className="text-xs text-[#E8EFEA] dark:text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> IASD Central de Hualqui • La Concepción #450
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Selector de Pestañas */}
          <div className="flex items-center gap-1.5 pt-4">
            {[
              { id: 'orden', label: 'Orden de Culto', icon: ListOrdered },
              { id: 'anuncios', label: 'Anuncios Eclesiales', icon: Bell },
              { id: 'horarios', label: 'Cultos Semanales', icon: Clock }
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? 'bg-[#FAF8F3] dark:bg-slate-800 text-[#7C9885] dark:text-emerald-300 shadow-xs'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenido Dinámico por Pestañas */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* TAB 1: ORDEN DE CULTO (TIMELINE LITÚRGICO) */}
          {activeTab === 'orden' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#E8F0EA]/60 dark:bg-slate-800/60 border border-[#C5D8CC] dark:border-slate-700 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C9885] dark:text-emerald-400">
                  Lema Sabático
                </span>
                <p className="text-xs font-serif italic text-[#2D3831] dark:text-slate-200">
                  &ldquo;Acuérdate del día de reposo para santificarlo.&rdquo; — Éxodo 20:8
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {liturgyOrder.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-950 border border-[#E8E4D5] dark:border-slate-800 shadow-2xs"
                  >
                    <div className="px-2.5 py-1 rounded-xl bg-[#E8F0EA] dark:bg-slate-800 text-[#7C9885] dark:text-emerald-300 font-bold text-xs whitespace-nowrap mt-0.5">
                      {item.time}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-xs sm:text-sm text-[#2D3831] dark:text-slate-100">{item.title}</h4>
                      <p className="text-[11px] text-[#66756C] dark:text-slate-400">{item.leader}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ANUNCIOS ECLESIALES */}
          {activeTab === 'anuncios' && (
            <div className="space-y-3">
              {announcements.map((ann, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-[#E8E4D5] dark:border-slate-800 space-y-1.5 shadow-2xs hover:border-[#7C9885] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-[#E8F0EA] dark:bg-slate-800 text-[#7C9885] dark:text-emerald-300">
                      {ann.tag}
                    </span>
                    <Megaphone className="w-3.5 h-3.5 text-[#E0A96D]" />
                  </div>
                  <h4 className="font-bold text-sm text-[#2D3831] dark:text-slate-100">{ann.title}</h4>
                  <p className="text-xs text-[#526157] dark:text-slate-400 leading-relaxed">{ann.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: HORARIOS DE CULTOS */}
          {activeTab === 'horarios' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICE_SCHEDULES.map((schedule) => (
                <div 
                  key={schedule.id} 
                  className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-[#E8E4D5] dark:border-slate-800 flex items-center justify-between shadow-2xs"
                >
                  <div>
                    <p className="font-bold text-xs sm:text-sm text-[#2D3831] dark:text-slate-100">{schedule.name}</p>
                    <span className="text-[11px] font-semibold text-[#66756C] dark:text-slate-400">{schedule.day}</span>
                  </div>
                  <span className="text-xs font-bold text-[#7C9885] dark:text-emerald-400 bg-[#E8F0EA] dark:bg-slate-800 px-2.5 py-1.5 rounded-xl">
                    {schedule.time} hrs
                  </span>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Pie del Modal */}
        <div className="bg-[#FAF8F3] dark:bg-slate-900 p-4 border-t border-[#E2DEC9] dark:border-slate-800 flex items-center justify-between flex-shrink-0">
          <button
            onClick={handleShare}
            className="px-3.5 py-2 rounded-xl border border-[#DCD7C5] dark:border-slate-700 text-[#526157] dark:text-slate-300 hover:bg-[#E8F0EA] dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-[#7C9885]" />
            {copied ? '¡Enlace Copiado!' : 'Compartir'}
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#7C9885] hover:bg-[#6B8774] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Listo
          </button>
        </div>

      </div>
    </div>
  );
}