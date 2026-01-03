"use client";

import { Button } from '@/components/ui/button';
import { useSound } from '@/hooks/useSound';
import { useHaptic } from '@/hooks/useHaptic';
import { AlertCircle } from 'lucide-react';

type TabooViolationButtonProps = {
  onViolation: () => void;
  disabled: boolean;
};

export default function TabooViolationButton({ onViolation, disabled }: TabooViolationButtonProps) {
  const haptic = useHaptic();
  const { play: playViolation } = useSound('/sounds/violation.wav', { volume: 0.6 });

  const handleViolation = () => {
    haptic.warning();
    playViolation();
    onViolation();
  };

  return (
    <Button
      onClick={handleViolation}
      variant="destructive"
      size="lg"
      className="w-full h-20 md:h-24 text-xl md:text-2xl font-bold border-4 border-red-500 animate-pulse shadow-lg"
      disabled={disabled}
    >
      <AlertCircle className="h-6 w-6 md:h-8 md:w-8 mr-2" />
      TABOO! BUZZER
      <AlertCircle className="h-6 w-6 md:h-8 md:w-8 ml-2" />
    </Button>
  );
}
