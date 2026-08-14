'use client';

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { BulletinModal } from '../modales/BulletinModal';
import { ThemeToggle } from '../ThemeToggle';
import { 
  Church, 
  BookOpen, 
  Calendar, 
  Music, 
  GraduationCap, 
  HeartHandshake, 
  FileText, 
  ShieldCheck, 
  User, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

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
    { id: 'inicio', label: 'Inicio', icon: Church },
    { id: 'biblia', label: 'Biblia', icon: BookOpen },
    { id: 'leccion', label: 'Lección Diaria', icon: Calendar },
    { id: 'himnario', label: 'Himnario', icon: Music },
    { id: 'estudios-biblicos', label: 'Estudios Bíblicos', icon: GraduationCap },
    { id: 'mayordomia', label: 'Mayordomía', icon: HeartHandshake },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'boletin', label: 'Boletín Sabático', icon: FileText, action: () => setBulletinOpen(true) },
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
      <header className="bg-[#FAF8F3] dark:bg-slate-900 border-b border-[#E2DEC9] dark:border-slate-800 sticky top-0 z-40 shadow-xs transition-colors duration-300 antialiased">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo Identidad */}
          <div 
            onClick={() => navigateTo('inicio')} 
            className="flex items-center space-x-2.5 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-2xl bg-[#E8F0EA] dark:bg-slate-800 flex items-center justify-center text-[#7C9885] dark:text-emerald-400 font-bold border border-[#C5D8CC] dark:border-slate-700 shadow-xs">
              <Church className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-[#2D3831] dark:text-emerald-100 text-xs sm:text-sm leading-none">
                IASD CENTRAL
              </h1>
              <span className="text-[10px] text-[#66756C] dark:text-slate-400 font-semibold uppercase tracking-widest">
                DE HUALQUI
              </span>
            </div>
          </div>

          {/* Menú Desktop */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id || (currentPage === 'home' && item.id === 'inicio');
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#7C9885] text-white shadow-xs'
                      : 'text-[#526157] dark:text-slate-300 hover:bg-[#E8F0EA] dark:hover:bg-slate-800 hover:text-[#2D3831]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#7C9885]'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Botones Autenticación & ThemeToggle Desktop */}
          <div className="hidden xl:flex items-center space-x-3">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                {userRole === 'ADMIN' && (
                  <button
                    onClick={() => navigateTo('admin')}
                    className="px-3.5 py-1.5 bg-[#7C9885] hover:bg-[#6B8774] text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> Admin ({userName})
                  </button>
                )}
                {userRole !== 'ADMIN' && (
                  <span className="text-xs font-semibold text-[#2D3831] dark:text-slate-200 px-2 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#7C9885]" /> {userName}
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 border border-[#DCD7C5] dark:border-slate-700 text-[#526157] dark:text-slate-300 font-semibold text-xs rounded-xl hover:bg-[#E8F0EA] dark:hover:bg-slate-800 cursor-pointer transition-colors flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5 text-[#E08A72]" /> Salir
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigateTo('login')}
                className="px-5 py-2 bg-[#7C9885] hover:bg-[#6B8774] text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer transition-all"
              >
                Iniciar Sesión
              </button>
            )}
          </div>

          {/* Botón Menú Móvil / Pantallas pequeñas */}
          <div className="flex items-center space-x-2 xl:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#2D3831] dark:text-slate-200 hover:bg-[#E8F0EA] dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Abrir Menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#7C9885]" /> : <Menu className="w-6 h-6 text-[#7C9885]" />}
            </button>
          </div>
        </div>

        {/* Menú Desplegable Móvil */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#FAF8F3] dark:bg-slate-900 border-b border-[#E2DEC9] dark:border-slate-800 px-4 pt-2 pb-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id || (currentPage === 'home' && item.id === 'inicio');
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#7C9885] text-white shadow-xs'
                      : 'text-[#526157] dark:text-slate-300 hover:bg-[#E8F0EA] dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#7C9885]'}`} />
                  {item.label}
                </button>
              );
            })}

            <div className="pt-3 border-t border-[#E8E4D5] dark:border-slate-800 flex flex-col space-y-2">
              {isAuthenticated ? (
                <>
                  {userRole === 'ADMIN' && (
                    <button
                      onClick={() => { navigateTo('admin'); setMobileMenuOpen(false); }}
                      className="w-full py-2.5 bg-[#7C9885] hover:bg-[#6B8774] text-white font-semibold text-xs rounded-xl text-center flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck className="w-4 h-4" /> Admin ({userName})
                    </button>
                  )}
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="w-full py-2.5 border border-[#DCD7C5] dark:border-slate-700 text-[#526157] dark:text-slate-300 font-semibold text-xs rounded-xl text-center flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-4 h-4 text-[#E08A72]" /> Cerrar Sesión
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { navigateTo('login'); setMobileMenuOpen(false); }}
                  className="w-full py-2.5 bg-[#7C9885] hover:bg-[#6B8774] text-white font-semibold text-xs rounded-xl text-center"
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