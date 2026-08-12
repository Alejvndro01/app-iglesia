'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';

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
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        showToast('Credenciales inválidas');
      } else {
        showToast('¡Bienvenido de nuevo!');
        setUserRole('USER');
        navigateTo('home');
      }
    } catch {
      showToast('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn('google', { redirectTo: '/' });
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
            <label className="block text-xs font-bold text-[#486379] dark:text-sky-300 mb-1">
              Correo Electrónico
            </label>
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
            <label className="block text-xs font-bold text-[#486379] dark:text-sky-300 mb-1">
              Contraseña
            </label>
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
            className="w-full py-3.5 bg-[#eca489] hover:bg-[#e49375] text-white font-bold text-xs rounded-full shadow-md cursor-pointer disabled:opacity-50 transition-colors"
          >
            {loading ? 'Ingresando...' : 'Entrar'}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
          </div>
          <span className="relative bg-white dark:bg-slate-900 px-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            o
          </span>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full py-3 px-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs rounded-full shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/80 flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Continuar con Google
        </button>

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          ¿No tienes una cuenta?{' '}
          <button
            onClick={() => navigateTo('register')}
            className="font-bold text-[#eca489] hover:underline cursor-pointer"
          >
            Regístrate aquí
          </button>
        </div>
      </div>
    </div>
  );
}

export function RegisterView({ navigateTo, showToast }: Omit<AuthProps, 'setUserRole'>) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados para el flujo OTP
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otpCode, setOtpCode] = useState('');

  // Validaciones en tiempo real (sin requerir carácter especial)
  const checks = {
    length: password.length >= 8,
    capital: /[A-Z]/.test(password),
    number: /\d/.test(password),
    match: password.length > 0 && password === confirmPassword,
  };

  const isPasswordValid = Object.values(checks).every(Boolean);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      showToast('Por favor cumple todos los requisitos de la contraseña.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || 'Error al enviar el código de verificación');
        return;
      }

      showToast('📩 Código de 6 dígitos enviado a tu correo.');
      setStep('otp');
    } catch {
      showToast('Error de conexión al enviar el código');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otpCode.length < 6) {
      showToast('Ingresa el código completo de 6 dígitos.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code: otpCode,
          name: nombre,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || 'El código es inválido o ha expirado.');
        return;
      }

      showToast('🎉 ¡Cuenta verificada y creada con éxito! Inicia sesión.');
      navigateTo('login');
    } catch {
      showToast('Error de conexión al verificar el código');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn('google', { redirectTo: '/' });
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 border border-sky-100 dark:border-slate-800 transition-colors">
        <div className="text-center mb-6">
          <span className="text-4xl block mb-2">{step === 'form' ? '📜' : '🔒'}</span>
          <h2 className="text-2xl font-black text-[#486379] dark:text-sky-300">
            {step === 'form' ? 'Crear Cuenta' : 'Verifica tu Correo'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {step === 'form'
              ? 'Registro de nuevos miembros e invitados.'
              : `Ingresa el código de 6 dígitos enviado a ${email}`}
          </p>
        </div>

        {step === 'form' ? (
          <>
            <form onSubmit={handleRequestOTP} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#486379] dark:text-sky-300 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Juan Pérez"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full bg-[#fbf6ee] dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs p-3.5 rounded-2xl border border-amber-100 dark:border-slate-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#486379] dark:text-sky-300 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#fbf6ee] dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs p-3.5 rounded-2xl border border-amber-100 dark:border-slate-700 outline-none"
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-xs font-bold text-[#486379] dark:text-sky-300 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#fbf6ee] dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs p-3.5 pr-10 rounded-2xl border border-amber-100 dark:border-slate-700 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPass ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>

              {/* Repetir Contraseña */}
              <div>
                <label className="block text-xs font-bold text-[#486379] dark:text-sky-300 mb-1">
                  Repetir Contraseña
                </label>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#fbf6ee] dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs p-3.5 rounded-2xl border border-amber-100 dark:border-slate-700 outline-none"
                />
              </div>

              {/* Checklist de Fortaleza sin carácter especial */}
              <div className="p-3.5 bg-[#fbf6ee]/60 dark:bg-slate-800/50 rounded-2xl space-y-1.5 text-[11px] border border-amber-100/50 dark:border-slate-700/50">
                <p className={checks.length ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400'}>
                  {checks.length ? '✓' : '○'} Mínimo 8 caracteres
                </p>
                <p className={checks.capital ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400'}>
                  {checks.capital ? '✓' : '○'} Una letra mayúscula
                </p>
                <p className={checks.number ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400'}>
                  {checks.number ? '✓' : '○'} Un número
                </p>
                <p className={checks.match ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-400'}>
                  {checks.match ? '✓' : '○'} Las contraseñas coinciden
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !isPasswordValid}
                className="w-full py-3.5 bg-[#486379] hover:bg-[#385063] text-white font-bold text-xs rounded-full shadow-md cursor-pointer disabled:opacity-40 transition-colors"
              >
                {loading ? 'Enviando código...' : 'Continuar →'}
              </button>
            </form>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <span className="relative bg-white dark:bg-slate-900 px-3 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                o
              </span>
            </div>

            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full py-3 px-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs rounded-full shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/80 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Registrarse con Google
            </button>
          </>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4 text-center">
            <div>
              <label className="block text-xs font-bold text-[#486379] dark:text-sky-300 mb-2">
                Código de Confirmación
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full text-center tracking-[12px] text-2xl font-black p-3.5 bg-[#fbf6ee] dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl border border-amber-100 dark:border-slate-700 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#486379] hover:bg-[#385063] text-white font-bold text-xs rounded-full shadow-md cursor-pointer disabled:opacity-50 transition-colors"
            >
              {loading ? 'Verificando...' : 'Verificar y Crear Cuenta'}
            </button>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="text-xs text-[#eca489] hover:underline font-bold cursor-pointer"
              >
                ← Cambiar correo o datos
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          ¿Ya tienes cuenta?{' '}
          <button
            onClick={() => navigateTo('login')}
            className="font-bold text-[#eca489] hover:underline cursor-pointer"
          >
            Inicia sesión aquí
          </button>
        </div>
      </div>
    </div>
  );
}