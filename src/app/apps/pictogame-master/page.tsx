
import GameController from '@/components/game/GameController';

export default function OfflinePictionaryPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 md:p-8 pt-8 sm:pt-12">
      <div className="w-full max-w-md mx-auto">
        <GameController />
      </div>
    </main>
  );
}
