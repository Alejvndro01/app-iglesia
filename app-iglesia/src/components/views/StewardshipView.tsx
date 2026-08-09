'use client';

import React, { useState } from 'react';

export function StewardshipView() {
  const [income, setIncome] = useState('');
  const [percentage, setPercentage] = useState(10);
  const calculatedAmount = income ? (parseFloat(income) * (percentage / 100)).toFixed(0) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <span className="bg-[#eca489] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">Fidelidad y Adoración</span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#486379] mt-2">Mayordomía, Diezmos y Ofrendas</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="bg-[#486379] text-white p-8 rounded-3xl space-y-5 shadow-xl">
          <h3 className="text-2xl font-black">Sistema Oficial 7me</h3>
          <p className="text-xs text-slate-200 leading-relaxed">Puedes entregar tus diezmos y ofrendas de manera segura a través de la plataforma 7me.</p>
          <a href="https://www.7me.app" target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 bg-[#eca489] hover:bg-[#e49375] text-white font-bold text-xs rounded-full shadow-md">Ir a 7me ➔</a>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-sky-100 shadow-xl space-y-4">
          <h3 className="text-xl font-black text-[#486379]">Calculadora Bíblica</h3>
          <input type="number" placeholder="Ingreso ($ CLP)" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full bg-[#fbf6ee] text-xs p-3.5 rounded-2xl border border-amber-100 outline-none" />
          <input type="range" min="5" max="20" value={percentage} onChange={(e) => setPercentage(parseInt(e.target.value))} className="w-full accent-[#eca489]" />
          <div className="p-4 bg-[#f0f6fb] rounded-2xl text-center">
            <span className="text-xs text-slate-500">Monto Calculado:</span>
            <p className="text-2xl font-black text-[#eca489]">${calculatedAmount ? parseInt(calculatedAmount).toLocaleString('es-CL') : '0'} CLP</p>
          </div>
        </div>
      </div>
    </div>
  );
}