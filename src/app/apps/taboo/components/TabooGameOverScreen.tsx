"use client";

import React from 'react';
import type { TabooGameState } from '../hooks/useTabooGameEngine';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trophy } from 'lucide-react';
import Scoreboard from '@/components/game/Scoreboard';
import Confetti from '@/components/game/Confetti';

type TabooGameOverScreenProps = {
  gameState: TabooGameState;
  dispatch: React.Dispatch<any>;
};

export default function TabooGameOverScreen({ gameState, dispatch }: TabooGameOverScreenProps) {
  const winner = gameState.teams.reduce((prev, current) => {
    // First compare rounds won, then score as tiebreaker
    if (current.roundsWon > prev.roundsWon) return current;
    if (current.roundsWon === prev.roundsWon && current.score > prev.score) return current;
    return prev;
  });

  return (
    <div className="text-center space-y-8">
        <Confetti />
        <div className="space-y-2">
            <Trophy className="mx-auto h-16 w-16 text-yellow-400" />
            <h2 className="text-4xl font-bold">Game Over!</h2>
            <p className="text-2xl text-primary">{winner.name} wins!</p>
            <p className="text-lg text-muted-foreground">
              {winner.roundsWon} Round{winner.roundsWon !== 1 ? 's' : ''} Won | {winner.score} Points
            </p>
        </div>

        <div className="pt-4">
            <h3 className="text-xl font-semibold mb-4">Final Standings</h3>
            <Scoreboard teams={gameState.teams} />
        </div>

      <Button onClick={() => dispatch({ type: 'RESET_GAME' })} size="lg" className="w-full text-lg h-14">
        <RefreshCw className="mr-2 h-5 w-5" /> Play Again
      </Button>
    </div>
  );
}
