import { notFound } from 'next/navigation';
import BibleReader from '@/components/views/bible/BibleReader';
import BibleSelector from '@/components/views/bible/BibleSelector';

async function getVerses(libro: string, capitulo: string, version: string = 'RVR1960') {
  try {
    // We fetch from our own API which already has the 30-day revalidate cache
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/biblia?libro=${encodeURIComponent(libro)}&capitulo=${capitulo}&version=${version}`, {
      next: { revalidate: 2592000 }, // 30 days
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.verses;
  } catch (error) {
    console.error('Error fetching verses:', error);
    return null;
  }
}

export default async function BibleChapterPage({
  params,
  searchParams
}: {
  params: Promise<{ libro: string, capitulo: string }>,
  searchParams: Promise<{ version?: string }>
}) {
  const { libro, capitulo } = await params;
  const { version = 'RVR1960' } = await searchParams;

  const verses = await getVerses(libro, capitulo, version);

  if (!verses || verses.length === 0) {
    notFound();
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 antialiased text-[#2D3831] dark:text-slate-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4">
          <BibleSelector currentBook={libro} currentChapter={parseInt(capitulo)} />
        </div>
        <div className="lg:col-span-8">
          <BibleReader
            libro={libro}
            capitulo={parseInt(capitulo)}
            verses={verses}
            version={version}
          />
        </div>
      </div>
    </div>
  );
}