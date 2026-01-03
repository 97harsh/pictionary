"use client";

import React from 'react';

interface Participant {
  id: number;
  name: string;
  score: number;
}

interface WinnerAnnouncementProps {
  winners: Participant[];
  isTie: boolean;
  subtitle?: string;
}

export default function WinnerAnnouncement({ winners, isTie, subtitle }: WinnerAnnouncementProps) {
  if (isTie) {
    return (
      <div className="space-y-2">
        <p className="text-2xl text-primary">Game Draw Between:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {winners.map((winner, index) => (
            <React.Fragment key={winner.id}>
              <span className="text-2xl font-medium text-yellow-400">{winner.name}</span>
              {index < winners.length - 2 && <span className="text-2xl">, </span>}
              {index === winners.length - 2 && <span className="text-2xl"> and </span>}
            </React.Fragment>
          ))}
        </div>
        {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
      </div>
    );
  }

  return (
    <>
      <p className="text-2xl text-primary">{winners[0].name} wins the game!</p>
      {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
    </>
  );
}
