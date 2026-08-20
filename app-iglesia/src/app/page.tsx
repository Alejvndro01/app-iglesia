'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';

// Vistas Principales & Recursos
import { HomeView } from '@/components/views/HomeView';
import { HistoryView } from '@/components/views/HistoryView';
import { BibleView } from '@/components/views/BibleView';
import { HimnarioPageView } from '@/components/views/HymnalView';
import { SabbathLessonPageView } from '@/components/views/SabbathLessonPageView';
import { EstudiosBiblicosPageView } from '@/components/views/StudiesView';
import { AgendaView } from '@/components/views/AgendaView';
import { AdminPanelPageView } from '@/components/views/AdminView';
import { FilesView } from '@/components/views/FilesView';
import { LoginView, RegisterView, ForgotPasswordView } from '@/components/views/AuthViews';

// Ministerios
import YouthView from '@/components/views/YouthView';
import PersonalMinistryView from '@/components/views/PersonalMinistryView';
import FamilyMinistryView from '@/components/views/FamilyMinistryView';
import CommunicationsMinistryView from '@/components/views/CommunicationsMinistryView';
import StewardshipMinistryView from '@/components/views/StewardshipMinistryView';
import MusicMinistryView from '@/components/views/MusicMinistryView';

export default function MainPage() {
  const [currentPage, setCurrentPage] = useState('home');
  const [, setUserRole] = useState('guest');
  const [bulletinModalOpen, setBulletinModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleNavigate = (page: string) => {
    // Normalización de rutas para evitar desincronizaciones
    if (page === 'inicio' || page === 'home') {
      setCurrentPage('home');
    } else if (page === 'nosotros') {
      setCurrentPage('historia');
    } else if (page === 'recursos' || page === 'archivos' || page === 'files') {
      setCurrentPage('archivos');
    } else {
      setCurrentPage(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-700 dark:text-slate-200 flex flex-col relative transition-colors duration-300">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-5 z-50 bg-[#7C9885] dark:bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          ✨ {toastMessage}
        </div>
      )}

      {/* Header */}
      <Header
        currentPage={currentPage}
        navigateTo={handleNavigate}
        setBulletinModalOpen={setBulletinModalOpen}
        showToast={showToast}
      />

      {/* Contenedor de Vistas */}
      <main className="flex-1 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        {currentPage === 'home' && (
          <HomeView navigateTo={handleNavigate} setBulletinModalOpen={setBulletinModalOpen} />
        )}

        {/* 1. Nuestra Historia */}
        {(currentPage === 'historia' || currentPage === 'nosotros') && (
          <HistoryView navigateTo={handleNavigate} />
        )}

        {/* 2. Ministerios */}
        {currentPage === 'jovenes' && <YouthView />}
        {currentPage === 'ministerio-personal' && <PersonalMinistryView />}
        {currentPage === 'hogar-familia' && <FamilyMinistryView />}
        {currentPage === 'comunicaciones' && <CommunicationsMinistryView />}
        {currentPage === 'mayordomia' && <StewardshipMinistryView />}
        {currentPage === 'musica' && <MusicMinistryView />}

        {/* 3. Recursos Espirituales & Documentos */}
        {currentPage === 'biblia' && <BibleView />}
        {currentPage === 'himnario' && <HimnarioPageView />}
        {currentPage === 'leccion' && <SabbathLessonPageView showToast={showToast} />}
        {currentPage === 'estudios-biblicos' && (
          <EstudiosBiblicosPageView showToast={showToast} />
        )}
        {currentPage === 'agenda' && <AgendaView showToast={showToast} />}
        {currentPage === 'archivos' && <FilesView />}

        {/* 4. Autenticación & Admin */}
        {currentPage === 'login' && (
          <LoginView navigateTo={handleNavigate} showToast={showToast} setUserRole={setUserRole} />
        )}
        {currentPage === 'register' && (
          <RegisterView navigateTo={handleNavigate} showToast={showToast} />
        )}
        {currentPage === 'forgot-password' && (
          <ForgotPasswordView navigateTo={handleNavigate} showToast={showToast} />
        )}
        {currentPage === 'admin' && (
          <AdminPanelPageView showToast={showToast} />
        )}
      </main>
    </div>
  );
}