'use client';

import React, { useState } from 'react';
import { BulletinModal } from '../modales/BulletinModal';

interface HeaderProps {
  currentPage: string;
  userName?: string;
  userRole?: string;
  navigateTo: (page: string) => void;
  setUserRole?: (role: string) => void;
  setBulletinModalOpen?: (open: boolean) => void;
  showToast?: (msg: string) => void;
}

export function Header({
  currentPage,
  userName,
  userRole,
  navigateTo,
  setUserRole,
  showToast,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bulletinOpen, setBulletinOpen] = useState(false);

  const navItems = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'leccion', label: 'Lección Diaria' },
    { id: 'himnario', label: 'Himnario' },
    { id: 'estudios-biblicos', label: 'Estudios Bíblicos' },
    { id: 'boletin', label: '📜 Boletín Sabático', action: () => setBulletinOpen(true) },
    { id: 'mayordomia', label: 'Mayordomía' },
    { id: 'agenda', label: 'Agenda' },
  ];

  const handleNavClick = (item: any) => {
    if (item.action) {
      item.action();
    } else {
      navigateTo(item.id);
    }
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUserRole?.('guest');
      showToast?.('Sesión cerrada correctamente');
      navigateTo('inicio');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-sky-100 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={() => navigateTo('inicio')} 
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#eca489] flex items-center justify-center text-white font-black text-lg shadow-sm">
              ⛪
            </div>
            <div>
              <h1 className="font-black text-[#486379] text-sm sm:text-base leading-none">IASD CENTRAL</h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">DE HUALQUI</span>
            </div>
          </div>

          {/* Menú Desktop */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  currentPage === item.id
                    ? 'bg-[#d0e2f1] text-[#486379]'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Botones de Autenticación Desktop */}
          <div className="hidden lg:flex items-center space-x-2">
            {userRole && userRole !== 'guest' ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateTo('admin')}
                  className="px-4 py-1.5 bg-[#486379] text-white font-bold text-xs rounded-full shadow-xs cursor-pointer"
                >
                  ⚙️ Admin ({userName || 'Usuario'})
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 border border-slate-200 text-slate-600 font-bold text-xs rounded-full hover:bg-slate-50 cursor-pointer"
                >
                  Salir
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigateTo('login')}
                className="px-5 py-2 bg-[#eca489] hover:bg-[#e49375] text-white font-bold text-xs rounded-full shadow-xs cursor-pointer transition-colors"
              >
                Iniciar Sesión
              </button>
            )}
          </div>

          {/* Botón Hamburguesa Móvil */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[#486379] hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Abrir Menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Desplegable Menú Móvil */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-sky-100 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-bold transition-colors cursor-pointer ${
                  currentPage === item.id
                    ? 'bg-[#d0e2f1] text-[#486379]'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
              {userRole && userRole !== 'guest' ? (
                <>
                  <button
                    onClick={() => { navigateTo('admin'); setMobileMenuOpen(false); }}
                    className="w-full py-2.5 bg-[#486379] text-white font-bold text-xs rounded-2xl text-center"
                  >
                    ⚙️ Admin ({userName || 'Usuario'})
                  </button>
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="w-full py-2.5 border border-slate-200 text-slate-600 font-bold text-xs rounded-2xl text-center"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { navigateTo('login'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 bg-[#eca489] text-white font-bold text-xs rounded-2xl text-center"
                >
                  Iniciar Sesión
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Modal del Boletín Sabático */}
      <BulletinModal isOpen={bulletinOpen} onClose={() => setBulletinOpen(false)} />
    </>
  );
}