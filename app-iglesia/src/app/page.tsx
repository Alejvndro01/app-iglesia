import React from 'react';
import { HomeView } from '@/components/views/HomeView';

export default function MainPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-700 dark:text-slate-200 flex flex-col relative transition-colors duration-300">
      <HomeView />
    </div>
  );
}
