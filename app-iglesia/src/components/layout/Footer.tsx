'use client';

import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-sky-100 text-[#486379] mt-16 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Identidad de la Iglesia */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-[#eca489] flex items-center justify-center text-white font-black text-sm shadow-xs">
                ⛪
              </div>
              <div>
                <h3 className="font-black text-base text-[#486379] leading-tight">
                  IASD CENTRAL
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  DE HUALQUI
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Una comunidad cristiana comprometida con proclamar el evangelio eterno, 
              la adoración y el servicio en Hualqui y sus alrededores.
            </p>
          </div>

          {/* Enlaces Rápidos */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-[#eca489] uppercase tracking-wider">
              Navegación
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500 font-medium">
              <li>
                <a href="/" className="hover:text-[#486379] transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="/leccion" className="hover:text-[#486379] transition-colors">
                  Lección Diaria
                </a>
              </li>
              <li>
                <a href="/himnario" className="hover:text-[#486379] transition-colors">
                  Himnario Adventista
                </a>
              </li>
              <li>
                <a href="/boletin" className="hover:text-[#486379] transition-colors">
                  Boletín Sabático
                </a>
              </li>
            </ul>
          </div>

          {/* Horarios de Cultos */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-[#eca489] uppercase tracking-wider">
              Horarios de Culto
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-500 font-medium">
              <li>
                <span className="font-bold text-[#486379]">Sábados:</span> 09:30 hrs
              </li>
              <li>
                <span className="font-bold text-[#486379]">Miércoles:</span> 19:30 hrs
              </li>
              <li>
                <span className="font-bold text-[#486379]">Domingos:</span> 19:30 hrs
              </li>
            </ul>
          </div>
        </div>

        {/* Separador y Copyright */}
        <div className="border-t border-sky-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 font-medium gap-3">
          <p>
            © {currentYear} IASD Central de Hualqui. Todos los derechos reservados.
          </p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-[#486379] cursor-pointer transition-colors">
              Privacidad
            </span>
            <span>•</span>
            <span className="hover:text-[#486379] cursor-pointer transition-colors">
              Términos
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}