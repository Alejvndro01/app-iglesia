'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { HomeView } from '@/components/views/HomeView';
import { BibleView } from '@/components/views/BibleView';
import { HimnarioPageView } from '@/components/views/HymnalView';
import { SabbathLessonPageView } from '@/components/views/LessonView';
import { EstudiosBiblicosPageView } from '@/components/views/StudiesView';
import { LoginView, RegisterView, ForgotPasswordView } from '@/components/views/AuthViews';
import { AdminPanelPageView } from '@/components/views/AdminView';
import { AgendaView } from '@/components/views/AgendaView';
import { StewardshipView } from '@/components/views/StewardshipView';

export default function MainPage() {
  const [currentPage, setCurrentPage] = useState('home');
  const [, setUserRole] = useState('guest');
  const [, setBulletinModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleNavigate = (page: string) => {
    const targetPage = page === 'inicio' ? 'home' : page;
    setCurrentPage(targetPage);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-700 dark:text-slate-200 flex flex-col relative transition-colors duration-300">
      {toastMessage && (
        <div className="fixed top-24 right-5 z-50 bg-[#486379] dark:bg-sky-700 text-white px-5 py-3 rounded-2xl shadow-2xl">
          ✨ {toastMessage}
        </div>
      )}

      <Header
        currentPage={currentPage}
        navigateTo={handleNavigate}
        setBulletinModalOpen={setBulletinModalOpen}
        showToast={showToast}
      />

      <main className="flex-1 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        {currentPage === 'home' && (
          <HomeView navigateTo={handleNavigate} showToast={showToast} />
        )}
        {currentPage === 'biblia' && <BibleView />}
        {currentPage === 'himnario' && <HimnarioPageView showToast={showToast} />}
        {currentPage === 'leccion' && <SabbathLessonPageView showToast={showToast} />}
        {currentPage === 'estudios-biblicos' && (
          <EstudiosBiblicosPageView showToast={showToast} />
        )}
        {currentPage === 'agenda' && <AgendaView showToast={showToast} />}
        {currentPage === 'mayordomia' && <StewardshipView />}
        {currentPage === 'login' && (
          <LoginView
            navigateTo={handleNavigate}
            showToast={showToast}
            setUserRole={setUserRole}
          />
        )}
        {currentPage === 'register' && (
          <RegisterView
            navigateTo={handleNavigate}
            showToast={showToast}
          />
        )}
        {currentPage === 'forgot-password' && (
          <ForgotPasswordView
            navigateTo={handleNavigate}
            showToast={showToast}
          />
        )}
        {currentPage === 'admin' && (
          <AdminPanelPageView showToast={showToast} />
        )}
      </main>
    </div>
  );
}