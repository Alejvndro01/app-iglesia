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
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [modality, setModality] = useState('Presencial en Templo');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    setLoading(true);

    try {
      await apiClient.createSolicitudCurso({
        curso: selectedCourse.title,
        nombre: fullName,
        telefono: phone,
        direccion: address,
        modalidad: modality,
      });

      setSubmitted(true);
      showToast('¡Solicitud guardada correctamente en la base de datos!');

      setFullName('');
      setPhone('');
      setAddress('');
      setModality('Presencial en Templo');
      setSelectedCourse(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message);
      } else {
        showToast('Error de conexión con el servidor');
      }
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
                <input
                  type="tel"
                  required
                  placeholder="+56 9 1234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#fbf6ee] dark:bg-slate-800 text-xs p-3.5 rounded-2xl border border-amber-100 dark:border-slate-700 text-slate-800 dark:text-slate-100 outline-none focus:border-[#eca489] transition-colors"
                />
              </div>
            </div>

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
              disabled={!selectedCourse || loading}
              className="w-full py-4 bg-[#eca489] hover:bg-[#e49375] disabled:opacity-50 text-white font-bold text-xs rounded-full shadow-md transition-all cursor-pointer"
            >
              {loading
                ? 'Guardando en base de datos...'
                : selectedCourse
                ? 'Confirmar y Solicitar Curso'
                : 'Selecciona un curso arriba'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}