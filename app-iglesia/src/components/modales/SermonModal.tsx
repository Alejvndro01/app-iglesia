'use client';

import React from 'react';
import { X, Play } from 'lucide-react';

interface SermonModalProps {
  onClose: () => void;
  sermon?: {
    title?: string;
    speaker?: string;
    videoUrl?: string;
  };
}

export function SermonModal({ onClose, sermon }: SermonModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-[#2D3831]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FAF8F3] dark:bg-slate-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-xl p-6 space-y-4 border border-[#E2DEC9] dark:border-slate-800">
        <div className="flex justify-between items-center border-b border-[#E8E4D5] dark:border-slate-800 pb-3">
          <h3 className="font-bold text-[#2D3831] dark:text-emerald-100 text-sm flex items-center gap-1.5">
            <Play className="w-4 h-4 text-[#7C9885]" /> {sermon?.title || 'Transmisión / Sermón Destacado'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-[#66756C] hover:text-[#2D3831] dark:hover:text-white p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="aspect-video bg-slate-950 rounded-2xl flex items-center justify-center text-xs text-slate-400">
          {sermon?.videoUrl ? (
            <iframe
              src={sermon.videoUrl}
              title={sermon.title || 'Sermón'}
              className="w-full h-full rounded-2xl"
              allowFullScreen
            />
          ) : (
            <p>Selecciona una predicación para reproducir o sintoniza el culto en vivo.</p>
          )}
        </div>
        {sermon?.speaker && (
          <p className="text-xs text-[#66756C] dark:text-slate-400">
            Predicador: <span className="font-semibold text-[#2D3831] dark:text-slate-200">{sermon.speaker}</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default SermonModal;