'use client';

import React, { useState } from 'react';
import {
  HeartHandshake,
  Calculator,
  PieChart,
  Copy,
  Check,
  ShieldCheck,
  Coins,
  Clock,
  Sparkles,
  Heart,
  HelpCircle,
  TrendingUp,
  Landmark,
  ArrowRight
} from 'lucide-react';

export default function StewardshipMinistryView() {
  // Calculadora de Mayordomía
  const [income, setIncome] = useState<string>('');
  const [offeringPercentage, setOfferingPercentage] = useState<number>(5);
  const [copiedBankData, setCopiedBankData] = useState(false);

  const numIncome = parseFloat(income.replace(/\D/g, '')) || 0;
  const titheAmount = Math.round(numIncome * 0.1);
  const offeringAmount = Math.round(numIncome * (offeringPercentage / 100));
  const totalAmount = titheAmount + offeringAmount;

  const fourPillars = [
    {
      title: 'Templo (Cuerpo)',
      desc: 'Cuidado de la salud integral como morada del Espíritu Santo.',
      icon: Heart
    },
    {
      title: 'Tiempo',
      desc: 'Consagración del Santo Sábado y administración sabia del día.',
      icon: Clock
    },
    {
      title: 'Talentos',
      desc: 'Poner los dones espirituales al servicio de la comunidad.',
      icon: Sparkles
    },
    {
      title: 'Tesoros',
      desc: 'Fidelidad en el diezmo sagrado y generosidad en las ofrendas.',
      icon: Coins
    }
  ];

  const handleCopyAccount = () => {
    const textToCopy = `Banco: BancoEstado
Tipo de Cuenta: Cuenta Corriente
Número: 123456789
Nombre: Iglesia Adventista del Séptimo Día Central Hualqui
RUT: 65.123.456-7
Correo: tesoreria.hualqui@iasd.cl`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedBankData(true);
    setTimeout(() => setCopiedBankData(false), 2000);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 antialiased text-[#2D3831] dark:text-slate-200">
      
      {/* 1. HERO CON PROPÓSITO INTEGRAL (4 PILARES) */}
      <div className="rounded-3xl bg-[#FAF8F3] dark:bg-slate-900 border border-[#E2DEC9] dark:border-slate-800 p-8 sm:p-12 shadow-xs space-y-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F0EA] dark:bg-slate-800 text-[#7C9885] dark:text-emerald-400 text-xs font-bold uppercase tracking-wider border border-[#C5D8CC]/60 dark:border-slate-700">
            <HeartHandshake className="w-3.5 h-3.5" /> Mayordomía Cristiana
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#2D3831] dark:text-emerald-100 leading-tight">
            Administradores de la <span className="text-[#E0A96D] italic">gracia</span> de Dios
          </h1>
          <p className="text-xs sm:text-sm text-[#526157] dark:text-slate-400 leading-relaxed">
            La mayordomía no se limita únicamente a los recursos financieros; abarca la consagración voluntaria de toda nuestra vida en gratitud a nuestro Creador.
          </p>
        </div>

        {/* Las 4 T de la Mayordomía */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {fourPillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-[#E8E4D5] dark:border-slate-700 space-y-2 hover:border-[#7C9885] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#E8F0EA] dark:bg-slate-700 text-[#7C9885] dark:text-emerald-400 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-[#2D3831] dark:text-slate-100">{p.title}</h4>
                <p className="text-xs text-[#526157] dark:text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. CALCULADORA & DESTINO DE FONDOS (SPLIT 6 / 6) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Columna Izquierda: Calculadora Interactiva de Fidelidad */}
        <div className="lg:col-span-6 bg-[#FAF8F3] dark:bg-slate-900/60 border border-[#E2DEC9] dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-1 border-b border-[#E2DEC9] dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7C9885] dark:text-emerald-400">
              <Calculator className="w-4 h-4" /> Herramienta de Apoyo
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#2D3831] dark:text-emerald-100">
              Calculadora de Diezmo y Ofrenda
            </h3>
            <p className="text-xs text-[#526157] dark:text-slate-400">
              Calcula de forma privada el diezmo sagrado y tu ofrenda voluntaria pactada.
            </p>
          </div>

          <div className="space-y-4">
            {/* Input Ingreso */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#66756C] dark:text-slate-400">
                Ingreso Bruto o Incremento ($ CLP)
              </label>
              <input
                type="text"
                placeholder="Ej: 500000"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-100 font-mono text-sm outline-none focus:border-[#7C9885] transition-colors"
              />
            </div>

            {/* Selector Porcentaje de Ofrenda */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold uppercase tracking-wider text-[#66756C] dark:text-slate-400">
                  Pacto Voluntario de Ofrenda:
                </span>
                <span className="font-bold text-[#7C9885] dark:text-emerald-400">{offeringPercentage}%</span>
              </div>
              <div className="flex gap-2">
                {[3, 5, 7, 10].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setOfferingPercentage(pct)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      offeringPercentage === pct
                        ? 'bg-[#7C9885] text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 border border-[#DCD7C5] dark:border-slate-700 text-[#526157] dark:text-slate-300 hover:border-[#7C9885]'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Desglose de Totales */}
            <div className="p-5 rounded-2xl bg-[#E8F0EA]/70 dark:bg-slate-800/80 border border-[#C5D8CC] dark:border-slate-700 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#526157] dark:text-slate-300">Diezmo del Señor (10%):</span>
                <span className="font-bold font-mono text-[#2D3831] dark:text-slate-100">{formatCurrency(titheAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#526157] dark:text-slate-300">Ofrenda Voluntaria ({offeringPercentage}%):</span>
                <span className="font-bold font-mono text-[#2D3831] dark:text-slate-100">{formatCurrency(offeringAmount)}</span>
              </div>
              <div className="pt-2 border-t border-[#C5D8CC] dark:border-slate-700 flex justify-between items-center">
                <span className="font-bold text-xs uppercase tracking-wider text-[#7C9885] dark:text-emerald-400">Total a Consagrar:</span>
                <span className="text-lg font-serif font-bold text-[#2D3831] dark:text-emerald-100">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Transparencia & Destino de los Fondos */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-[#FAF8F3] dark:bg-slate-900/60 border border-[#E2DEC9] dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#7C9885] dark:text-emerald-400">
              <PieChart className="w-4 h-4" /> Transparencia Financiera
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#2D3831] dark:text-emerald-100">
              ¿Cómo se utilizan los recursos sagrados?
            </h3>
            
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-[#E8E4D5] dark:border-slate-700 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-[#7C9885] dark:text-emerald-400">1. Diezmos (100% Misión & Ministerio)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E8F0EA] dark:bg-slate-700 text-[#7C9885]">No local</span>
                </div>
                <p className="text-[#526157] dark:text-slate-400 leading-relaxed">
                  Se remite íntegramente a la Asociación Centro Sur de Chile para el sustento pastoral, plantación de nuevas iglesias, educación adventista y evangelismo mundial.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-[#E8E4D5] dark:border-slate-700 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-[#D08A4D]">2. Ofrendas Locales y de Pacto</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FAF0E6] dark:bg-amber-950/40 text-[#D08A4D]">Uso Local</span>
                </div>
                <p className="text-[#526157] dark:text-slate-400 leading-relaxed">
                  Sustentan los gastos operativos de nuestra iglesia en Hualqui: suministros, mantenimiento del templo, materiales de Escuela Sabática, proyectos juveniles y beneficencia social.
                </p>
              </div>
            </div>
          </div>

          {/* Caja de Datos Bancarios de la Iglesia */}
          <div className="bg-[#2D3831] text-white rounded-3xl p-6 sm:p-7 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E0A96D]">
                <Landmark className="w-4 h-4" /> Transferencia Electrónica
              </div>
              <button
                onClick={handleCopyAccount}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedBankData ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedBankData ? '¡Copiado!' : 'Copiar Datos'}
              </button>
            </div>

            <div className="space-y-1 text-xs text-slate-300 font-mono">
              <div><span className="text-slate-400">Banco:</span> BancoEstado</div>
              <div><span className="text-slate-400">Cuenta Corriente:</span> 123456789</div>
              <div><span className="text-slate-400">Nombre:</span> IASD Central de Hualqui</div>
              <div><span className="text-slate-400">RUT:</span> 65.123.456-7</div>
              <div><span className="text-slate-400">Correo:</span> tesoreria.hualqui@iasd.cl</div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              * Recuerda enviar el comprobante de transferencia al correo de tesorería indicando el desglose de Diezmo y Ofrenda.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}