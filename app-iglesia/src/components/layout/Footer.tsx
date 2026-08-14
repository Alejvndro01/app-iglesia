'use client';

import React from 'react';
import { Home, BookOpen, Music, FileText, Heart } from 'lucide-react';

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
    <footer className="w-full bg-[#A1B5C4] text-white border-t border-white/10 pt-12 pb-24 px-6 font-sans">
      <div className="max-w-md mx-auto space-y-10">
        
        {/* Identidad Minimalist / Editorial */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-white/15 border border-white/20 mx-auto flex items-center justify-center mb-3">
            <Heart className="w-4 h-4 text-minimal-accent fill-minimal-accent" />
          </div>
          <h3 className="text-lg font-bold tracking-tight text-white uppercase">
            IASD Central Hualqui
          </h3>
          <p className="text-xs text-white/70 max-w-xs mx-auto leading-relaxed font-light">
            Un espacio de fe, comunión y servicio en la palabra de Dios.
          </p>
        </div>

        {/* Muestra de tonos estilo paleta */}
        <div className="flex justify-center items-center gap-1.5 opacity-60">
          <span className="w-4 h-1.5 rounded-full bg-[#537180]" />
          <span className="w-4 h-1.5 rounded-full bg-[#7091A4]" />
          <span className="w-4 h-1.5 rounded-full bg-[#BDD1DE]" />
          <span className="w-4 h-1.5 rounded-full bg-[#C8D3DB]" />
        </div>

        {/* NAVEGACIÓN RÁPIDA - Botones sutiles */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button 
            onClick={() => handleNav('home')} 
            className="bg-white/10 hover:bg-white/20 p-3 rounded-xl border border-white/10 transition-all text-left flex items-center gap-2.5 active:scale-95"
          >
            <Home className="w-4 h-4 text-white/80" />
            <span className="font-medium text-white">Inicio</span>
          </button>

          <button 
            onClick={() => handleNav('leccion')} 
            className="bg-white/10 hover:bg-white/20 p-3 rounded-xl border border-white/10 transition-all text-left flex items-center gap-2.5 active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-white/80" />
            <span className="font-medium text-white">Lección</span>
          </button>

          <button 
            onClick={() => handleNav('himnario')} 
            className="bg-white/10 hover:bg-white/20 p-3 rounded-xl border border-white/10 transition-all text-left flex items-center gap-2.5 active:scale-95"
          >
            <Music className="w-4 h-4 text-white/80" />
            <span className="font-medium text-white">Himnario</span>
          </button>

          <button 
            onClick={() => handleNav('boletin')} 
            className="bg-white/10 hover:bg-white/20 p-3 rounded-xl border border-white/10 transition-all text-left flex items-center gap-2.5 active:scale-95"
          >
            <FileText className="w-4 h-4 text-white/80" />
            <span className="font-medium text-white">Boletín</span>
          </button>
        </div>

        {/* HORARIOS - Card semi-transparente */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 space-y-3">
          <span className="text-[10px] tracking-widest uppercase text-white/60 font-semibold block">
            Horarios de Culto
          </span>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white/5 p-2 rounded-lg border border-white/5">
              <span className="block font-bold text-white">Sáb</span>
              <span className="text-[10px] text-white/70">09:30</span>
            </div>
            <div className="bg-white/5 p-2 rounded-lg border border-white/5">
              <span className="block font-bold text-white">Mié</span>
              <span className="text-[10px] text-white/70">19:30</span>
            </div>
            <div className="bg-white/5 p-2 rounded-lg border border-white/5">
              <span className="block font-bold text-white">Dom</span>
              <span className="text-[10px] text-white/70">19:30</span>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="pt-4 border-t border-white/10 text-center text-[11px] text-white/50 space-y-2">
          <p>© {currentYear} IASD Central Hualqui</p>
          <div className="flex justify-center items-center gap-4 text-[10px]">
            <span className="hover:text-white transition-colors cursor-pointer">Privacidad</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">Términos</span>
          </div>
        </div>

      </div>
    </footer>
  );
}