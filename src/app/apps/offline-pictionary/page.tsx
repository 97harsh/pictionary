
'use client';
import GameController from '@/components/game/GameController';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePictionaryPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md mx-auto relative">
        <Link href="/" passHref>
          <Button variant="outline" className="absolute -top-14 left-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Hub
          </Button>
        </Link>
        <GameController />
      </div>
    </main>
  );
}
