"use client";

import React from 'react';
import type { GameState } from '@/hooks/useGameEngine';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trophy } from 'lucide-react';
import Scoreboard from './Scoreboard';
import Confetti from './Confetti';

type GameOverScreenProps = {
  gameState: GameState;
  dispatch: React.Dispatch<any>;
};

export default function GameOverScreen({ gameState, dispatch }: GameOverScreenProps) {
  const winner = gameState.teams.reduce((prev, current) => (prev.score > current.score) ? prev : current);

  return (
    <div className="text-center space-y-8">
        <Confetti />
        <div className="space-y-2">
            <Trophy className="mx-auto h-16 w-16 text-yellow-400" />
            <h2 className="text-4xl font-bold">Game Over!</h2>
            <p className="text-2xl text-primary">{winner.name} wins the game!</p>
        </div>

        <div className="pt-4">
            <h3 className="text-xl font-semibold mb-4">Final Scores</h3>
            <Scoreboard teams={gameState.teams} />
        </div>

      <Button onClick={() => dispatch({ type: 'RESET_GAME' })} size="lg" className="w-full text-lg">
        <RefreshCw className="mr-2 h-5 w-5" /> Play Again
      </Button>
    </div>
  );
}
