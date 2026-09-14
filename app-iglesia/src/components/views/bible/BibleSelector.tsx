'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CANON_BOOKS = [
  { name: 'Génesis', testament: 'AT', chapters: 50 },
  { name: 'Éxodo', testament: 'AT', chapters: 40 },
  { name: 'Levítico', testament: 'AT', chapters: 27 },
  { name: 'Números', testament: 'AT', chapters: 36 },
  { name: 'Deuteronomio', testament: 'AT', chapters: 34 },
  { name: 'Josué', testament: 'AT', chapters: 24 },
  { name: 'Jueces', testament: 'AT', chapters: 21 },
  { name: 'Rut', testament: 'AT', chapters: 4 },
  { name: '1 Samuel', testament: 'AT', chapters: 31 },
  { name: '2 Samuel', testament: 'AT', chapters: 24 },
  { name: '1 Reyes', testament: 'AT', chapters: 22 },
  { name: '2 Reyes', testament: 'AT', chapters: 25 },
  { name: '1 Crónicas', testament: 'AT', chapters: 29 },
  { name: '2 Crónicas', testament: 'AT', chapters: 36 },
  { name: 'Esdras', testament: 'AT', chapters: 10 },
  { name: 'Nehemías', testament: 'AT', chapters: 13 },
  { name: 'Ester', testament: 'AT', chapters: 10 },
  { name: 'Job', testament: 'AT', chapters: 42 },
  { name: 'Salmos', testament: 'AT', chapters: 150 },
  { name: 'Proverbios', testament: 'AT', chapters: 31 },
  { name: 'Eclesiastés', testament: 'AT', chapters: 12 },
  { name: 'Cantares', testament: 'AT', chapters: 8 },
  { name: 'Isaías', testament: 'AT', chapters: 66 },
  { name: 'Jeremías', testament: 'AT', chapters: 52 },
  { name: 'Lamentaciones', testament: 'AT', chapters: 5 },
  { name: 'Ezequiel', testament: 'AT', chapters: 48 },
  { name: 'Daniel', testament: 'AT', chapters: 12 },
  { name: 'Oseas', testament: 'AT', chapters: 14 },
  { name: 'Joel', testament: 'AT', chapters: 3 },
  { name: 'Amós', testament: 'AT', chapters: 9 },
  { name: 'Abdías', testament: 'AT', chapters: 1 },
  { name: 'Jonás', testament: 'AT', chapters: 4 },
  { name: 'Miqueas', testament: 'AT', chapters: 7 },
  { name: 'Nahúm', testament: 'AT', chapters: 3 },
  { name: 'Habacuc', testament: 'AT', chapters: 3 },
  { name: 'Sofonías', testament: 'AT', chapters: 3 },
  { name: 'Hageo', testament: 'AT', chapters: 2 },
  { name: 'Zacarías', testament: 'AT', chapters: 14 },
  { name: 'Malaquías', testament: 'AT', chapters: 4 },
  { name: 'Mateo', testament: 'NT', chapters: 28 },
  { name: 'Marcos', testament: 'NT', chapters: 16 },
  { name: 'Lucas', testament: 'NT', chapters: 24 },
  { name: 'Juan', testament: 'NT', chapters: 21 },
  { name: 'Hechos', testament: 'NT', chapters: 28 },
  { name: 'Romanos', testament: 'NT', chapters: 16 },
  { name: '1 Corintios', testament: 'NT', chapters: 16 },
  { name: '2 Corintios', testament: 'NT', chapters: 13 },
  { name: 'Gálatas', testament: 'NT', chapters: 6 },
  { name: 'Efesios', testament: 'NT', chapters: 6 },
  { name: 'Filipenses', testament: 'NT', chapters: 4 },
  { name: 'Colosenses', testament: 'NT', chapters: 4 },
  { name: '1 Tesalonicenses', testament: 'NT', chapters: 5 },
  { name: '2 Tesalonicenses', testament: 'NT', chapters: 3 },
  { name: '1 Timoteo', testament: 'NT', chapters: 6 },
  { name: '2 Timoteo', testament: 'NT', chapters: 4 },
  { name: 'Tito', testament: 'NT', chapters: 3 },
  { name: 'Filemón', testament: 'NT', chapters: 1 },
  { name: 'Hebreos', testament: 'NT', chapters: 13 },
  { name: 'Santiago', testament: 'NT', chapters: 5 },
  { name: '1 Pedro', testament: 'NT', chapters: 5 },
  { name: '2 Pedro', testament: 'NT', chapters: 3 },
  { name: '1 Juan', testament: 'NT', chapters: 5 },
  { name: '2 Juan', testament: 'NT', chapters: 1 },
  { name: '3 Juan', testament: 'NT', chapters: 1 },
  { name: 'Judas', testament: 'NT', chapters: 1 },
  { name: 'Apocalipsis', testament: 'NT', chapters: 22 }
];

export default function BibleSelector({ currentBook, currentChapter }: { currentBook: string, currentChapter: number }) {
  const [selectedTestament, setSelectedTestament] = useState<'AT' | 'NT'>('NT');
  const [searchFilter, setSearchFilter] = useState('');
  const router = useRouter();

  const currentBookData = CANON_BOOKS.find((b) => b.name === currentBook) || CANON_BOOKS[42];

  const filteredBooks = CANON_BOOKS.filter(
    (b) =>
      b.testament === selectedTestament &&
      b.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleBookChange = (bookName: string) => {
    router.push(`/biblia/${bookName}/1`);
  };

  return (
    <div className="bg-[#FAF8F3] dark:bg-slate-900/70 border border-[#E2DEC9] dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-xs">
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#7C9885]" />
        <input
          type="text"
          placeholder="Buscar libro bíblico..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-[#DCD7C5] dark:border-slate-700 text-[#2D3831] dark:text-slate-200 focus:outline-none focus:border-[#7C9885]"
        />
      </div >

      <div className="flex gap-1 p-1 bg-[#E8F0EA] dark:bg-slate-800 rounded-xl border border-[#C5D8CC]/60 dark:border-slate-700 mb-4">
        <button
          onClick={() => setSelectedTestament('AT')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            selectedTestament === 'AT' ? 'bg-[#7C9885] text-white shadow-xs' : 'text-[#526157] dark:text-slate-300'
          }`}
        >
          AT (39)
        </button>
        <button
          onClick={() => setSelectedTestament('NT')}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            selectedTestament === 'NT' ? 'bg-[#7C9885] text-white shadow-xs' : 'text-[#526157] dark:text-slate-300'
          }`}
        >
          NT (27)
        </button>
      </div >

      <div className="grid grid-cols-2 gap-1.5 max-h-[260px] overflow-y-auto pr-1">
        {filteredBooks.map((b) => {
          const isSelected = currentBook === b.name;
          return (
            <button
              key={b.name}
              onClick={() => handleBookChange(b.name)}
              className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition-all cursor-pointer truncate ${
                isSelected
                  ? 'bg-[#7C9885] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 border border-[#E8E4D5] dark:border-slate-700/80 text-[#2D3831] dark:text-slate-200 hover:border-[#7C9885]'
              }`}
            >
              {b.name}
            </button>
          );
        })}
      </div >

      <div className="pt-3 border-t border-[#E8E4D5] dark:border-slate-700/80 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-[#66756C] dark:text-slate-400 uppercase">Capítulos</span>
          <span className="font-semibold text-[#7C9885] dark:text-emerald-400">{currentBookData.chapters} caps</span>
        </div >
        <div className="grid grid-cols-6 gap-1.5 max-h-[160px] overflow-y-auto pr-1">
          {Array.from({ length: currentBookData.chapters }, (_, i) => i + 1).map((cap) => {
            const isSelected = currentChapter === cap;
            return (
              <button
                key={cap}
                onClick={() => router.push(`/biblia/${currentBook}/${cap}`)}
                className={`h-8 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                  isSelected
                    ? 'bg-[#7C9885] text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 border border-[#E8E4D5] dark:border-slate-700/80 text-[#526157] dark:text-slate-300 hover:border-[#7C9885]'
                }`}
              >
                {cap}
              </button>
            );
          })}
        </div >
      </div >
    </div >
  );
}
