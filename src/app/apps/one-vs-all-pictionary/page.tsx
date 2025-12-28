'use client';
import OneVsAllGameController from './components/OneVsAllGameController';

export default function OneVsAllPictionaryPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-2xl mx-auto relative">
        <OneVsAllGameController />
      </div>
    </main>
  );
}
