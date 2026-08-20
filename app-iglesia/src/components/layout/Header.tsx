'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  X,
  Flame,
  ChevronDown,
  Sparkles,
  Users,
  Compass,
  Home,
  Radio,
  Share2,
  FolderUp
} from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  navigateTo: (page: string) => void;
  setBulletinModalOpen?: (open: boolean) => void;
  showToast?: (msg: string) => void;
}

interface NavSubItem {
  id: string;
  label: string;
  icon: React.ElementType;
  description?: string;
  action?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon?: React.ElementType;
  children?: NavSubItem[];
  action?: () => void;
}

export function Header({
  currentPage,
  navigateTo,
  showToast,
}: HeaderProps) {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bulletinOpen, setBulletinOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});

  const navRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown desktop al hacer clic fuera del componente
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: NavItem[] = [
    { id: 'inicio', label: 'Inicio', icon: Church },
    { id: 'historia', label: 'Nuestra Historia', icon: Compass },
    {
      id: 'ministerios',
      label: 'Ministerios',
      icon: Users,
      children: [
        { 
          id: 'jovenes', 
          label: 'Jóvenes JA', 
          icon: Flame, 
          description: 'Sociedad JA, proyectos juveniles y Misión Caleb' 
        },
        { 
          id: 'musica', 
          label: 'Ministerio de Música', 
          icon: Music, 
          description: 'Coros, alabanza congregacional y partes especiales' 
        },
        { 
          id: 'ministerio-personal', 
          label: 'Ministerio Personal', 
          icon: Share2, 
          description: 'Evangelismo, parejas misioneras y discipulado' 
        },
        { 
          id: 'hogar-familia', 
          label: 'Hogar y Familia', 
          icon: Home, 
          description: 'Matrimonios, crianza bíblica y consejería familiar' 
        },
        { 
          id: 'comunicaciones', 
          label: 'Comunicaciones & Medios', 
          icon: Radio, 
          description: 'Transmisiones en vivo, avisos y producción digital' 
        },
        { 
          id: 'mayordomia', 
          label: 'Mayordomía Cristiana', 
          icon: HeartHandshake, 
          description: 'Fidelidad, calculadora de diezmos y ofrendas' 
        },
      ],
    },
    {
      id: 'recursos',
      label: 'Recursos',
      icon: Sparkles,
      children: [
        { 
          id: 'biblia', 
          label: 'Biblia Online', 
          icon: BookOpen, 
          description: 'Texto bíblico y lecturas RVR1960' 
        },
        { 
          id: 'leccion', 
          label: 'Lección Diaria', 
          icon: Calendar, 
          description: 'Escuela Sabática adultos y jóvenes' 
        },
        { 
          id: 'himnario', 
          label: 'Himnario Adventista', 
          icon: Music, 
          description: 'Cantos de alabanza y letras completas' 
        },
        { 
          id: 'estudios-biblicos', 
          label: 'Estudios Bíblicos', 
          icon: GraduationCap, 
          description: 'Cursos de fe con validación OTP' 
        },
        { 
          id: 'archivos', 
          label: 'Archivos & Documentos', 
          icon: FolderUp, 
          description: 'Descarga y subida de recursos comunitarios' 
        },
      ],
    },
    { 
      id: 'boletin', 
      label: 'Boletín Sabático', 
      icon: FileText, 
      action: () => setBulletinOpen(true) 
    },
  ];

  const handleNavClick = (id: string, action?: () => void) => {
    if (action) {
      action();
    } else {
      navigateTo(id);
    }
    setOpenDropdown(null);
    setMobileMenuOpen(false);
  };

  const toggleMobileSubmenu = (id: string) => {
    setMobileExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
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
      <header className="sticky top-0 z-40 w-full bg-[#FAF8F3]/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-[#E2DEC9] dark:border-slate-800 transition-colors duration-300 antialiased">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Identidad */}
          <div 
            onClick={() => navigateTo('inicio')} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-2xl bg-[#E8F0EA] dark:bg-slate-800 flex items-center justify-center text-[#7C9885] dark:text-emerald-400 border border-[#C5D8CC] dark:border-slate-700 shadow-xs transition-transform group-hover:scale-105">
              <Church className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-[#2D3831] dark:text-emerald-100 text-sm sm:text-base leading-none tracking-tight">
                IASD Central
              </h1>
              <span className="text-[10px] text-[#66756C] dark:text-slate-400 font-semibold uppercase tracking-wider">
                Hualqui
              </span>
            </div>
          </div>

          {/* Menú Desktop con Dropdowns */}
          <nav ref={navRef} className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const hasChildren = Boolean(item.children && item.children.length > 0);
              const isChildActive = item.children?.some((child) => child.id === currentPage);
              const isActive = currentPage === item.id || (currentPage === 'home' && item.id === 'inicio') || isChildActive;
              const isOpen = openDropdown === item.id;

              if (hasChildren) {
                return (
                  <div key={item.id} className="relative">
                    <button
                      onClick={() => setOpenDropdown(isOpen ? null : item.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#E8F0EA] dark:bg-slate-800 text-[#7C9885] dark:text-emerald-300'
                          : 'text-[#526157] dark:text-slate-300 hover:bg-[#E8F0EA]/60 dark:hover:bg-slate-800 hover:text-[#2D3831]'
                      }`}
                    >
                      {item.label}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#7C9885]' : 'opacity-60'}`} />
                    </button>

                    {/* Menú desplegable flotante */}
                    {isOpen && (
                      <div className="absolute top-full left-0 mt-2 w-72 bg-[#FAF8F3] dark:bg-slate-900 border border-[#E2DEC9] dark:border-slate-800 rounded-2xl shadow-lg p-2 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        {item.children?.map((sub) => {
                          const SubIcon = sub.icon;
                          const isSubActive = currentPage === sub.id;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => handleNavClick(sub.id, sub.action)}
                              className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-3 cursor-pointer ${
                                isSubActive
                                  ? 'bg-[#7C9885] text-white shadow-xs'
                                  : 'hover:bg-[#E8F0EA] dark:hover:bg-slate-800 text-[#2D3831] dark:text-slate-200'
                              }`}
                            >
                              <div className={`p-1.5 rounded-lg mt-0.5 ${isSubActive ? 'bg-white/20 text-white' : 'bg-[#E8F0EA] dark:bg-slate-800 text-[#7C9885] dark:text-emerald-400'}`}>
                                <SubIcon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-semibold leading-tight">{sub.label}</div>
                                {sub.description && (
                                  <div className={`text-[10px] mt-0.5 leading-tight line-clamp-1 ${isSubActive ? 'text-white/80' : 'text-[#66756C] dark:text-slate-400'}`}>
                                    {sub.description}
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id, item.action)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#7C9885] text-white shadow-xs'
                      : 'text-[#526157] dark:text-slate-300 hover:bg-[#E8F0EA] dark:hover:bg-slate-800 hover:text-[#2D3831]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Autenticación Desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center space-x-2 bg-[#E8F0EA]/70 dark:bg-slate-800/80 p-1 pl-3 rounded-xl border border-[#C5D8CC]/60 dark:border-slate-700">
                <span className="text-xs font-semibold text-[#2D3831] dark:text-slate-200 flex items-center gap-1.5">
                  {userRole === 'ADMIN' ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-[#7C9885] dark:text-emerald-400" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-[#7C9885] dark:text-emerald-400" />
                  )}
                  {userName}
                </span>

                {userRole === 'ADMIN' && (
                  <button
                    onClick={() => navigateTo('admin')}
                    className="px-2.5 py-1 bg-[#7C9885] hover:bg-[#6B8774] text-white font-semibold text-[11px] rounded-lg transition-colors cursor-pointer"
                  >
                    Admin
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="p-1.5 hover:bg-[#DCD7C5]/50 dark:hover:bg-slate-700 rounded-lg text-[#526157] dark:text-slate-300 transition-colors cursor-pointer"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-3.5 h-3.5 text-[#E08A72]" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigateTo('login')}
                className="px-4 py-2 bg-[#7C9885] hover:bg-[#6B8774] text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer transition-all"
              >
                Iniciar Sesión
              </button>
            )}
          </div>

          {/* Botón Menú Móvil */}
          <div className="flex items-center space-x-2 lg:hidden">
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

        {/* Menú Desplegable Móvil con Acordeones */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF8F3] dark:bg-slate-900 border-b border-[#E2DEC9] dark:border-slate-800 px-4 pt-3 pb-6 space-y-1 max-h-[80vh] overflow-y-auto">
            {navItems.map((item) => {
              const hasChildren = Boolean(item.children && item.children.length > 0);
              const isExpanded = mobileExpanded[item.id];
              const isChildActive = item.children?.some((child) => child.id === currentPage);
              const isActive = currentPage === item.id || (currentPage === 'home' && item.id === 'inicio') || isChildActive;

              if (hasChildren) {
                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      onClick={() => toggleMobileSubmenu(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#E8F0EA] dark:bg-slate-800 text-[#7C9885] dark:text-emerald-400'
                          : 'text-[#526157] dark:text-slate-300 hover:bg-[#E8F0EA]/60 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-[#7C9885]' : 'opacity-60'}`} />
                    </button>

                    {isExpanded && (
                      <div className="pl-3 pr-1 py-1 space-y-1 border-l-2 border-[#C5D8CC] dark:border-slate-700 ml-3">
                        {item.children?.map((sub) => {
                          const SubIcon = sub.icon;
                          const isSubActive = currentPage === sub.id;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => handleNavClick(sub.id, sub.action)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-2 ${
                                isSubActive
                                  ? 'bg-[#7C9885] text-white shadow-xs'
                                  : 'text-[#526157] dark:text-slate-400 hover:bg-[#E8F0EA] dark:hover:bg-slate-800'
                              }`}
                            >
                              <SubIcon className="w-3.5 h-3.5" />
                              {sub.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id, item.action)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#7C9885] text-white shadow-xs'
                      : 'text-[#526157] dark:text-slate-300 hover:bg-[#E8F0EA] dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* Acciones de Cuenta Móvil */}
            <div className="pt-4 mt-2 border-t border-[#E8E4D5] dark:border-slate-800 flex flex-col space-y-2">
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

      <BulletinModal isOpen={bulletinOpen} onClose={() => setBulletinOpen(false)} />
    </>
  );
}