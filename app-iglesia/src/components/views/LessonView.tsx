'use client';

import React, { useState } from 'react';
import { SABBATH_LESSON_WEEK } from '@/data/mockData';

interface LessonViewProps {
  showToast: (msg: string) => void;
}

export function SabbathLessonPageView({ showToast }: LessonViewProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const currentDay = SABBATH_LESSON_WEEK.days[selectedDayIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-[#d0e2f1] p-8 rounded-3xl border border-sky-200 text-[#486379] space-y-3">
        <div className="flex items-center space-x-2">
          <span className="bg-[#eca489] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
            {SABBATH_LESSON_WEEK.quarter}
          </span>
          <span className="text-xs font-bold">
            Lección #{SABBATH_LESSON_WEEK.lessonNumber}
          </span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black">{SABBATH_LESSON_WEEK.title}</h2>
        <div className="bg-white/80 p-4 rounded-2xl border border-sky-100 text-xs sm:text-sm font-semibold italic text-[#486379]">
          🎯 Texto Clave para Memoria: {SABBATH_LESSON_WEEK.memoryVerse}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {SABBATH_LESSON_WEEK.days.map((d, index) => (
          <button
            key={d.day}
            onClick={() => setSelectedDayIndex(index)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              selectedDayIndex === index
                ? 'bg-[#486379] text-white shadow-md'
                : 'bg-white text-[#486379] hover:bg-slate-100'
            }`}
          >
            {d.day}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-8 border border-sky-100 shadow-xl max-w-4xl mx-auto space-y-4">
        <div className="flex justify-between items-center border-b pb-3 border-slate-100">
          <h3 className="text-xl font-black text-[#486379]">
            {currentDay.day}: {currentDay.topic}
          </h3>
          <button
            onClick={() =>
              showToast(`Lección de ${currentDay.day} guardada en favoritos`)
            }
            className="text-xs font-bold text-[#eca489] bg-amber-50 px-3 py-1 rounded-full"
          >
            ⭐ Guardar
          </button>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
          {currentDay.content}
        </p>

        <div className="pt-4 flex justify-between items-center">
          <button
            disabled={selectedDayIndex === 0}
            onClick={() => setSelectedDayIndex(selectedDayIndex - 1)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-xs font-bold text-slate-600 rounded-full"
          >
            ← Día Anterior
          </button>
          <button
            disabled={selectedDayIndex === SABBATH_LESSON_WEEK.days.length - 1}
            onClick={() => setSelectedDayIndex(selectedDayIndex + 1)}
            className="px-4 py-2 bg-[#eca489] hover:bg-[#e49375] disabled:opacity-40 text-xs font-bold text-white rounded-full shadow-sm"
          >
            Siguiente Día →
          </button>
        </div>
      </div>
    </div>
  );
}