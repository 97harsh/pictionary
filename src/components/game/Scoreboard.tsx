import React from 'react';
import type { Team } from '@/hooks/useGameEngine';
import { Card, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';
import { Trophy } from 'lucide-react';

type ScoreboardProps = {
  teams: Team[];
  currentTeamId?: number;
};

export default function Scoreboard({ teams, currentTeamId }: ScoreboardProps) {
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const maxScore = Math.max(...teams.map(team => team.score));
  const isTie = teams.filter(team => team.score === maxScore).length > 1;

  return (
    <div className="w-full space-y-2">
      {sortedTeams.map((team, index) => {
        const isWinner = team.score === maxScore;
        const isCurrentTeam = team.id === currentTeamId;
        const isTiedWinner = isWinner && isTie;
        
        return (
          <Card
            key={team.id}
            className={cn(
              'p-3 transition-all',
              isCurrentTeam ? 'border-accent ring-2 ring-accent' : 'bg-card/50',
              (isWinner && !isCurrentTeam) && 'border-yellow-400/50',
              isTiedWinner && 'border-yellow-400/50'
            )}
          >
            <div className="flex justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "font-bold text-lg w-6 text-center",
                    isWinner && 'text-yellow-400'
                  )}
                >
                  {isWinner ? <Trophy className="h-5 w-5 mx-auto"/> : index + 1}
                </span>
                <p className="text-lg font-medium">{team.name}</p>
              </div>
              <p className="text-xl font-bold text-primary">{team.score}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
