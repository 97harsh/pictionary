"use client";

import React from 'react';
import Scoreboard from './Scoreboard';

interface Team {
  id: number;
  name: string;
  score: number;
}

interface FinalStandingsProps {
  teams: Team[];
  heading?: string;
}

export default function FinalStandings({ teams, heading = "Final Standings" }: FinalStandingsProps) {
  return (
    <div className="pt-4">
      <h3 className="text-xl font-semibold mb-4">{heading}</h3>
      <Scoreboard teams={teams} />
    </div>
  );
}
