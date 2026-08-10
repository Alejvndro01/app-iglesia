'use client';

import React, { useEffect, useState } from 'react';

interface BulletinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BulletinModal({ isOpen, onClose }: BulletinModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/boletin')
        .then((res) => res.json())
        .then((d) => {
          setData(d);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-3">
          <div>
            <h3 className="font-black text-[#486379] text-base">{data?.titulo || 'Boletín Sabático'}</h3>
            <p className="text-xs text-[#eca489] font-bold">{data?.fecha}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 font-bold hover:text-slate-600 text-lg">✕</button>
        </div>

        {loading ? (
          <p className="text-xs text-center py-8 text-slate-400">Cargando boletín...</p>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="bg-[#f0f6fb] p-4 rounded-2xl border border-sky-100">
              <p className="italic text-slate-700 font-medium">"{data?.versiculoClave}"</p>
            </div>

            <div>
              <h4 className="font-extrabold text-[#486379] mb-2 uppercase tracking-wider text-[11px]">Orden del Servicio</h4>
              <div className="space-y-1.5">
                {data?.ordenCulto?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <span className="font-bold text-[#eca489]">{item.hora}</span>
                    <span className="font-semibold text-slate-700">{item.actividad}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-extrabold text-[#486379] mb-2 uppercase tracking-wider text-[11px]">Anuncios de la Semana</h4>
              <div className="space-y-2">
                {data?.anuncios?.map((a: any) => (
                  <div key={a.id} className="p-3 bg-[#fbf6ee] rounded-2xl border border-amber-100">
                    <h5 className="font-bold text-[#486379]">{a.titulo}</h5>
                    <p className="text-slate-600 mt-0.5">{a.detalle}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}