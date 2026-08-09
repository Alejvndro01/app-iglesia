'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { HomeView } from '@/components/views/HomeView';
import { HimnarioPageView } from '@/components/views/HymnalView';
import { SabbathLessonPageView } from '@/components/views/LessonView';
import { EstudiosBiblicosPageView } from '@/components/views/StudiesView';
import { LoginView, RegisterView } from '@/components/views/AuthViews';
import { AdminPanelPageView } from '@/components/views/AdminView';
import { AgendaView } from '@/components/views/AgendaView';
import { StewardshipView } from '@/components/views/StewardshipView';

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
          <HomeView navigateTo={setCurrentPage} showToast={showToast} />
        )}
        {currentPage === 'himnario' && <HimnarioPageView showToast={showToast} />}
        {currentPage === 'leccion' && <SabbathLessonPageView showToast={showToast} />}
        {currentPage === 'estudios-biblicos' && (
          <EstudiosBiblicosPageView showToast={showToast} />
        )}
        {currentPage === 'agenda' && <AgendaView showToast={showToast} />}
        {currentPage === 'mayordomia' && <StewardshipView />}
        {currentPage === 'login' && (
          <LoginView
            navigateTo={setCurrentPage}
            showToast={showToast}
            setUserRole={setUserRole}
          />
        )}
        {currentPage === 'register' && (
          <RegisterView
            navigateTo={setCurrentPage}
            showToast={showToast}
            setUserRole={setUserRole}
          />
        )}
        {currentPage === 'admin' && (
          <AdminPanelPageView showToast={showToast} />
        )}
      </main>
    </div>
  );
}