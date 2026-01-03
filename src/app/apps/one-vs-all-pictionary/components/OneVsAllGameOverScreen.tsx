"use client";

import React from 'react';
import type { OneVsAllGameState } from '../hooks/useOneVsAllGameEngine';
import Confetti from '@/components/game/Confetti';
import GameOverHeader from '@/components/game/GameOverHeader';
import WinnerAnnouncement from '@/components/game/WinnerAnnouncement';
import FinalStandings from '@/components/game/FinalStandings';
import PlayAgainButton from '@/components/game/PlayAgainButton';

type OneVsAllGameOverScreenProps = {
  gameState: OneVsAllGameState;
  dispatch: React.Dispatch<any>;
};

export default function OneVsAllGameOverScreen({ gameState, dispatch }: OneVsAllGameOverScreenProps) {
  const maxScore = Math.max(...gameState.players.map(player => player.score));
  const winningPlayers = gameState.players.filter(player => player.score === maxScore);
  const isTie = winningPlayers.length > 1;

  return (
    <div className="text-center space-y-8">
      <Confetti />
      <GameOverHeader />
      <WinnerAnnouncement
        winners={winningPlayers}
        isTie={isTie}
        subtitle={`Final Score: ${maxScore} points`}
      />
      <FinalStandings teams={gameState.players} heading="Final Scores" />
      <PlayAgainButton onReset={() => dispatch({ type: 'RESET_GAME' })} />
    </div>
  );
}
