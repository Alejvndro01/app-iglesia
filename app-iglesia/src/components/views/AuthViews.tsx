'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { 
  Church, 
  UserPlus, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ArrowLeft, 
  Check, 
  Circle,
  Loader2
} from 'lucide-react';

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
    <div className="min-h-[75vh] flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-md bg-[#FAF8F3] dark:bg-slate-900 rounded-3xl shadow-xs p-6 sm:p-8 border border-[#E2DEC9] dark:border-slate-800 transition-colors">
        <div className="text-center mb-6 space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F0EA] dark:bg-slate-800 flex items-center justify-center mx-auto text-[#7C9885] dark:text-emerald-400">
            <Church className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#2D3831] dark:text-emerald-100 pt-2">Iniciar Sesión</h2>
          <p className="text-xs text-[#66756C] dark:text-slate-400">IASD Central Hualqui</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#2D3831] dark:text-slate-200 mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#7C9885] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 pl-10 pr-3.5 py-3 rounded-xl border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-100 outline-none focus:border-[#7C9885] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#2D3831] dark:text-slate-200 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#7C9885] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white dark:bg-slate-950 pl-10 pr-3.5 py-3 rounded-xl border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-100 outline-none focus:border-[#7C9885] transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigateTo('forgot-password')}
              className="text-[11px] font-semibold text-[#7C9885] hover:underline cursor-pointer"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#7C9885] hover:bg-[#6B8774] text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? 'Ingresando...' : 'Entrar'}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E8E4D5] dark:border-slate-800" />
          </div>
          <span className="relative bg-[#FAF8F3] dark:bg-slate-900 px-3 text-[10px] uppercase tracking-wider text-[#8C9B90] dark:text-slate-500 font-semibold">
            o
          </span>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full py-3 px-4 bg-white dark:bg-slate-950 text-[#2D3831] dark:text-slate-200 border border-[#DCD7C5] dark:border-slate-800 font-semibold text-xs rounded-xl shadow-xs hover:bg-[#E8F0EA] dark:hover:bg-slate-800 flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Continuar con Google
        </button>

        <div className="mt-6 text-center text-xs text-[#66756C] dark:text-slate-400">
          ¿No tienes una cuenta?{' '}
          <button
            onClick={() => navigateTo('register')}
            className="font-bold text-[#7C9885] hover:underline cursor-pointer"
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

  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otpCode, setOtpCode] = useState('');

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
    <div className="min-h-[75vh] flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-md bg-[#FAF8F3] dark:bg-slate-900 rounded-3xl shadow-xs p-6 sm:p-8 border border-[#E2DEC9] dark:border-slate-800 transition-colors">
        <div className="text-center mb-6 space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F0EA] dark:bg-slate-800 flex items-center justify-center mx-auto text-[#7C9885] dark:text-emerald-400">
            {step === 'form' ? <UserPlus className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <h2 className="text-xl font-bold text-[#2D3831] dark:text-emerald-100 pt-2">
            {step === 'form' ? 'Crear Cuenta' : 'Verifica tu Correo'}
          </h2>
          <p className="text-xs text-[#66756C] dark:text-slate-400">
            {step === 'form'
              ? 'Registro de nuevos miembros e invitados.'
              : `Ingresa el código de 6 dígitos enviado a ${email}`}
          </p>
        </div>

        {step === 'form' ? (
          <>
            <form onSubmit={handleRequestOTP} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#2D3831] dark:text-slate-200 mb-1">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#7C9885] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Juan Pérez"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 pl-10 pr-3.5 py-3 rounded-xl border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-100 outline-none focus:border-[#7C9885]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#2D3831] dark:text-slate-200 mb-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#7C9885] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 pl-10 pr-3.5 py-3 rounded-xl border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-100 outline-none focus:border-[#7C9885]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#2D3831] dark:text-slate-200 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#7C9885] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 pl-10 pr-10 py-3 rounded-xl border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-100 outline-none focus:border-[#7C9885]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C9B90] hover:text-[#2D3831] cursor-pointer"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#2D3831] dark:text-slate-200 mb-1">
                  Repetir Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#7C9885] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 pl-10 pr-3.5 py-3 rounded-xl border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-100 outline-none focus:border-[#7C9885]"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#E8F0EA]/60 dark:bg-slate-800/50 rounded-xl space-y-1 text-[11px] border border-[#C5D8CC]/50 dark:border-slate-700/50">
                <p className={`flex items-center gap-1.5 ${checks.length ? 'text-[#546E5C] dark:text-emerald-400 font-bold' : 'text-[#8C9B90]'}`}>
                  {checks.length ? <Check className="w-3.5 h-3.5" /> : <Circle className="w-3 h-3" />} Mínimo 8 caracteres
                </p>
                <p className={`flex items-center gap-1.5 ${checks.capital ? 'text-[#546E5C] dark:text-emerald-400 font-bold' : 'text-[#8C9B90]'}`}>
                  {checks.capital ? <Check className="w-3.5 h-3.5" /> : <Circle className="w-3 h-3" />} Una letra mayúscula
                </p>
                <p className={`flex items-center gap-1.5 ${checks.number ? 'text-[#546E5C] dark:text-emerald-400 font-bold' : 'text-[#8C9B90]'}`}>
                  {checks.number ? <Check className="w-3.5 h-3.5" /> : <Circle className="w-3 h-3" />} Un número
                </p>
                <p className={`flex items-center gap-1.5 ${checks.match ? 'text-[#546E5C] dark:text-emerald-400 font-bold' : 'text-[#8C9B90]'}`}>
                  {checks.match ? <Check className="w-3.5 h-3.5" /> : <Circle className="w-3 h-3" />} Las contraseñas coinciden
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !isPasswordValid}
                className="w-full py-3 bg-[#7C9885] hover:bg-[#6B8774] text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Enviando código...' : 'Continuar →'}
              </button>
            </form>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E8E4D5] dark:border-slate-800" />
              </div>
              <span className="relative bg-[#FAF8F3] dark:bg-slate-900 px-3 text-[10px] uppercase tracking-wider text-[#8C9B90] dark:text-slate-500 font-semibold">
                o
              </span>
            </div>

            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full py-3 px-4 bg-white dark:bg-slate-950 text-[#2D3831] dark:text-slate-200 border border-[#DCD7C5] dark:border-slate-800 font-semibold text-xs rounded-xl shadow-xs hover:bg-[#E8F0EA] dark:hover:bg-slate-800 flex items-center justify-center gap-2 cursor-pointer transition-colors"
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
          <form onSubmit={handleVerifyOTP} className="space-y-4 text-center text-xs">
            <div>
              <label className="block font-semibold text-[#2D3831] dark:text-slate-200 mb-2">
                Código de Confirmación
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full text-center tracking-[10px] text-xl font-mono font-bold p-3 bg-white dark:bg-slate-950 text-[#2D3831] dark:text-slate-100 rounded-xl border border-[#DCD7C5] dark:border-slate-700 outline-none focus:border-[#7C9885]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#7C9885] hover:bg-[#6B8774] text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Verificando...' : 'Verificar y Crear Cuenta'}
            </button>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="text-xs text-[#7C9885] hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Cambiar correo o datos
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-[#66756C] dark:text-slate-400">
          ¿Ya tienes cuenta?{' '}
          <button
            onClick={() => navigateTo('login')}
            className="font-bold text-[#7C9885] hover:underline cursor-pointer"
          >
            Inicia sesión aquí
          </button>
        </div>
      </div>
    </div>
  );
}

export function ForgotPasswordView({ navigateTo, showToast }: Omit<AuthProps, 'setUserRole'>) {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const checks = {
    length: newPassword.length >= 8,
    capital: /[A-Z]/.test(newPassword),
    number: /\d/.test(newPassword),
    match: newPassword.length > 0 && newPassword === confirmPassword,
  };

  const isPasswordValid = Object.values(checks).every(Boolean);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || 'Error al solicitar el código');
        return;
      }

      showToast('📩 Código de recuperación enviado a tu correo.');
      setStep('reset');
    } catch {
      showToast('Error de conexión al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otpCode.length < 6) {
      showToast('Ingresa el código completo de 6 dígitos.');
      return;
    }

    if (!isPasswordValid) {
      showToast('Cumple con todos los requisitos de la nueva contraseña.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          code: otpCode,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || 'Error al cambiar la contraseña');
        return;
      }

      showToast('🎉 Contraseña actualizada correctamente. Inicia sesión.');
      navigateTo('login');
    } catch {
      showToast('Error de conexión al restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-md bg-[#FAF8F3] dark:bg-slate-900 rounded-3xl shadow-xs p-6 sm:p-8 border border-[#E2DEC9] dark:border-slate-800 transition-colors">
        <div className="text-center mb-6 space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F0EA] dark:bg-slate-800 flex items-center justify-center mx-auto text-[#7C9885] dark:text-emerald-400">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#2D3831] dark:text-emerald-100 pt-2">
            Recuperar Contraseña
          </h2>
          <p className="text-xs text-[#66756C] dark:text-slate-400">
            {step === 'request'
              ? 'Ingresa tu correo para recibir un código de recuperación.'
              : `Ingresa el código enviado a ${email} y tu nueva clave.`}
          </p>
        </div>

        {step === 'request' ? (
          <form onSubmit={handleRequestReset} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#2D3831] dark:text-slate-200 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#7C9885] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="ejemplo@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 pl-10 pr-3.5 py-3 rounded-xl border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-100 outline-none focus:border-[#7C9885]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#7C9885] hover:bg-[#6B8774] text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Enviando código...' : 'Enviar Código →'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#2D3831] dark:text-slate-200 mb-2 text-center">
                Código de Confirmación (6 dígitos)
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full text-center tracking-[10px] text-xl font-mono font-bold p-3 bg-white dark:bg-slate-950 text-[#2D3831] dark:text-slate-100 rounded-xl border border-[#DCD7C5] dark:border-slate-700 outline-none focus:border-[#7C9885]"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-[#2D3831] dark:text-slate-200 mb-1">
                Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7C9885] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 pl-10 pr-10 py-3 rounded-xl border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-100 outline-none focus:border-[#7C9885]"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C9B90] hover:text-[#2D3831] cursor-pointer"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-[#2D3831] dark:text-slate-200 mb-1">
                Repetir Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#7C9885] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white dark:bg-slate-950 pl-10 pr-3.5 py-3 rounded-xl border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-100 outline-none focus:border-[#7C9885]"
                />
              </div>
            </div>

            <div className="p-3 bg-[#E8F0EA]/60 dark:bg-slate-800/50 rounded-xl space-y-1 text-[11px] border border-[#C5D8CC]/50 dark:border-slate-700/50">
              <p className={`flex items-center gap-1.5 ${checks.length ? 'text-[#546E5C] dark:text-emerald-400 font-bold' : 'text-[#8C9B90]'}`}>
                {checks.length ? <Check className="w-3.5 h-3.5" /> : <Circle className="w-3 h-3" />} Mínimo 8 caracteres
              </p>
              <p className={`flex items-center gap-1.5 ${checks.capital ? 'text-[#546E5C] dark:text-emerald-400 font-bold' : 'text-[#8C9B90]'}`}>
                {checks.capital ? <Check className="w-3.5 h-3.5" /> : <Circle className="w-3 h-3" />} Una letra mayúscula
              </p>
              <p className={`flex items-center gap-1.5 ${checks.number ? 'text-[#546E5C] dark:text-emerald-400 font-bold' : 'text-[#8C9B90]'}`}>
                {checks.number ? <Check className="w-3.5 h-3.5" /> : <Circle className="w-3 h-3" />} Un número
              </p>
              <p className={`flex items-center gap-1.5 ${checks.match ? 'text-[#546E5C] dark:text-emerald-400 font-bold' : 'text-[#8C9B90]'}`}>
                {checks.match ? <Check className="w-3.5 h-3.5" /> : <Circle className="w-3 h-3" />} Las contraseñas coinciden
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !isPasswordValid}
              className="w-full py-3 bg-[#7C9885] hover:bg-[#6B8774] text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Cambiando clave...' : 'Cambiar Contraseña'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-[#66756C] dark:text-slate-400">
          <button
            onClick={() => navigateTo('login')}
            className="font-bold text-[#7C9885] hover:underline cursor-pointer inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver al inicio de sesión
          </button>
        </div>
      </div>
    </div>
  );
}