"use client";

import React from 'react';
import { Trophy } from 'lucide-react';

export default function GameOverHeader() {
  return (
    <div className="space-y-2">
      <Trophy className="mx-auto h-16 w-16 text-yellow-400" />
      <h2 className="text-4xl font-bold">Game Over!</h2>
    </div>
  );
}
