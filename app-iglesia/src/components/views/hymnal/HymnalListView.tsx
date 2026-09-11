'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { HimnoDetail } from '@/types';
import { Search, Music, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/db';

export function HymnalListView() {
  const [search, setSearch] = useState('');
  const [hymns, setHymns] = useState<HimnoDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const syncAndLoad = async () => {
      setLoading(true);
      try {
        // 1. Try to load from local DB first
        const localHymns = await db.hymns.toArray();
        if (localHymns.length > 0) {
          setHymns(localHymns);
        }

        // 2. In background, sync with API to keep it updated
        const data = await apiClient.searchHimnos(search);
        const apiHymns = Array.isArray(data) ? data : [];

        if (apiHymns.length > 0) {
          // Bulk add/update to local DB
          await db.transaction('rw', db.hymns, async () => {
            for (const h of apiHymns) {
              await db.hymns.put(h as import('@/lib/db').LocalHymn);
            }
          });
          setHymns(apiHymns);
        }
      } catch (err) {
        console.error('Error syncing hymns:', err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(syncAndLoad, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 antialiased">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="bg-[#E8F0EA] text-[#546E5C] dark:bg-emerald-950/50 dark:text-emerald-300 text-[11px] font-bold px-3 py-1 rounded-full border border-[#7C9885]/30">
          Alabanza y Adoración
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#2D3831] dark:text-emerald-100 flex items-center justify-center gap-2">
          <Music className="w-6 h-6 text-[#7C9885]" /> Himnario Adventista
        </h2>
        <p className="text-xs sm:text-sm text-[#66756C] dark:text-slate-400">
          Busca por número o título del himno
        </p>
      </div>

      <div className="relative max-w-md mx-auto">
        <Search className="w-4 h-4 text-[#7C9885] absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Escribe el número o título (ej. 250 o Grande es tu fidelidad)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#FAF8F3] dark:bg-slate-900 text-xs pl-11 pr-5 py-3.5 rounded-full border border-[#E2DEC9] dark:border-slate-800 text-[#2D3831] dark:text-slate-100 shadow-xs outline-none focus:border-[#7C9885] transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-2 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
          {loading ? (
            <div className="flex justify-center items-center py-10 text-[#7C9885] text-xs font-semibold gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Buscando himnos...
            </div>
          ) : hymns.length === 0 ? (
            <p className="text-xs text-[#66756C] dark:text-slate-400 text-center py-8">
              No se encontraron himnos.
            </p>
          ) : (
            hymns.map((h) => (
              <div
                key={h.number}
                onClick={() => router.push(`/himnario/${h.number}`)}
                className="p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex items-center space-x-3 bg-[#FAF8F3] dark:bg-slate-900 border-[#E2DEC9] dark:border-slate-800 text-[#2D3831] dark:text-slate-200 hover:bg-[#E8F0EA] dark:hover:bg-slate-800"
              >
                <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-[#E8F0EA] dark:bg-slate-800 text-[#546E5C] dark:text-emerald-300">
                  #{h.number}
                </span>
                <span className="text-xs font-medium line-clamp-1">{h.title}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
