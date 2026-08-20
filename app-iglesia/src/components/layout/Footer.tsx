'use client';

import React, { useState } from 'react';
import { Church, Clock, Send } from 'lucide-react';
import { SERVICE_SCHEDULES } from '@/data/mockData';

interface FooterProps {
  navigateTo?: (page: string) => void;
  setBulletinModalOpen?: (open: boolean) => void;
}

// Iconos SVG inline para evitar dependencias de marcas en Lucide
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function Footer({ navigateTo, setBulletinModalOpen }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');

  const handleNav = (pageId: string) => {
    if (pageId === 'boletin' && setBulletinModalOpen) {
      setBulletinModalOpen(true);
    } else if (navigateTo) {
      navigateTo(pageId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubscribe = (e: React.FormEvent) => { 
    e.preventDefault();
    if (!email) return;
    setEmail('');
  };

  return (
    <footer className="bg-[#FAF8F3] dark:bg-slate-900 border-t border-[#E2DEC9] dark:border-slate-800 text-[#2D3831] dark:text-slate-300 mt-16 transition-colors duration-300 antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 mb-10">
          
          {/* Identidad y Redes Sociales */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E8F0EA] dark:bg-slate-800 flex items-center justify-center text-[#7C9885] dark:text-emerald-400 font-bold border border-[#C5D8CC] dark:border-slate-700 shadow-xs">
                <Church className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#2D3831] dark:text-emerald-100 leading-tight">
                IASD CENTRAL DE HUALQUI
              </h3>
            </div>

            <p className="text-xs text-[#526157] dark:text-slate-400 leading-relaxed max-w-sm">
              Una iglesia comprometida con el amor de Dios, la proclamación del evangelio eterno y el servicio a nuestra comunidad.
            </p>

            <div className="flex items-center space-x-2 pt-1">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-[#E8F0EA] dark:bg-slate-800 border border-[#C5D8CC] dark:border-slate-700 flex items-center justify-center text-[#526157] dark:text-slate-300 hover:text-[#7C9885] dark:hover:text-emerald-400 hover:border-[#7C9885] transition-colors"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a 
                href="https://www.instagram.com/iasd.hualqui.central" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-[#E8F0EA] dark:bg-slate-800 border border-[#C5D8CC] dark:border-slate-700 flex items-center justify-center text-[#526157] dark:text-slate-300 hover:text-[#7C9885] dark:hover:text-emerald-400 hover:border-[#7C9885] transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a 
                href="https://www.youtube.com/@IASDCentralHualqui" 
                target="_blank" 
                rel="noreferrer" 
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-[#E8F0EA] dark:bg-slate-800 border border-[#C5D8CC] dark:border-slate-700 flex items-center justify-center text-[#526157] dark:text-slate-300 hover:text-[#7C9885] dark:hover:text-emerald-400 hover:border-[#7C9885] transition-colors"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Enlaces de Navegación a 2 Columnas */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-[#7C9885] dark:text-emerald-400 uppercase tracking-wider">
              Navegación
            </h4>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-[#526157] dark:text-slate-400 font-medium">
              <button 
                onClick={() => handleNav('inicio')} 
                className="hover:text-[#7C9885] dark:hover:text-emerald-300 transition-colors text-left cursor-pointer"
              >
                Inicio
              </button>
              <button 
                onClick={() => handleNav('himnario')} 
                className="hover:text-[#7C9885] dark:hover:text-emerald-300 transition-colors text-left cursor-pointer"
              >
                Himnario
              </button>
              <button 
                onClick={() => handleNav('jovenes')} 
                className="hover:text-[#7C9885] dark:hover:text-emerald-300 transition-colors text-left cursor-pointer"
              >
                Jóvenes JA
              </button>
              <button 
                onClick={() => handleNav('estudios-biblicos')} 
                className="hover:text-[#7C9885] dark:hover:text-emerald-300 transition-colors text-left cursor-pointer"
              >
                Estudios Bíblicos
              </button>
              <button 
                onClick={() => handleNav('biblia')} 
                className="hover:text-[#7C9885] dark:hover:text-emerald-300 transition-colors text-left cursor-pointer"
              >
                Biblia
              </button>
              <button 
                onClick={() => handleNav('mayordomia')} 
                className="hover:text-[#7C9885] dark:hover:text-emerald-300 transition-colors text-left cursor-pointer"
              >
                Mayordomía
              </button>
              <button 
                onClick={() => handleNav('leccion')} 
                className="hover:text-[#7C9885] dark:hover:text-emerald-300 transition-colors text-left cursor-pointer"
              >
                Lección Diaria
              </button>
              <button 
                onClick={() => handleNav('boletin')} 
                className="hover:text-[#7C9885] dark:hover:text-emerald-300 transition-colors text-left cursor-pointer"
              >
                Boletín Sabático
              </button>
            </div>
          </div>

          {/* Horarios de Culto */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-[#7C9885] dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Horarios de Culto
            </h4>
            <ul className="space-y-2 text-xs text-[#526157] dark:text-slate-400 font-medium">
              {SERVICE_SCHEDULES.map((s) => (
                <li key={s.id} className="leading-snug">
                  <div className="font-semibold text-[#2D3831] dark:text-slate-200">
                    {s.name} ({s.day})
                  </div>
                  <div className="text-[11px] opacity-90">{s.time} hrs</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Suscripción / Boletín Semanal */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-[#7C9885] dark:text-emerald-400 uppercase tracking-wider">
              Boletín Semanal
            </h4>
            <p className="text-xs text-[#526157] dark:text-slate-400 leading-relaxed">
              Recibe noticias, avisos y reflexiones devocionales en tu correo.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-200 placeholder-[#8A9A8F] focus:outline-none focus:border-[#7C9885] dark:focus:border-emerald-400 transition-colors"
              />
              <button
                type="submit"
                className="w-full py-2 px-4 bg-[#7C9885] hover:bg-[#6B8774] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3 h-3" /> Suscribirse
              </button>
            </form>
          </div>

        </div>

        {/* Barra Inferior y Copyright */}
        <div className="border-t border-[#E8E4D5] dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#66756C] dark:text-slate-500 font-medium gap-3">
          <p>© {currentYear} IASD Central de Hualqui. Todos los derechos reservados.</p>
          <div className="flex items-center space-x-3 text-[11px]">
            <span className="hover:text-[#7C9885] dark:hover:text-emerald-300 cursor-pointer transition-colors">Privacidad</span>
            <span>•</span>
            <span className="hover:text-[#7C9885] dark:hover:text-emerald-300 cursor-pointer transition-colors">Términos</span>
          </div>
        </div>
      </div>
    </footer>
  );
}