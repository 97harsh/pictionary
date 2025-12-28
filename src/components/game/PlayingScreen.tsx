
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { GameState } from '@/hooks/useGameEngine';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Check, SkipForward, Eye, EyeOff } from 'lucide-react';
import CategoryIcon from '../icons/CategoryIcon';
import { useSound } from '@/hooks/useSound';
import { useHaptic } from '@/hooks/useHaptic';
import EndGameButton from './EndGameButton';

type PlayingScreenProps = {
  gameState: GameState;
  dispatch: React.Dispatch<any>;
};

const WordDisplay = ({ word, revealed, hidden, onReveal, onHide, onShow }: { word: string; revealed: boolean; hidden: boolean; onReveal: () => void; onHide: () => void; onShow: () => void; }) => {
    if (!revealed) {
        return (
            <div className="text-center space-y-6 p-4">
                <div className="flex flex-col items-center gap-4">
                    <Eye className="h-16 w-16 text-primary" />
                    <h2 className="text-3xl font-bold">Are you the drawer?</h2>
                    <p className="text-muted-foreground max-w-xs text-center">
                        The word is hidden. Click the button below to reveal it. Make sure your team can't see the screen!
                    </p>
                </div>
                <Button onClick={onReveal} size="lg" className="w-full text-lg h-14">
                    <Eye className="mr-2 h-6 w-6" /> Reveal Word
                </Button>
            </div>
        )
    }

    if (hidden) {
        return (
             <div className="text-center w-full flex items-center justify-center animate-in fade-in duration-300">
                <Button onClick={onShow} size="lg" className="w-full text-lg h-14">
                    <Eye className="mr-2 h-6 w-6" /> Show Word
                </Button>
            </div>
        )
    }

    return (
        <div className="text-center w-full animate-in fade-in duration-500">
            <h2 className="text-7xl md:text-8xl lg:text-9xl font-bold tracking-wide text-center break-words leading-tight">
                {word}
            </h2>
            <Button onClick={onHide} variant="ghost" size="sm" className="mt-4 text-muted-foreground">
                <EyeOff className="mr-2 h-4 w-4" /> Hide Word
            </Button>
        </div>
    );
};


export default function PlayingScreen({ gameState, dispatch }: PlayingScreenProps) {
  const { play: playTick, stop: stopTick } = useSound('/sounds/tick.wav', { volume: -10, loop: false });
  const { play: playEnd } = useSound('/sounds/timesup.wav', { volume: 0 });
  const { play: playCorrect } = useSound('/sounds/correct.wav', { volume: -5 });
  const haptic = useHaptic();

  const { settings, currentTurn, currentRound, status } = gameState;
  const [timeLeft, setTimeLeft] = useState(settings.roundTime);
  const [wordHidden, setWordHidden] = useState(false);

  const currentTeam = useMemo(() => gameState.teams[currentTurn.teamIndex], [gameState.teams, currentTurn.teamIndex]);

  useEffect(() => {
    if (status !== 'playing' || !currentRound.wordRevealed) {
        return;
    };

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(timer);
          stopTick();
          playEnd();
          // Use setTimeout to avoid dispatching during render
          setTimeout(() => dispatch({ type: 'TIME_UP' }), 0);
          return 0;
        }
        if (newTime <= 10 && newTime > 0) {
            playTick();
        }
        return newTime;
      });
    }, 1000);

    return () => {
        clearInterval(timer);
        stopTick();
    };
  }, [dispatch, status, currentRound.wordRevealed, playEnd, playTick, stopTick]);

  useEffect(() => {
    // Reset timer when a new word is revealed in the same turn (e.g. after a skip)
    if (currentRound.wordRevealed) {
        setTimeLeft(settings.roundTime);
    }
  }, [currentRound.word, currentRound.wordRevealed, settings.roundTime]);


  const handleCorrectGuess = () => {
    haptic.success();
    playCorrect();
    dispatch({ type: 'CORRECT_GUESS' });
  };

  const handleSkipWord = () => {
    haptic.tap();
    dispatch({ type: 'SKIP_WORD' });
    setWordHidden(false);
  };

  const handleRevealWord = () => {
    dispatch({type: 'REVEAL_WORD'});
    setWordHidden(false);
  }

  const progressAngle = (timeLeft / settings.roundTime) * 360;

  return (
    <div className="flex flex-col h-full items-center justify-between space-y-4">
      <div className="w-full text-center">
        <p className="text-lg text-primary">{currentTeam.name}'s Turn</p>
        <p className="text-2xl font-bold">{currentTeam.score} points</p>
      </div>

      <Card className="w-full flex-grow flex flex-col items-center justify-center p-6 bg-card shadow-xl border-4">
        <CardHeader className="items-center text-center p-2">
            <div className="flex items-center gap-3 text-foreground">
                <CategoryIcon category={currentRound.category} className="h-10 w-10" />
                <CardDescription className="text-2xl font-semibold">{currentRound.subCategory}</CardDescription>
            </div>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center w-full">
            <WordDisplay 
              word={currentRound.word} 
              revealed={currentRound.wordRevealed} 
              hidden={wordHidden}
              onReveal={handleRevealWord} 
              onHide={() => setWordHidden(true)}
              onShow={() => setWordHidden(false)}
            />
        </CardContent>
      </Card>

    { currentRound.wordRevealed && 
      <div className="w-full space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-center items-center">
            <div
                className="relative h-48 w-48 md:h-56 md:w-56 rounded-full flex items-center justify-center transition-all duration-1000"
                style={{
                    background: `
                        radial-gradient(closest-side, hsl(var(--card)) 79%, transparent 80% 100%),
                        conic-gradient(${
                          timeLeft <= 10
                            ? 'hsl(var(--timer-danger))'
                            : timeLeft <= 30
                              ? 'hsl(var(--timer-warning))'
                              : 'hsl(var(--primary))'
                        } ${progressAngle}deg, hsl(var(--muted)) 0)
                    `,
                    boxShadow: timeLeft <= 10 ? '0 0 40px hsla(0, 84%, 60%, 0.5)' : 'none'
                }}
            >
                <p className="text-center text-6xl md:text-7xl font-mono font-bold">{timeLeft}</p>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <Button
            onClick={handleSkipWord}
            variant="outline"
            size="lg"
            className="h-24 md:h-28 text-2xl md:text-3xl font-bold border-4"
            disabled={currentRound.skipsUsed >= settings.skipLimit}
          >
            <SkipForward className="mr-3 h-10 w-10" /> SKIP ({settings.skipLimit - currentRound.skipsUsed})
          </Button>
          <Button onClick={handleCorrectGuess} size="lg" className="h-24 md:h-28 text-2xl md:text-3xl font-bold bg-accent hover:bg-accent/90">
            <Check className="mr-3 h-12 w-12" /> GOT IT!
          </Button>
        </div>
      </div>
      }
      <div className="w-full pt-4">
        <EndGameButton dispatch={dispatch} />
      </div>
    </div>
  );
}
