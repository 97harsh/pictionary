"use client";

import React from 'react';
import type { TabooGameState, Team } from '../hooks/useTabooGameEngine';
import Confetti from '@/components/game/Confetti';
import GameOverHeader from '@/components/game/GameOverHeader';
import WinnerAnnouncement from '@/components/game/WinnerAnnouncement';
import FinalStandings from '@/components/game/FinalStandings';
import PlayAgainButton from '@/components/game/PlayAgainButton';

// Extend the Team type to include roundsWon for Taboo
type TabooTeam = Team & { roundsWon: number };

type TabooGameOverScreenProps = {
  gameState: TabooGameState;
  dispatch: React.Dispatch<any>;
};

export default function TabooGameOverScreen({ gameState, dispatch }: TabooGameOverScreenProps) {
  // Cast teams to TabooTeam[] to include roundsWon
  const teams = gameState.teams as TabooTeam[];

  // Find the maximum rounds won
  const maxRoundsWon = Math.max(...teams.map(team => team.roundsWon));

  // Get all teams with max rounds won
  const potentialWinners = teams.filter(team => team.roundsWon === maxRoundsWon);

  // If multiple teams have same max rounds, use score as tiebreaker
  const winningTeams = potentialWinners.length === 1
    ? potentialWinners
    : (() => {
        const maxScore = Math.max(...potentialWinners.map(team => team.score));
        return potentialWinners.filter(team => team.score === maxScore);
      })();

  const isTie = winningTeams.length > 1;
  const subtitle = `${maxRoundsWon} Round${maxRoundsWon !== 1 ? 's' : ''} Won | ${winningTeams[0].score} Points`;

  return (
    <div className="text-center space-y-8">
      <Confetti />
      <GameOverHeader />
      <WinnerAnnouncement winners={winningTeams} isTie={isTie} subtitle={subtitle} />
      <FinalStandings teams={teams} />
      <PlayAgainButton onReset={() => dispatch({ type: 'RESET_GAME' })} />
    </div>
  );
}
