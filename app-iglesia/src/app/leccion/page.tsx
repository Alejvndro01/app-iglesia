import { notFound } from 'next/navigation';
import { SabbathLessonPageView } from '@/components/views/SabbathLessonPageView';

async function getActualLesson() {
  try {
    // Use the internal API route for consistency
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/leccion/actual`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error fetching lesson on server:', error);
    return null;
  }
}

export default async function LeccionPage() {
  const lessonData = await getActualLesson();

  if (!lessonData || lessonData.error) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <SabbathLessonPageView initialData={lessonData} />
    </div>
  );
}
