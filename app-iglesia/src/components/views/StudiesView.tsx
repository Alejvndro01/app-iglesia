'use client';

import React, { useState } from 'react';
import { BIBLE_COURSES } from '@/data/mockData';
import { apiClient } from '@/lib/api-client';

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
      // Restablecer estado de verificación si cambia el número
      setIsPhoneVerified(false);
      setOtpSent(false);
    }
  };

  // 1. Enviar código por WhatsApp
  const handleSendOtp = async () => {
    if (!/^\+569\d{8}$/.test(phone)) {
      showToast('Ingresa un número válido con el formato +569XXXXXXXX');
      return;
    }

    setOtpLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telefono: phone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al enviar OTP');

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
    if (!selectedCourse) return;

    setLoading(true);

    try {
      // Validar código si aún no ha sido verificado
      if (!isPhoneVerified) {
        const verifyRes = await fetch('/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telefono: phone, code: otpCode }),
        });

        const verifyData = await verifyRes.json();
        if (!verifyRes.ok) throw new Error(verifyData.error || 'Código incorrecto');
        setIsPhoneVerified(true);
      }

      // Guardar la solicitud del curso
      await apiClient.createSolicitudCurso({
        curso: selectedCourse.title,
        nombre: fullName,
        telefono: phone,
        direccion: address,
        modalidad: modality,
      });

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <span className="bg-[#eca489] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
          Creciendo en la Palabra
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#486379] dark:text-sky-300 mt-2">
          Solicitud de Estudios Bíblicos
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Descubre las hermosas promesas de Dios con la guía de un instructor en Hualqui.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {BIBLE_COURSES.map((course) => (
          <div
            key={course.id}
            onClick={() => setSelectedCourse(course)}
            className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
              selectedCourse?.id === course.id
                ? 'bg-[#486379] dark:bg-slate-800 text-white border-[#eca489] shadow-lg scale-105'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-sky-100 dark:border-slate-800 hover:border-sky-300 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{course.icon}</span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    selectedCourse?.id === course.id
                      ? 'bg-[#eca489] text-white'
                      : 'bg-[#d0e2f1] dark:bg-slate-800 text-[#486379] dark:text-sky-300'
                  }`}
                >
                  {course.badge}
                </span>
              </div>
              <h4 className="text-lg font-black">{course.title}</h4>
              <p
                className={`text-xs mt-2 leading-relaxed ${
                  selectedCourse?.id === course.id
                    ? 'text-slate-200 dark:text-slate-300'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {course.description}
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-200/40 text-xs font-semibold flex justify-between">
              <span>{course.lessons}</span>
              <span>{course.level}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-8 border border-sky-100 dark:border-slate-800 shadow-xl transition-colors">
        <h3 className="text-xl font-black text-[#486379] dark:text-sky-300 mb-4 text-center">
          Formulario de Inscripción
        </h3>

        {submitted ? (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 p-6 rounded-2xl text-center space-y-2 border border-emerald-100 dark:border-emerald-800">
            <span className="text-4xl block">✨</span>
            <h4 className="font-bold text-lg">¡Solicitud Recibida!</h4>
            <p className="text-xs">
              Un instructor bíblico se comunicará contigo a la brevedad.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 px-5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-full cursor-pointer hover:bg-emerald-700 transition-colors"
            >
              Enviar otra solicitud
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#486379] dark:text-sky-300 mb-1">
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
                className="w-full bg-[#fbf6ee] dark:bg-slate-800 text-xs p-3.5 rounded-2xl border border-amber-100 dark:border-slate-700 font-bold text-[#eca489] dark:text-amber-400 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#486379] dark:text-sky-300 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#fbf6ee] dark:bg-slate-800 text-xs p-3.5 rounded-2xl border border-amber-100 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-[#eca489] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#486379] dark:text-sky-300 mb-1">
                  WhatsApp / Teléfono *
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    required
                    placeholder="+56912345678"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="w-full bg-[#fbf6ee] dark:bg-slate-800 text-xs p-3.5 rounded-2xl border border-amber-100 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-[#eca489] transition-colors"
                  />
                  {!otpSent && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpLoading || phone.length !== 12}
                      className="whitespace-nowrap px-4 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-2xl transition-all cursor-pointer"
                    >
                      {otpLoading ? 'Enviando...' : 'Enviar Código'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Campo dinámico para ingresar el código OTP recibido en WhatsApp */}
            {otpSent && (
              <div className="p-4 bg-amber-50 dark:bg-slate-800/60 rounded-2xl border border-amber-200 dark:border-slate-700 space-y-2">
                <label className="block text-xs font-bold text-[#486379] dark:text-sky-300">
                  Código de Verificación (Enviado a tu WhatsApp) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.trim())}
                    className="w-full bg-white dark:bg-slate-900 text-center font-mono text-base tracking-widest p-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-[#eca489]"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpLoading}
                    className="text-[10px] text-slate-500 hover:text-slate-700 underline px-2"
                  >
                    Reenviar
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#486379] dark:text-sky-300 mb-1">
                Dirección en Hualqui (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ej. Calle Bulnes #123, Hualqui"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#fbf6ee] dark:bg-slate-800 text-xs p-3.5 rounded-2xl border border-amber-100 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-[#eca489] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#486379] dark:text-sky-300 mb-1">
                Modalidad Preferida
              </label>
              <select
                value={modality}
                onChange={(e) => setModality(e.target.value)}
                className="w-full bg-[#fbf6ee] dark:bg-slate-800 text-xs p-3.5 rounded-2xl border border-amber-100 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-[#eca489] transition-colors"
              >
                <option value="Presencial en Templo">
                  Presencial en Templo Central (Bulnes 450)
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
              className="w-full py-4 bg-[#eca489] hover:bg-[#e49375] disabled:opacity-50 text-white font-bold text-xs rounded-full shadow-md transition-all cursor-pointer"
            >
              {loading
                ? 'Verificando y Guardando...'
                : !otpSent
                ? 'Primero solicita el código por WhatsApp'
                : 'Verificar Código y Confirmar Solicitud'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}