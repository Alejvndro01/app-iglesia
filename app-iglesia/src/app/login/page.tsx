'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      window.location.href = '/dashboard';
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error desconocido');
      }
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-0 md:p-6 font-sans select-none">
      
      {/* App Container Card */}
      <div className="w-full max-w-5xl h-screen md:h-[90vh] max-h-[820px] bg-[#d0e2f1] rounded-none md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">

        {/* ==================== LEFT PANEL: LANDSCAPE IMAGE ==================== */}
        <div className="relative w-full md:w-1/2 h-64 md:h-full flex-shrink-0 overflow-hidden">
          {/* Imagen cargada desde la carpeta /public/landscape.jpg */}
          <img
            src="/landscape.jpg"
            alt="Paisaje IASD Central de Hualqui"
            onError={(e) => {
              // Imagen de reemplazo si no encuentra /landscape.jpg
              (e.target as HTMLImageElement).src =
                'https://placehold.co/800x1000/f8c3d9/50687c?text=Coloca+landscape.jpg+en+/public';
            }}
            className="w-full h-full object-cover absolute inset-0"
          />

          {/* Curva divisoria orgánica suave entre el panel izquierdo y derecho */}
          <div className="hidden md:block absolute top-0 bottom-0 right-0 w-24 h-full pointer-events-none">
            <svg
              className="w-full h-full text-[#d0e2f1] fill-current"
              preserveAspectRatio="none"
              viewBox="0 0 100 800"
            >
              <path d="M 100,0 C 20,180 80,320 15,480 C -20,620 60,720 100,800 L 100,800 L 100,0 Z" />
            </svg>
          </div>
        </div>

        {/* ==================== RIGHT PANEL: LOGIN FORM ==================== */}
        <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-center px-8 py-10 md:px-12 lg:px-16 z-10 overflow-y-auto">
          
          {/* Header Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#50687c] tracking-wider leading-tight">
              IASD CENTRAL
            </h1>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#50687c] tracking-wide mt-1">
              DE HUALQUI
            </h2>
            <p className="text-2xl sm:text-3xl font-medium text-white tracking-wide mt-5 drop-shadow-sm">
              Iniciar Sesión
            </p>
          </div>

          {/* Form Container */}
          <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
            
            {/* Error Message Alert */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-xl text-red-700 text-sm font-medium animate-fade-in">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm sm:text-base font-semibold text-[#50687c] px-2"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#fbf6ee] text-[#334155] rounded-full px-6 py-3.5 sm:py-4 outline-none border border-amber-100/60 shadow-inner text-base font-medium transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-[#eca489]"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-sm sm:text-base font-semibold text-[#50687c] px-2"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#fbf6ee] text-[#334155] rounded-full px-6 py-3.5 sm:py-4 outline-none border border-amber-100/60 shadow-inner text-base font-medium transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-[#eca489]"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#eca489] hover:bg-[#e49375] active:scale-[0.98] text-white font-bold rounded-full py-3.5 sm:py-4 text-lg tracking-wide shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-75 flex items-center justify-center"
              >
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Ingresando...</span>
                  </span>
                ) : (
                  'Entrar'
                )}
              </button>
            </div>
          </form>



        </div>

      </div>
    </div>
  );
}