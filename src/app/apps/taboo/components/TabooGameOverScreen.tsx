"use client";

import React from 'react';
import type { TabooGameState, Team } from '../hooks/useTabooGameEngine';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trophy } from 'lucide-react';
import Scoreboard from '@/components/game/Scoreboard';
import Confetti from '@/components/game/Confetti';

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

  return (
    <div className="text-center space-y-8">
        <Confetti />
        <div className="space-y-2">
            <Trophy className="mx-auto h-16 w-16 text-yellow-400" />
            <h2 className="text-4xl font-bold">Game Over!</h2>
            {isTie ? (
              <div className="space-y-2">
                <p className="text-2xl text-primary">Game Draw Between:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {winningTeams.map((team, index) => (
                    <React.Fragment key={team.id}>
                      <span className="text-2xl font-medium text-yellow-400">{team.name}</span>
                      {index < winningTeams.length - 2 && <span className="text-2xl">, </span>}
                      {index === winningTeams.length - 2 && <span className="text-2xl"> and </span>}
                    </React.Fragment>
                  ))}
                </div>
                <p className="text-lg text-muted-foreground">
                  {maxRoundsWon} Round{maxRoundsWon !== 1 ? 's' : ''} Won | {winningTeams[0].score} Points
                </p>
              </div>
            ) : (
              <>
                <p className="text-2xl text-primary">{winningTeams[0].name} wins!</p>
                <p className="text-lg text-muted-foreground">
                  {winningTeams[0].roundsWon} Round{winningTeams[0].roundsWon !== 1 ? 's' : ''} Won | {winningTeams[0].score} Points
                </p>
              </>
            )}
        </div>

        <div className="pt-4">
            <h3 className="text-xl font-semibold mb-4">Final Standings</h3>
            <Scoreboard teams={teams} />
        </div>

      <Button onClick={() => dispatch({ type: 'RESET_GAME' })} size="lg" className="w-full text-lg h-14">
        <RefreshCw className="mr-2 h-5 w-5" /> Play Again
      </Button>
    </div>
  );
}
