'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { HimnarioPageView } from '@/components/views/HymnalView';
import { SabbathLessonPageView } from '@/components/views/LessonView';
import { EstudiosBiblicosPageView } from '@/components/views/StudiesView';

export default function MainPage() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userRole, setUserRole] = useState('guest');
  const [bulletinModalOpen, setBulletinModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f7fafc] font-sans text-slate-700 flex flex-col relative">
      {toastMessage && (
        <div className="fixed top-24 right-5 z-50 bg-[#486379] text-white px-5 py-3 rounded-2xl shadow-2xl">
          ✨ {toastMessage}
        </div>
      )}

      <Header
        currentPage={currentPage}
        userRole={userRole}
        userName="Alejvndro01"
        navigateTo={setCurrentPage}
        setUserRole={setUserRole}
        setBulletinModalOpen={setBulletinModalOpen}
        showToast={showToast}
      />

      <main className="flex-1">
        {currentPage === 'home' && (
          <div className="max-w-7xl mx-auto px-4 py-12 text-center">
            <h1 className="text-3xl font-black text-[#486379]">
              Bienvenido a IASD Central Hualqui
            </h1>
            <p className="mt-2 text-slate-600">
              Comuna de Hualqui, Región del Bío-Bío.
            </p>
          </div>
        )}
        {currentPage === 'himnario' && <HimnarioPageView showToast={showToast} />}
        {currentPage === 'leccion' && <SabbathLessonPageView showToast={showToast} />}
        {currentPage === 'estudios-biblicos' && (
          <EstudiosBiblicosPageView showToast={showToast} />
        )}
      </main>
    </div>
  );
}