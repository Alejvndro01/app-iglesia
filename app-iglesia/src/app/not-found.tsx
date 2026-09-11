import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <div className="text-8xl font-serif font-bold text-[#7C9885] dark:text-emerald-400">404</div>
        <h1 className="text-2xl font-bold text-[#2D3831] dark:text-emerald-100">Página no encontrada</h1>
        <p className="text-sm text-[#66756C] dark:text-slate-400 max-w-md mx-auto">
          Parece que esta página no existe o fue movida. ¡Te invitamos a volver al inicio!
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#7C9885] hover:bg-[#6B8774] text-white font-semibold text-sm rounded-xl shadow-xs transition-colors"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}
