"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface PlayAgainButtonProps {
  onReset: () => void;
}

export default function PlayAgainButton({ onReset }: PlayAgainButtonProps) {
  return (
    <Button onClick={onReset} size="lg" className="w-full text-lg h-14">
      <RefreshCw className="mr-2 h-5 w-5" /> Play Again
    </Button>
  );
}
