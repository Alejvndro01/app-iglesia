'use client';

import React, { useState } from 'react';
import { BIBLE_COURSES } from '@/data/mockData';
import { apiClient } from '@/lib/api-client';
import { BookOpen, CheckCircle2, ShieldCheck, Send, RotateCcw } from 'lucide-react';

interface StudiesViewProps {
  showToast: (msg: string) => void;
}

export function EstudiosBiblicosPageView({ showToast }: StudiesViewProps) {
  const [selectedCourse, setSelectedCourse] = useState<typeof BIBLE_COURSES[0] | null>(null);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+569');
  const [address, setAddress] = useState('');
  const [modality, setModality] = useState('Presencial en Templo');
  
  // Estados para la verificación OTP
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  // Formatear/Sanitizar teléfono mientras el usuario escribe (+569XXXXXXXX)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\s+/g, '');
    if (!val.startsWith('+569')) {
      val = '+569' + val.replace(/^\+?56?9?/, '');
    }
    if (val.length <= 12) {
      setPhone(val);
      setIsPhoneVerified(false);
      setOtpSent(false);
    }
  };

  // 1. Enviar código por WhatsApp
  const handleSendOtp = async () => {
    const cleanPhone = phone.replace(/\s+/g, '');
    if (!/^\+569\d{8}$/.test(cleanPhone)) {
      showToast('Ingresa un número válido con el formato +569XXXXXXXX');
      return;
    }

    setOtpLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telefono: cleanPhone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al enviar código OTP');

      setOtpSent(true);
      showToast('¡Código de verificación enviado por WhatsApp!');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Error al solicitar el código');
    } finally {
      setOtpLoading(false);
    }
  };

  // 2. Verificar código y Guardar Solicitud
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCourse) {
      showToast('Por favor selecciona un curso bíblico de la lista.');
      return;
    }

    if (!fullName.trim()) {
      showToast('Ingresa tu nombre completo.');
      return;
    }

    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      showToast('Ingresa el código de verificación de 6 dígitos.');
      return;
    }

    setLoading(true);

    try {
      const cleanPhone = phone.replace(/\s+/g, '');

      // Paso A: Validar código OTP si aún no ha sido marcado como verificado
      if (!isPhoneVerified) {
        const verifyRes = await fetch('/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telefono: cleanPhone, code: otpCode.trim() }),
        });

        const verifyData = await verifyRes.json();
        if (!verifyRes.ok) {
          throw new Error(verifyData.error || 'El código ingresado es incorrecto o ha expirado');
        }
        setIsPhoneVerified(true);
      }

      // Paso B: Guardar la solicitud del curso con todos los datos saneados
      const payload = {
        curso: selectedCourse.title,
        nombre: fullName.trim(),
        telefono: cleanPhone,
        direccion: address.trim() || 'No especificada',
        modalidad: modality,
      };

      await apiClient.createSolicitudCurso(payload);

      setSubmitted(true);
      showToast('¡Solicitud verificada y guardada correctamente!');

      // Limpiar formulario
      setFullName('');
      setPhone('+569');
      setAddress('');
      setOtpCode('');
      setOtpSent(false);
      setIsPhoneVerified(false);
      setModality('Presencial en Templo');
      setSelectedCourse(null);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 antialiased">
      {/* Header Encabezado */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="bg-[#E8F0EA] text-[#546E5C] dark:bg-emerald-950/50 dark:text-emerald-300 text-[11px] font-bold px-3 py-1 rounded-full border border-[#7C9885]/30">
          Creciendo en la Palabra
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2D3831] dark:text-emerald-100">
          Solicitud de Estudios Bíblicos
        </h2>
        <p className="text-xs sm:text-sm text-[#66756C] dark:text-slate-400">
          Descubre las hermosas promesas de Dios con la guía de un instructor en Hualqui.
        </p>
      </div>

      {/* Grid de Cursos Seleccionables */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {BIBLE_COURSES.map((course) => {
          const isSelected = selectedCourse?.id === course.id;
          return (
            <div
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#7C9885] text-white border-[#6B8774] shadow-md scale-[1.02]'
                  : 'bg-[#FAF8F3] dark:bg-slate-900 text-[#2D3831] dark:text-slate-200 border-[#E2DEC9] dark:border-slate-800 hover:border-[#7C9885] shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{course.icon}</span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-[#E8F0EA] dark:bg-slate-800 text-[#425949] dark:text-emerald-300'
                    }`}
                  >
                    {course.badge}
                  </span>
                </div>
                <h4 className="text-base font-bold">{course.title}</h4>
                <p
                  className={`text-xs mt-1.5 leading-relaxed ${
                    isSelected ? 'text-[#E8EFEA]' : 'text-[#526157] dark:text-slate-400'
                  }`}
                >
                  {course.description}
                </p>
              </div>

              <div
                className={`mt-6 pt-3 border-t text-xs font-semibold flex justify-between ${
                  isSelected ? 'border-white/20 text-[#E8EFEA]' : 'border-[#E8E4D5] dark:border-slate-800 text-[#7C9885]'
                }`}
              >
                <span>{course.lessons}</span>
                <span>{course.level}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Formulario de Inscripción */}
      <div className="max-w-2xl mx-auto bg-[#FAF8F3] dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-[#E2DEC9] dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-bold text-[#2D3831] dark:text-emerald-100 mb-4 text-center flex items-center justify-center gap-2">
          <BookOpen className="w-5 h-5 text-[#7C9885]" /> Formulario de Inscripción
        </h3>

        {submitted ? (
          <div className="bg-[#E8F0EA] dark:bg-emerald-950/40 text-[#2D3831] dark:text-emerald-200 p-6 rounded-2xl text-center space-y-2 border border-[#C5D8CC] dark:border-emerald-800">
            <span className="text-3xl block">✨</span>
            <h4 className="font-bold text-sm">¡Solicitud Recibida!</h4>
            <p className="text-xs text-[#526157] dark:text-emerald-300">
              Un instructor bíblico se comunicará contigo a la brevedad.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 px-5 py-2.5 bg-[#7C9885] hover:bg-[#6B8774] text-white font-semibold text-xs rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Enviar otra solicitud
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#2D3831] dark:text-slate-200 mb-1">
                Curso Bíblico Seleccionado
              </label>
              <input
                type="text"
                readOnly
                value={
                  selectedCourse
                    ? selectedCourse.title
                    : 'Selecciona un curso de la lista superior'
                }
                className="w-full bg-[#EFECE3] dark:bg-slate-800 p-3 rounded-xl border border-[#DCD7C5] dark:border-slate-700 font-bold text-[#7C9885] dark:text-emerald-400 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-[#2D3831] dark:text-slate-200 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 p-3 rounded-xl border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-100 outline-none focus:border-[#7C9885] transition-colors"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2D3831] dark:text-slate-200 mb-1">
                  WhatsApp / Teléfono *
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    required
                    placeholder="+56912345678"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="w-full bg-white dark:bg-slate-950 p-3 rounded-xl border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-100 outline-none focus:border-[#7C9885] transition-colors"
                  />
                  {!otpSent && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpLoading || phone.length !== 12}
                      className="whitespace-nowrap px-4 py-3 bg-[#7C9885] hover:bg-[#6B8774] disabled:opacity-50 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
                    >
                      {otpLoading ? 'Enviando...' : 'Enviar Código'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Verificación de Código OTP */}
            {otpSent && (
              <div className="p-4 bg-[#F8F5EC] dark:bg-slate-800/80 rounded-2xl border border-[#E8E4D5] dark:border-slate-700 space-y-2">
                <label className="block font-semibold text-[#2D3831] dark:text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#7C9885]" /> Código de Verificación (WhatsApp) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.trim())}
                    className="w-full bg-white dark:bg-slate-950 text-center font-mono text-sm tracking-widest p-2.5 rounded-xl border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-100 outline-none focus:border-[#7C9885]"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpLoading}
                    className="text-[11px] text-[#66756C] hover:text-[#2D3831] dark:text-slate-400 underline px-2 cursor-pointer"
                  >
                    Reenviar
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold text-[#2D3831] dark:text-slate-200 mb-1">
                Dirección en Hualqui (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ej. Calle Bulnes #123, Hualqui"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 p-3 rounded-xl border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-100 outline-none focus:border-[#7C9885] transition-colors"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#2D3831] dark:text-slate-200 mb-1">
                Modalidad Preferida
              </label>
              <select
                value={modality}
                onChange={(e) => setModality(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 p-3 rounded-xl border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-100 outline-none focus:border-[#7C9885] transition-colors"
              >
                <option value="Presencial en Templo">
                  Presencial en Templo Central (La Concepción 450)
                </option>
                <option value="A Domicilio">A Domicilio en Hualqui</option>
                <option value="Virtual (Zoom / WhatsApp)">
                  Virtual (Zoom / Meet / WhatsApp)
                </option>
              </select>
            </div>

            <button
              type="submit"
              disabled={!selectedCourse || !otpSent || loading}
              className="w-full py-3.5 bg-[#7C9885] hover:bg-[#6B8774] disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                'Verificando y Guardando...'
              ) : !otpSent ? (
                'Primero solicita el código por WhatsApp'
              ) : (
                <>
                  <Send className="w-4 h-4" /> Verificar Código y Confirmar Solicitud
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}