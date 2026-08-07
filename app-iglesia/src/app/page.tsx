import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 bg-indigo-900 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500 rounded-full flex items-center justify-center font-bold text-indigo-950 text-xl">
              ✝
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">IASD Central Hualqui</h1>
              <p className="text-xs text-indigo-200">Iglesia Adventista del Séptimo Día</p>
            </div>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="#inicio" className="hover:text-amber-400 transition-colors">Inicio</Link>
            <Link href="#horarios" className="hover:text-amber-400 transition-colors">Horarios</Link>
            <Link href="#anuncios" className="hover:text-amber-400 transition-colors">Anuncios</Link>
            <Link href="#recursos" className="hover:text-amber-400 transition-colors">Recursos</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="bg-gradient-to-b from-indigo-900 to-indigo-800 text-white py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
          <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full border border-amber-400/30">
            Bienvenidos a nuestra comunidad
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Un lugar de fe, esperanza y comunión
          </h2>
          <p className="text-indigo-100 text-base md:text-lg max-w-xl">
            Te invitamos a adorar juntos y compartir la palabra de Dios en la Iglesia Adventista del Séptimo Día Central Hualqui.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <a
              href="#horarios"
              className="bg-amber-500 hover:bg-amber-400 text-indigo-950 font-semibold px-6 py-3 rounded-lg transition-colors shadow-lg"
            >
              Ver Horarios de Cúltos
            </a>
            <a
              href="#anuncios"
              className="bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-lg backdrop-blur-sm border border-white/20 transition-colors"
            >
              Últimos Anuncios
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16 flex flex-col gap-16">
        {/* Horarios de Culto */}
        <section id="horarios">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-indigo-950">Nuestros Horarios</h3>
            <p className="text-slate-600 text-sm mt-1">Reuniones semanales en nuestro templo</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
              <span className="text-amber-600 font-semibold text-sm">Sábado por la Mañana</span>
              <h4 className="text-lg font-bold text-slate-900">Escuela Sabática</h4>
              <p className="text-2xl font-extrabold text-indigo-900">09:30 AM</p>
              <p className="text-xs text-slate-500 mt-2">Estudio de la Biblia en clases por edades.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-md ring-2 ring-indigo-900/5 flex flex-col gap-2">
              <span className="text-amber-600 font-semibold text-sm">Sábado por la Mañana</span>
              <h4 className="text-lg font-bold text-slate-900">Culto de Adoración</h4>
              <p className="text-2xl font-extrabold text-indigo-900">11:00 AM</p>
              <p className="text-xs text-slate-500 mt-2">Sermón principal, alabanzas y momentos de oración.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
              <span className="text-amber-600 font-semibold text-sm">Miércoles por la Noche</span>
              <h4 className="text-lg font-bold text-slate-900">Culto de Oración</h4>
              <p className="text-2xl font-extrabold text-indigo-900">19:30 PM</p>
              <p className="text-xs text-slate-500 mt-2">Reunión a mitad de semana para fortalecer la fe.</p>
            </div>
          </div>
        </section>

        {/* Informaciones y Anuncios */}
        <section id="anuncios" className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-indigo-950 mb-4">Avisos de la Semana</h3>
          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex items-start gap-3 border-b border-slate-100 pb-3">
              <span className="text-amber-500 font-bold">•</span>
              <div>
                <strong>Reunión de Jóvenes (JA):</strong> Este sábado a las 18:00 hrs.
              </div>
            </li>
            <li className="flex items-start gap-3 border-b border-slate-100 pb-3">
              <span className="text-amber-500 font-bold">•</span>
              <div>
                <strong>Club de Conquistadores:</strong> Domingos a las 10:00 AM en la iglesia.
              </div>
            </li>
          </ul>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-6 text-center text-xs border-t border-slate-800">
        <p>© {new Date().getFullYear()} Iglesia Adventista del Séptimo Día Central Hualqui.</p>
      </footer>
    </div>
  );
}