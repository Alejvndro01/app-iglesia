'use client';

import React from 'react';
import { Church, MapPin, Clock, Compass } from 'lucide-react';

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
    <footer className="bg-[#FAF8F3] dark:bg-slate-900 border-t border-[#E2DEC9] dark:border-slate-800 text-[#2D3831] dark:text-slate-300 mt-16 transition-colors duration-300 antialiased">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Identidad de la Iglesia */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E8F0EA] dark:bg-slate-800 flex items-center justify-center text-[#7C9885] dark:text-emerald-400 font-bold border border-[#C5D8CC] dark:border-slate-700 shadow-xs">
                <Church className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#2D3831] dark:text-emerald-100 leading-tight">
                  IASD CENTRAL
                </h3>
                <p className="text-[10px] font-bold text-[#66756C] dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#7C9885]" /> DE HUALQUI
                </p>
              </div>
            </div>
            <p className="text-xs text-[#526157] dark:text-slate-400 leading-relaxed max-w-sm">
              Una comunidad cristiana comprometida con proclamar el evangelio eterno, 
              la adoración y el servicio en la comuna de Hualqui y sus alrededores.
            </p>
          </div>

          {/* Enlaces Rápidos */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#7C9885] dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" /> Navegación
            </h4>
            <ul className="space-y-1.5 text-xs text-[#526157] dark:text-slate-400 font-medium">
              <li>
                <button 
                  onClick={() => handleNav('home')} 
                  className="hover:text-[#7C9885] dark:hover:text-emerald-300 transition-colors cursor-pointer text-left"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('leccion')} 
                  className="hover:text-[#7C9885] dark:hover:text-emerald-300 transition-colors cursor-pointer text-left"
                >
                  Lección Diaria
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('himnario')} 
                  className="hover:text-[#7C9885] dark:hover:text-emerald-300 transition-colors cursor-pointer text-left"
                >
                  Himnario Adventista
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('boletin')} 
                  className="hover:text-[#7C9885] dark:hover:text-emerald-300 transition-colors cursor-pointer text-left"
                >
                  Boletín Sabático
                </button>
              </li>
            </ul>
          </div>

          {/* Horarios de Cultos */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#7C9885] dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Horarios de Culto
            </h4>
            <ul className="space-y-1.5 text-xs text-[#526157] dark:text-slate-400 font-medium">
              <li>
                <span className="font-semibold text-[#2D3831] dark:text-slate-200">Sábados:</span> 09:30 hrs
              </li>
              <li>
                <span className="font-semibold text-[#2D3831] dark:text-slate-200">Miércoles:</span> 19:30 hrs
              </li>
              <li>
                <span className="font-semibold text-[#2D3831] dark:text-slate-200">Domingos:</span> 19:30 hrs
              </li>
            </ul>
          </div>
        </div>

        {/* Separador y Copyright */}
        <div className="border-t border-[#E8E4D5] dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#66756C] dark:text-slate-500 font-medium gap-3">
          <p>
            © {currentYear} IASD Central de Hualqui. Todos los derechos reservados.
          </p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-[#7C9885] dark:hover:text-emerald-300 cursor-pointer transition-colors">
              Privacidad
            </span>
            <span>•</span>
            <span className="hover:text-[#7C9885] dark:hover:text-emerald-300 cursor-pointer transition-colors">
              Términos
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}