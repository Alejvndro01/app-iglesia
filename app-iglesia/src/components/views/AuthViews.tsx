'use client';

import React, { useState } from 'react';
import { apiClient } from '@/lib/api-client';

interface AuthProps {
  navigateTo: (page: string) => void;
  showToast: (msg: string) => void;
  setUserRole: (role: string) => void;
}

export function LoginView({ navigateTo, showToast, setUserRole }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await apiClient.login({ email, password });

      const userRoleFromApi = data.user?.role || 'USER';
      setUserRole(userRoleFromApi);

      showToast(`¡Bienvenido de nuevo, ${data.user?.nombre || ''}!`);
      navigateTo('home');
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(err.message);
      } else {
        showToast('Error de conexión');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-sky-100 dark:border-slate-800 transition-colors">
        <div className="text-center mb-6">
          <span className="text-4xl block mb-2">⛪</span>
          <h2 className="text-2xl font-black text-[#486379] dark:text-sky-300">Iniciar Sesión</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">IASD Central de Hualqui</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#486379] dark:text-sky-300 mb-1">Correo Electrónico</label>
            <input
              type="email"
              required
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#fbf6ee] dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs p-3.5 rounded-2xl border border-amber-100 dark:border-slate-700 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#486379] dark:text-sky-300 mb-1">Contraseña</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#fbf6ee] dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs p-3.5 rounded-2xl border border-amber-100 dark:border-slate-700 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#eca489] hover:bg-[#e49375] text-white font-bold text-xs rounded-full shadow-md cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          ¿No tienes una cuenta?{' '}
          <button onClick={() => navigateTo('register')} className="font-bold text-[#eca489] hover:underline cursor-pointer">
            Regístrate aquí
          </button>
        </div>
      </div>
    </div>
  );
}

export function RegisterView({ navigateTo }: AuthProps) {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-sky-100 dark:border-slate-800 text-center space-y-4 transition-colors">
        <span className="text-4xl block">📜</span>
        <h2 className="text-2xl font-black text-[#486379] dark:text-sky-300">Crear Cuenta</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Registro de nuevos miembros e invitados.</p>

        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl text-xs text-amber-800 dark:text-amber-300 border border-transparent dark:border-amber-900/40">
          Actualmente los nuevos registros son procesados por Secretaría de Iglesia.
        </div>

        <button
          onClick={() => navigateTo('login')}
          className="w-full py-3 bg-[#486379] dark:bg-sky-700 text-white font-bold text-xs rounded-full shadow-md cursor-pointer"
        >
          Ir a Iniciar Sesión
        </button>
      </div>
    </div>
  );
}