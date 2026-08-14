'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { BookOpen, Calendar, Loader2, AlertCircle } from 'lucide-react';

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

interface SabbathLessonPageViewProps {
  showToast?: (msg: string) => void;
  navigateTo?: (page: string) => void;
}

export function SabbathLessonPageView({ showToast }: SabbathLessonPageViewProps) {
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3 text-[#7C9885]">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-xs font-semibold text-[#526157] dark:text-slate-400">
          Sincronizando Lección Sabática de la semana...
        </p>
      </div>
    );
  }

  if (error || !lessonData) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-[#FAF8F3] dark:bg-slate-900 border border-[#E2DEC9] dark:border-slate-800 rounded-3xl text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-[#E08A72] mx-auto" />
        <h3 className="font-bold text-sm text-[#2D3831] dark:text-slate-200">
          Error al cargar la lección
        </h3>
        <p className="text-xs text-[#66756C] dark:text-slate-400">
          Ocurrió un problema obteniendo la guía de estudio diario. Inténtalo de nuevo más tarde.
        </p>
      </div>
    );
  }

  const currentDay = lessonData.dias?.[selectedDayIndex];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 antialiased">
      {/* Banner Principal de la Semana */}
      <div className="bg-[#7C9885] dark:bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xs flex flex-col sm:flex-row items-center gap-6 border border-[#6B8774] dark:border-slate-800">
        {lessonData.portada && (
          <img
            src={lessonData.portada}
            alt="Portada Lección"
            className="w-24 h-32 object-cover rounded-2xl shadow-sm flex-shrink-0 border border-white/20"
          />
        )}
        <div className="space-y-2 text-center sm:text-left">
          <span className="bg-white/20 text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/30 inline-flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> Lección de la Semana
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white dark:text-emerald-100 leading-tight">
            {lessonData.tituloSemana || 'Guía de Estudio de la Biblia'}
          </h2>
          {(lessonData.fechaInicio || lessonData.fechaFin) && (
            <p className="text-xs text-[#E8EFEA] dark:text-slate-300 flex items-center justify-center sm:justify-start gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {lessonData.fechaInicio} al {lessonData.fechaFin}
            </p>
          )}
        </div>
      </div>

      {/* Selector Horizontal de Días */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
        {lessonData.dias?.map((day, index) => {
          const isSelected = selectedDayIndex === index;
          return (
            <button
              key={day.id || index}
              onClick={() => setSelectedDayIndex(index)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'bg-[#7C9885] text-white shadow-xs'
                  : 'bg-[#FAF8F3] dark:bg-slate-900 text-[#526157] dark:text-slate-300 border border-[#E2DEC9] dark:border-slate-800 hover:bg-[#E8F0EA] dark:hover:bg-slate-800'
              }`}
            >
              {day.title}
            </button>
          );
        })}
      </div>

      {/* Contenido del Día Seleccionado */}
      {currentDay && (
        <div className="bg-[#FAF8F3] dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-[#E2DEC9] dark:border-slate-800 shadow-xs space-y-4">
          <div className="border-b border-[#E8E4D5] dark:border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-[#2D3831] dark:text-emerald-100">
              {currentDay.title}
            </h3>
            <p className="text-xs font-semibold text-[#7C9885] dark:text-emerald-400 mt-0.5">
              {currentDay.date}
            </p>
          </div>

          <div
            className="prose prose-slate dark:prose-invert text-xs sm:text-sm leading-relaxed max-w-none text-[#3A473E] dark:text-slate-300"
            dangerouslySetInnerHTML={{
              __html: currentDay.html || '<p>Contenido no disponible para este día.</p>',
            }}
          />
        </div>
      )}
    </div>
  );
}

export { SabbathLessonPageView as LessonView };