'use client';

import React from 'react';

interface FooterProps {
  navigateTo?: (page: string) => void;
  setBulletinModalOpen?: (open: boolean) => void;
}

export function Footer({ navigateTo, setBulletinModalOpen }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleNav = (pageId: string) => {
    if (pageId === 'boletin' && setBulletinModalOpen) {
      setBulletinModalOpen(true);
    } else if (navigateTo) {
      navigateTo(pageId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-sky-100 dark:border-slate-800 text-[#486379] dark:text-slate-300 mt-16 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Identidad de la Iglesia */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-[#eca489] flex items-center justify-center text-white font-black text-sm shadow-xs">
                ⛪
              </div>
              <div>
                <h3 className="font-black text-base text-[#486379] dark:text-sky-300 leading-tight">
                  IASD CENTRAL
                </h3>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  DE HUALQUI
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Una comunidad cristiana comprometida con proclamar el evangelio eterno, 
              la adoración y el servicio en Hualqui y sus alrededores.
            </p>
          </div>

          {/* Enlaces Rápidos sin recarga de página */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-[#eca489] dark:text-amber-400 uppercase tracking-wider">
              Navegación
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <li>
                <button 
                  onClick={() => handleNav('home')} 
                  className="hover:text-[#486379] dark:hover:text-sky-300 transition-colors cursor-pointer text-left"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('leccion')} 
                  className="hover:text-[#486379] dark:hover:text-sky-300 transition-colors cursor-pointer text-left"
                >
                  Lección Diaria
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('himnario')} 
                  className="hover:text-[#486379] dark:hover:text-sky-300 transition-colors cursor-pointer text-left"
                >
                  Himnario Adventista
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('boletin')} 
                  className="hover:text-[#486379] dark:hover:text-sky-300 transition-colors cursor-pointer text-left"
                >
                  Boletín Sabático
                </button>
              </li>
            </ul>
          </div>

          {/* Horarios de Cultos */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-[#eca489] dark:text-amber-400 uppercase tracking-wider">
              Horarios de Culto
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <li>
                <span className="font-bold text-[#486379] dark:text-slate-200">Sábados:</span> 09:30 hrs
              </li>
              <li>
                <span className="font-bold text-[#486379] dark:text-slate-200">Miércoles:</span> 19:30 hrs
              </li>
              <li>
                <span className="font-bold text-[#486379] dark:text-slate-200">Domingos:</span> 19:30 hrs
              </li>
            </ul>
          </div>
        </div>

        {/* Separador y Copyright */}
        <div className="border-t border-sky-100 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 font-medium gap-3">
          <p>
            © {currentYear} IASD Central de Hualqui. Todos los derechos reservados.
          </p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-[#486379] dark:hover:text-sky-300 cursor-pointer transition-colors">
              Privacidad
            </span>
            <span>•</span>
            <span className="hover:text-[#486379] dark:hover:text-sky-300 cursor-pointer transition-colors">
              Términos
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}