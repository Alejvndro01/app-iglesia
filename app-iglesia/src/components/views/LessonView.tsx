'use client';

import React, { useState, useEffect } from 'react';

interface SabbathLessonPageViewProps {
  showToast?: (msg: string) => void;
  navigateTo?: (page: string) => void;
}

export function SabbathLessonPageView({ showToast }: SabbathLessonPageViewProps) {
  const [lessonData, setLessonData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  useEffect(() => {
    fetch('/api/leccion/actual')
      .then((res) => res.json())
      .then((data) => {
        setLessonData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-slate-500 dark:text-slate-400 text-xs font-bold">
        Sincronizando Lección Sabática de la semana...
      </div>
    );
  }

  const currentDay = lessonData?.dias?.[selectedDayIndex];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Cabecera de la Semana */}
      <div className="bg-[#486379] dark:bg-slate-800 text-white p-6 rounded-3xl shadow-md flex flex-col md:flex-row items-center gap-6 border border-transparent dark:border-slate-700 transition-colors">
        {lessonData?.portada && (
          <img
            src={lessonData.portada}
            alt="Portada Lección"
            className="w-24 h-32 object-cover rounded-2xl shadow-sm"
          />
        )}
        <div>
          <span className="bg-[#eca489] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
            Lección de la Semana
          </span>
          <h2 className="text-2xl font-black mt-2 text-white dark:text-amber-400">
            {lessonData?.tituloSemana}
          </h2>
          <p className="text-xs text-sky-100 dark:text-slate-300 mt-1">
            {lessonData?.fechaInicio} al {lessonData?.fechaFin}
          </p>
        </div>
      </div>

      {/* Selector de Días */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
        {lessonData?.dias?.map((day: any, index: number) => (
          <button
            key={day.id || index}
            onClick={() => setSelectedDayIndex(index)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
              selectedDayIndex === index
                ? 'bg-[#eca489] text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-sky-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {day.title}
          </button>
        ))}
      </div>

      {/* Contenido Diario */}
      {currentDay && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-sky-100 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
          <h3 className="text-xl font-black text-[#486379] dark:text-sky-300">
            {currentDay.title}
          </h3>
          <p className="text-xs font-bold text-[#eca489]">{currentDay.date}</p>
          
          <div
            className="prose prose-slate dark:prose-invert text-xs sm:text-sm leading-relaxed max-w-none text-slate-700 dark:text-slate-300"
            dangerouslySetInnerHTML={{
              __html: currentDay.html || '<p>Contenido no disponible.</p>',
            }}
          />
        </div>
      )}
    </div>
  );
}

// Alias de compatibilidad por si se importa en otro módulo como LessonView
export { SabbathLessonPageView as LessonView };