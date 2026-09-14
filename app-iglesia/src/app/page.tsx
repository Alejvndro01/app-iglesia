'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/layout/Header';

// La vista principal (home) se carga de inmediato con el bundle inicial.
// El resto de las vistas se dividen en chunks separados que se descargan
// solo cuando el usuario navega a ellas (code splitting por vista).
import { HomeView } from '@/components/views/HomeView';

/** Fallback visible mientras se descarga el chunk de una vista. */
function ViewLoadingFallback() {
  return (
    <div
      className="flex items-center justify-center min-h-[60vh]"
      aria-busy="true"
      aria-label="Cargando vista"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-[#7C9885] animate-spin" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Cargando…</p>
      </div>
    </div>
  );
}

const viewOptions = { loading: () => <ViewLoadingFallback /> } as const;

// Vistas Principales & Recursos (carga diferida)
const HistoryView = dynamic(
  () => import('@/components/views/HistoryView').then((m) => m.HistoryView),
  viewOptions
);
const BibleView = dynamic(
  () => import('@/components/views/BibleView').then((m) => m.BibleView),
  viewOptions
);
const HimnarioPageView = dynamic(
  () => import('@/components/views/HymnalView').then((m) => m.HimnarioPageView),
  viewOptions
);
const SabbathLessonPageView = dynamic(
  () => import('@/components/views/SabbathLessonPageView').then((m) => m.SabbathLessonPageView),
  viewOptions
);
const EstudiosBiblicosPageView = dynamic(
  () => import('@/components/views/StudiesView').then((m) => m.EstudiosBiblicosPageView),
  viewOptions
);
const AgendaView = dynamic(
  () => import('@/components/views/AgendaView').then((m) => m.AgendaView),
  viewOptions
);
const AdminPanelPageView = dynamic(
  () => import('@/components/views/AdminView').then((m) => m.AdminPanelPageView),
  viewOptions
);
const FilesView = dynamic(
  () => import('@/components/views/FilesView').then((m) => m.FilesView),
  viewOptions
);
const LoginView = dynamic(
  () => import('@/components/views/AuthViews').then((m) => m.LoginView),
  viewOptions
);
const RegisterView = dynamic(
  () => import('@/components/views/AuthViews').then((m) => m.RegisterView),
  viewOptions
);
const ForgotPasswordView = dynamic(
  () => import('@/components/views/AuthViews').then((m) => m.ForgotPasswordView),
  viewOptions
);

// Ministerios (carga diferida, export default)
const YouthView = dynamic(() => import('@/components/views/YouthView'), viewOptions);
const PersonalMinistryView = dynamic(
  () => import('@/components/views/PersonalMinistryView'),
  viewOptions
);
const FamilyMinistryView = dynamic(
  () => import('@/components/views/FamilyMinistryView'),
  viewOptions
);
const CommunicationsMinistryView = dynamic(
  () => import('@/components/views/CommunicationsMinistryView'),
  viewOptions
);
const StewardshipMinistryView = dynamic(
  () => import('@/components/views/StewardshipMinistryView'),
  viewOptions
);
const MusicMinistryView = dynamic(
  () => import('@/components/views/MusicMinistryView'),
  viewOptions
);

export default function MainPage() {
  const [currentPage, setCurrentPage] = useState('home');
  const [, setUserRole] = useState('guest');
  const [, setBulletinModalOpen] = useState(false);
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
      <HomeView />
    </div>
  );
}
