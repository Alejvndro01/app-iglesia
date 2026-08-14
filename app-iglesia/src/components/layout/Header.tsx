'use client';

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { BulletinModal } from '../modales/BulletinModal';
import { ThemeToggle } from '../ThemeToggle';
import { Menu, X, LogOut, User, Settings, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  navigateTo: (page: string) => void;
  setBulletinModalOpen?: (open: boolean) => void;
  showToast?: (msg: string) => void;
}

export function Header({
  currentPage,
  navigateTo,
  showToast,
}: HeaderProps) {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bulletinOpen, setBulletinOpen] = useState(false);

  const navItems = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'biblia', label: 'Biblia' },
    { id: 'leccion', label: 'Lección' },
    { id: 'himnario', label: 'Himnario' },
    { id: 'estudios-biblicos', label: 'Estudios' },
    { id: 'mayordomia', label: 'Mayordomía' },
    { id: 'agenda', label: 'Agenda' },
    { id: 'boletin', label: 'Boletín', action: () => setBulletinOpen(true) },
  ];

  const handleNavClick = (item: { id: string; label: string; action?: () => void }) => {
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
      await signOut({ redirect: false });
      showToast?.('Sesión cerrada correctamente');
      navigateTo('inicio');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const userName = session?.user?.name || session?.user?.email?.split('@')[0] || 'Usuario';
  const userRole = (session?.user as { role?: string })?.role || 'USER';
  const isAuthenticated = status === 'authenticated';

  return (
    <>
      <header className="bg-[#A1B5C4] border-b border-white/10 sticky top-0 z-40 backdrop-blur-md font-sans text-white transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* LOGO EDITORIAL / MINIMAL */}
          <div 
            onClick={() => navigateTo('inicio')} 
            className="flex items-center space-x-2.5 cursor-pointer group active:scale-95 transition-transform"
          >
            <div className="w-8 h-8 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              ⛪
            </div>
            <div className="flex flex-col">
              <h1 className="font-extrabold text-white text-xs sm:text-sm tracking-tight leading-none uppercase">
                IASD Hualqui
              </h1>
              <span className="text-[9px] text-white/70 font-light tracking-widest uppercase">
                Comunidad & Fe
              </span>
            </div>
          </div>

          {/* MENÚ DESKTOP MINIMALISTA */}
          <nav className="hidden lg:flex items-center space-x-1 bg-white/10 p-1 rounded-full border border-white/10 backdrop-blur-sm">
            {navItems.map((item) => {
              const isActive = currentPage === item.id || (currentPage === 'home' && item.id === 'inicio');
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-minimal-dark font-semibold shadow-xs'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* BOTONES AUTH + THEME (DESKTOP) */}
          <div className="hidden lg:flex items-center space-x-3">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                {userRole === 'ADMIN' && (
                  <button
                    onClick={() => navigateTo('admin')}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-minimal-accent hover:bg-minimal-accent/90 text-white font-medium text-xs rounded-full shadow-xs transition-all active:scale-95"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </button>
                )}
                
                <span className="text-xs font-light text-white/90 px-2 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-white/70" />
                  {userName}
                </span>

                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/10 transition-all"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigateTo('login')}
                className="px-4 py-1.5 bg-white text-minimal-dark hover:bg-white/90 font-semibold text-xs rounded-full shadow-xs transition-all active:scale-95"
              >
                Ingresar
              </button>
            )}
          </div>

          {/* HAMBURGUESA MÓVIL */}
          <div className="flex items-center space-x-2 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Abrir Menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* DESPLEGABLE MENÚ MÓVIL */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#A1B5C4] border-b border-white/10 px-5 pt-3 pb-6 space-y-2 backdrop-blur-xl animate-in slide-in-from-top duration-200">
            <div className="grid grid-cols-2 gap-1.5">
              {navItems.map((item) => {
                const isActive = currentPage === item.id || (currentPage === 'home' && item.id === 'inicio');
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-white text-minimal-dark font-bold'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-col space-y-2">
              {isAuthenticated ? (
                <>
                  {userRole === 'ADMIN' && (
                    <button
                      onClick={() => { navigateTo('admin'); setMobileMenuOpen(false); }}
                      className="w-full py-2.5 bg-minimal-accent text-white font-medium text-xs rounded-xl text-center flex items-center justify-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Panel Admin ({userName})</span>
                    </button>
                  )}
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="w-full py-2.5 bg-white/10 border border-white/10 text-white font-medium text-xs rounded-xl text-center flex items-center justify-center gap-2 hover:bg-white/20"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { navigateTo('login'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 bg-white text-minimal-dark font-semibold text-xs rounded-xl text-center"
                >
                  Iniciar Sesión
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* MODAL DEL BOLETÍN */}
      <BulletinModal isOpen={bulletinOpen} onClose={() => setBulletinOpen(false)} />
    </>
  );
}