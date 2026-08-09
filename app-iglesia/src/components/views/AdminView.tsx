'use client';

import React, { useState, useEffect } from 'react';

interface Oracion {
  id: string;
  nombre: string;
  request: string;
  isPrivate: boolean;
  status: string;
  createdAt: string;
}

interface SolicitudCurso {
  id: string;
  curso: string;
  nombre: string;
  telefono: string;
  direccion?: string;
  modalidad: string;
  createdAt: string;
}

interface AdminViewProps {
  showToast: (msg: string) => void;
}

export function AdminPanelPageView({ showToast }: AdminViewProps) {
  const [prayers, setPrayers] = useState<Oracion[]>([]);
  const [courses, setCourses] = useState<SolicitudCurso[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [resPrayers, resCourses] = await Promise.all([
        fetch('/api/admin/oraciones'),
        fetch('/api/cursos'),
      ]);

      if (resPrayers.ok) {
        const dataPrayers = await resPrayers.json();
        setPrayers(dataPrayers.oraciones || []);
      }

      if (resCourses.ok) {
        const dataCourses = await resCourses.json();
        setCourses(dataCourses.solicitudes || []);
      }
    } catch (err) {
      showToast('Error al cargar datos del panel');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkAsAnswered = async (id: string) => {
    try {
      const res = await fetch('/api/admin/oraciones', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'Respondida' }),
      });

      if (!res.ok) throw new Error();

      showToast('Oración marcada como Respondida');
      setPrayers(prayers.map((p) => (p.id === id ? { ...p, status: 'Respondida' } : p)));
    } catch (err) {
      showToast('Error al actualizar estado');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs font-bold text-[#486379]">
        Cargando datos del panel de control...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-[#486379] text-white p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="bg-[#eca489] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
            Gestión Eclesial
          </span>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">Panel de Control de Liderazgo</h2>
          <p className="text-xs text-slate-200">
            Administración de oraciones intercesoras y solicitudes de cursos bíblicos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Moderación de Oraciones */}
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-xs space-y-4">
          <h3 className="font-black text-[#486379] text-base">🙏 Moderación de Oraciones</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {prayers.length === 0 ? (
              <p className="text-xs text-slate-400">No hay oraciones registradas.</p>
            ) : (
              prayers.map((p) => (
                <div key={p.id} className="p-4 bg-[#f0f6fb] rounded-2xl text-xs space-y-2">
                  <div className="flex justify-between font-bold">
                    <span>👤 {p.nombre} {p.isPrivate && '(Privado)'}</span>
                    <span className={p.status === 'Respondida' ? 'text-emerald-600' : 'text-[#eca489]'}>
                      {p.status}
                    </span>
                  </div>
                  <p className="text-slate-600">{p.request}</p>
                  {p.status !== 'Respondida' && (
                    <button
                      onClick={() => handleMarkAsAnswered(p.id)}
                      className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full text-[10px] cursor-pointer"
                    >
                      Marcar Respondida
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Solicitudes de Cursos Bíblicos */}
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-xs space-y-4">
          <h3 className="font-black text-[#486379] text-base">📖 Solicitudes de Cursos Bíblicos</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {courses.length === 0 ? (
              <p className="text-xs text-slate-400">No hay solicitudes registradas.</p>
            ) : (
              courses.map((c) => (
                <div key={c.id} className="p-4 bg-slate-50 rounded-2xl text-xs space-y-1 border border-slate-100">
                  <p className="font-bold text-[#eca489]">{c.curso}</p>
                  <p className="font-bold text-slate-700">👤 {c.nombre}</p>
                  <p className="text-slate-500">📞 WhatsApp: {c.telefono}</p>
                  <p className="text-slate-500">📍 {c.direccion || 'Sin dirección'} ({c.modalidad})</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}