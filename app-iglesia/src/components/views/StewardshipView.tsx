'use client';

import React, { useState } from 'react';
import { Calculator, ExternalLink, HeartHandshake, DollarSign, ShieldCheck } from 'lucide-react';

export function StewardshipView() {
  const [income, setIncome] = useState('');
  const [percentage, setPercentage] = useState(10);

  const parsedIncome = parseFloat(income);
  const calculatedAmount = !isNaN(parsedIncome) && parsedIncome > 0 
    ? Math.round(parsedIncome * (percentage / 100)) 
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 antialiased">
      {/* Encabezado */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="bg-[#E8F0EA] text-[#546E5C] dark:bg-emerald-950/50 dark:text-emerald-300 text-[11px] font-bold px-3 py-1 rounded-full border border-[#7C9885]/30">
          Fidelidad y Adoración
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2D3831] dark:text-emerald-100 flex items-center justify-center gap-2">
          <HeartHandshake className="w-7 h-7 text-[#7C9885]" /> Mayordomía, Diezmos y Ofrendas
        </h2>
        <p className="text-xs sm:text-sm text-[#66756C] dark:text-slate-400">
          Reconociendo las bendiciones de Dios a través de nuestra gratitud y fidelidad en Hualqui.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Tarjeta del Sistema Oficial 7me */}
        <div className="bg-[#7C9885] dark:bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-5 shadow-xs border border-[#6B8774] dark:border-slate-800 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl">⛪</span>
              <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Plataforma Oficial
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">Plataforma Oficial 7me</h3>
            <p className="text-xs text-[#E8EFEA] dark:text-slate-300 leading-relaxed">
              Entrega tus diezmos y ofrendas voluntarias de forma segura, transparente y directa a la IASD Central Hualqui a través del sistema 7me.
            </p>
          </div>

          <div className="pt-4">
            <a
              href="https://home.7me.app/esp/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FAF8F3] hover:bg-white text-[#2D3831] font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Ir a 7me <ExternalLink className="w-3.5 h-3.5 text-[#7C9885]" />
            </a>
          </div>
        </div>

        {/* Calculadora Bíblica de Diezmos y Ofrendas */}
        <div className="bg-[#FAF8F3] dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-[#E2DEC9] dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-[#E8E4D5] dark:border-slate-800 pb-3">
            <Calculator className="w-5 h-5 text-[#7C9885]" />
            <h3 className="text-base sm:text-lg font-bold text-[#2D3831] dark:text-emerald-100">
              Calculadora Bíblica
            </h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#2D3831] dark:text-slate-200 mb-1">
                Ingreso de Referencia ($ CLP)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-[#7C9885] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  placeholder="Ej: 500000"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 pl-9 pr-3 py-3 rounded-xl border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-100 outline-none focus:border-[#7C9885] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-semibold text-[#2D3831] dark:text-slate-200">
                <span>Porcentaje sugerido:</span>
                <span className="text-[#7C9885] font-bold">{percentage}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="20"
                value={percentage}
                onChange={(e) => setPercentage(parseInt(e.target.value))}
                className="w-full accent-[#7C9885] bg-[#E8E4D5] h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#66756C] dark:text-slate-400">
                <span>5%</span>
                <span>10% (Diezmo)</span>
                <span>20%</span>
              </div>
            </div>

            <div className="p-4 bg-[#E8F0EA] dark:bg-slate-800 rounded-2xl text-center border border-[#C5D8CC] dark:border-slate-700 space-y-1">
              <span className="text-[11px] font-semibold text-[#546E5C] dark:text-slate-400 block">
                Monto Calculado ({percentage}%):
              </span>
              <p className="text-2xl font-bold text-[#2D3831] dark:text-emerald-300">
                ${calculatedAmount.toLocaleString('es-CL')} <span className="text-xs font-normal text-[#66756C]">CLP</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}