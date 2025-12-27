"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { GameState } from '@/hooks/useGameEngine';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, SkipForward, Eye } from 'lucide-react';
import CategoryIcon from '../icons/CategoryIcon';
import { useSound } from '@/hooks/useSound';

type PlayingScreenProps = {
  gameState: GameState;
  dispatch: React.Dispatch<any>;
};

const WordDisplay = ({ word, revealed, onReveal }: { word: string; revealed: boolean; onReveal: () => void; }) => {
    if (!revealed) {
        return (
            <div className="text-center space-y-4">
                <p className="text-muted-foreground">Are you the drawer?</p>
                <Button onClick={onReveal} size="lg">
                    <Eye className="mr-2 h-5 w-5" /> Show Word
                </Button>
            </div>
        )
    }

    return (
        <h2 className="text-5xl md:text-6xl font-bold tracking-wider text-center break-words animate-in fade-in duration-500">
            {word}
        </h2>
    );
};


export default function PlayingScreen({ gameState, dispatch }: PlayingScreenProps) {
  const { play: playTick, stop: stopTick } = useSound('/sounds/tick.mp3', { volume: -10, loop: true });
  const { play: playEnd } = useSound('/sounds/buzzer.mp3', { volume: 0 });
  const { play: playCorrect } = useSound('/sounds/correct.mp3', { volume: -5 });

  const { settings, currentTurn, currentRound } = gameState;
  const [timeLeft, setTimeLeft] = useState(settings.roundTime);
  
  const currentTeam = useMemo(() => gameState.teams[currentTurn.teamIndex], [gameState.teams, currentTurn.teamIndex]);

  useEffect(() => {
    if (!currentRound.wordRevealed) return;

    setTimeLeft(settings.roundTime);
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          dispatch({ type: 'TIME_UP' });
          stopTick();
          playEnd();
          return 0;
        }
        if (prev <= 11) {
            playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
        clearInterval(timer);
        stopTick();
    };
  }, [dispatch, settings.roundTime, currentRound.wordRevealed, playEnd, playTick, stopTick]);

  const handleCorrectGuess = () => {
    playCorrect();
    dispatch({ type: 'CORRECT_GUESS' });
  };
  
  const handleSkipWord = () => {
    dispatch({ type: 'SKIP_WORD' });
  };

  const handleRevealWord = () => {
    dispatch({type: 'REVEAL_WORD'});
  }

  const progressValue = (timeLeft / settings.roundTime) * 100;

  return (
    <div className="flex flex-col h-full items-center justify-between space-y-8">
      <div className="w-full text-center">
        <p className="text-lg text-primary">{currentTeam.name}'s Turn</p>
        <p className="text-2xl font-bold">{currentTeam.score} points</p>
      </div>

      <Card className="w-full flex-grow flex flex-col items-center justify-center p-6 bg-card/50">
        <CardHeader className="items-center text-center p-2">
            <div className="flex items-center gap-2 text-muted-foreground">
                <CategoryIcon category={currentRound.category} />
                <CardDescription className="text-lg">{currentRound.category}</CardDescription>
            </div>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center w-full">
            <WordDisplay word={currentRound.word} revealed={currentRound.wordRevealed} onReveal={handleRevealWord} />
        </CardContent>
      </Card>

    { currentRound.wordRevealed && 
      <div className="w-full space-y-6 animate-in fade-in duration-500">
        <div className="space-y-2">
            <div className="relative w-full h-4 rounded-full overflow-hidden bg-muted">
                <Progress 
                    value={progressValue} 
                    className={`h-4 transition-all duration-1000 linear ${timeLeft <= 10 ? 'bg-destructive' : 'bg-primary'}`}
                />
            </div>
            <p className="text-center text-2xl font-mono font-bold">{timeLeft}s</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={handleSkipWord} 
            variant="outline" 
            size="lg" 
            className="h-20 text-xl"
            disabled={currentRound.skipsUsed >= settings.skipLimit}
          >
            <SkipForward className="mr-2 h-6 w-6" /> Skip ({settings.skipLimit - currentRound.skipsUsed})
          </Button>
          <Button onClick={handleCorrectGuess} size="lg" className="h-20 text-xl bg-green-600 hover:bg-green-700">
            <Check className="mr-2 h-8 w-8" /> Correct!
          </Button>
        </div>
      </div>
      }
    </div>
  );
}
