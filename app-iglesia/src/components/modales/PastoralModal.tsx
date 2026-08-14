'use client';

import React from 'react';
import { X, MessageSquare } from 'lucide-react';

interface PastoralModalProps {
  onClose: () => void;
}

export function PastoralModal({ onClose }: PastoralModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-[#2D3831]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF8F3] dark:bg-slate-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-xl p-6 space-y-4 border border-[#E2DEC9] dark:border-slate-800">
        <div className="flex justify-between items-center border-b border-[#E8E4D5] dark:border-slate-800 pb-3">
          <h3 className="font-bold text-[#2D3831] dark:text-emerald-100 text-sm flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-[#7C9885]" /> Mensaje Pastoral
          </h3>
          <button 
            onClick={onClose} 
            className="text-[#66756C] hover:text-[#2D3831] dark:hover:text-white p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3 text-xs text-[#526157] dark:text-slate-300 leading-relaxed">
          <p className="font-semibold text-sm text-[#2D3831] dark:text-slate-100">
            Estimada congregación y amigos visitantes:
          </p>
          <p>
            Les damos la más cordial bienvenida a nuestra comunidad. Que la gracia y la paz de nuestro Señor Jesucristo acompañen sus vidas y familias durante esta semana.
          </p>
          <p className="italic text-[#7C9885] dark:text-emerald-400">
            "Jehová te bendiga, y te guarde; Jehová haga resplandecer su rostro sobre ti..." — Números 6:24-25
          </p>
        </div>
      </div>
    </div>
  );
}

export default PastoralModal;