"use client";

import React from 'react';
import type { GameState } from '@/hooks/useGameEngine';
import Confetti from './Confetti';
import GameOverHeader from './GameOverHeader';
import WinnerAnnouncement from './WinnerAnnouncement';
import FinalStandings from './FinalStandings';
import PlayAgainButton from './PlayAgainButton';

type GameOverScreenProps = {
  gameState: GameState;
  dispatch: React.Dispatch<any>;
};

export default function GameOverScreen({ gameState, dispatch }: GameOverScreenProps) {
  const maxScore = Math.max(...gameState.teams.map(team => team.score));
  const winningTeams = gameState.teams.filter(team => team.score === maxScore);
  const isTie = winningTeams.length > 1;

  return (
    <div className="text-center space-y-8">
      <Confetti />
      <GameOverHeader />
      <WinnerAnnouncement winners={winningTeams} isTie={isTie} />
      <FinalStandings teams={gameState.teams} heading="Final Scores" />
      <PlayAgainButton onReset={() => dispatch({ type: 'RESET_GAME' })} />
    </div>
  );
}
