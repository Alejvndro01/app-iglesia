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

  const handleSocialAuth = (provider: string) => {
    // Puedes conectar aquí con NextAuth o la API correspondiente
    console.log(`Iniciando sesión con ${provider}`);
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

          {/* Social Auth Icons Section */}
          <div className="mt-8">
            <div className="flex items-center justify-center space-x-4 sm:space-x-5">
              
              {/* Google Auth Button */}
              <button
                type="button"
                onClick={() => handleSocialAuth('Google')}
                title="Iniciar sesión con Google"
                className="w-16 h-12 sm:w-20 sm:h-14 bg-[#fbf6ee] hover:bg-white rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-sm hover:shadow transition-all duration-200 active:scale-95 border border-amber-100/50"
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 48 48">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
              </button>

              {/* Facebook Auth Button */}
              <button
                type="button"
                onClick={() => handleSocialAuth('Facebook')}
                title="Iniciar sesión con Facebook"
                className="w-16 h-12 sm:w-20 sm:h-14 bg-[#2176f2] hover:bg-[#1b6cd9] rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-sm hover:shadow transition-all duration-200 active:scale-95"
              >
                <svg
                  className="w-6 h-6 sm:w-7 sm:h-7 fill-white"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>

              {/* X Auth Button */}
              <button
                type="button"
                onClick={() => handleSocialAuth('X')}
                title="Iniciar sesión con X"
                className="w-16 h-12 sm:w-20 sm:h-14 bg-[#393b3e] hover:bg-[#28292b] rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-sm hover:shadow transition-all duration-200 active:scale-95"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 fill-white"
                  viewBox="0 0 1200 1227"
                >
                  <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.694H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" />
                </svg>
              </button>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}