"use client";

import React from 'react';
import type { OneVsAllGameState } from '../hooks/useOneVsAllGameEngine';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trophy } from 'lucide-react';
import Scoreboard from '@/components/game/Scoreboard';
import Confetti from '@/components/game/Confetti';

type OneVsAllGameOverScreenProps = {
  gameState: OneVsAllGameState;
  dispatch: React.Dispatch<any>;
};

export default function OneVsAllGameOverScreen({ gameState, dispatch }: OneVsAllGameOverScreenProps) {
  const winner = gameState.players.reduce((prev, current) => (prev.score > current.score) ? prev : current);

  return (
    <div className="text-center space-y-8">
        <Confetti />
        <div className="space-y-2">
            <Trophy className="mx-auto h-16 w-16 text-yellow-400" />
            <h2 className="text-4xl font-bold">Game Over!</h2>
            <p className="text-2xl text-primary">{winner.name} wins the game!</p>
            <p className="text-lg text-muted-foreground">Final Score: {winner.score} points</p>
        </div>

        <div className="pt-4">
            <h3 className="text-xl font-semibold mb-4">Final Scores</h3>
            <Scoreboard teams={gameState.players} />
        </div>

      <Button onClick={() => dispatch({ type: 'RESET_GAME' })} size="lg" className="w-full text-lg">
        <RefreshCw className="mr-2 h-5 w-5" /> Play Again
      </Button>
    </div>
  );
}
