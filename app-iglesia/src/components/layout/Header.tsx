'use client';

import React from 'react';

interface HeaderProps {
  currentPage: string;
  userRole: string;
  userName: string;
  navigateTo: (page: string) => void;
  setUserRole: (role: string) => void;
  setBulletinModalOpen: (open: boolean) => void;
  showToast: (msg: string) => void;
}

export function Header({
  currentPage,
  userRole,
  userName,
  navigateTo,
  setUserRole,
  setBulletinModalOpen,
  showToast,
}: HeaderProps) {

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUserRole('GUEST');
      showToast('Sesión cerrada correctamente');
      navigateTo('home');
    } catch (err) {
      showToast('Error al cerrar sesión');
    }
  };

  const isLoggedIn = userRole && userRole !== 'GUEST' && userRole !== 'guest';

  return (
    <header className="sticky top-0 z-40 bg-[#d0e2f1]/95 backdrop-blur-md border-b border-sky-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button onClick={() => navigateTo('home')} className="flex items-center space-x-3 text-left cursor-pointer">
          <div className="w-11 h-11 bg-[#eca489] rounded-2xl flex items-center justify-center shadow-md">
            <span className="text-white text-xl">⛪</span>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-[#486379] leading-none">IASD CENTRAL</h1>
            <p className="text-xs sm:text-sm font-bold text-[#e49375] tracking-widest mt-0.5">DE HUALQUI</p>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1 text-xs font-bold text-[#486379]">
          <button onClick={() => navigateTo('home')} className={`px-3 py-2 rounded-full cursor-pointer ${currentPage === 'home' ? 'bg-white text-[#eca489]' : ''}`}>Inicio</button>
          <button onClick={() => navigateTo('leccion')} className={`px-3 py-2 rounded-full cursor-pointer ${currentPage === 'leccion' ? 'bg-white text-[#eca489]' : ''}`}>Lección Diaria</button>
          <button onClick={() => navigateTo('himnario')} className={`px-3 py-2 rounded-full cursor-pointer ${currentPage === 'himnario' ? 'bg-white text-[#eca489]' : ''}`}>Himnario</button>
          <button onClick={() => navigateTo('estudios-biblicos')} className={`px-3 py-2 rounded-full cursor-pointer ${currentPage === 'estudios-biblicos' ? 'bg-white text-[#eca489]' : ''}`}>Estudios Bíblicos</button>
          
          {/* VISIBLE SOLO PARA ADMINISTRADORES */}
          {userRole === 'ADMIN' && (
            <button onClick={() => navigateTo('admin')} className={`px-3 py-2 rounded-full cursor-pointer ${currentPage === 'admin' ? 'bg-[#486379] text-white' : 'bg-amber-100 text-amber-900'}`}>
              ⚙️ Panel Admin
            </button>
          )}

          <button onClick={() => setBulletinModalOpen(true)} className="px-3 py-2 bg-sky-200/60 text-[#486379] rounded-full cursor-pointer">📜 Boletín Sabático</button>
        </nav>

        {/* User Auth Controls */}
        <div className="hidden md:flex items-center space-x-2">
          {!isLoggedIn ? (
            <>
              <button onClick={() => navigateTo('login')} className="px-3.5 py-2 text-xs font-bold text-[#486379] cursor-pointer">Iniciar Sesión</button>
              <button onClick={() => navigateTo('register')} className="px-4 py-2.5 bg-[#eca489] text-white text-xs font-bold rounded-full shadow-md cursor-pointer">Registrarse</button>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-[#486379] bg-white/70 px-3 py-1.5 rounded-full border border-sky-100">
                👤 {userName} {userRole === 'ADMIN' ? '(Admin)' : ''}
              </span>
              <button
                onClick={handleLogout}
                className="px-3.5 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-full shadow-sm cursor-pointer"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}