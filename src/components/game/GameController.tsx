"use client";

import { useGameEngine } from '@/hooks/useGameEngine';
import SetupScreen from './SetupScreen';
import PlayingScreen from './PlayingScreen';
import GameOverScreen from './GameOverScreen';
import RoundEndScreen from './RoundEndScreen';
import TurnStartScreen from './TurnStartScreen';
import { Card, CardContent } from '../ui/card';

export default function GameController() {
  const { gameState, dispatch } = useGameEngine();

  const renderScreen = () => {
    switch (gameState.status) {
      case 'setup':
        return <SetupScreen dispatch={dispatch} />;
      case 'turn_start':
        return <TurnStartScreen gameState={gameState} dispatch={dispatch} />;
      case 'playing':
        return <PlayingScreen gameState={gameState} dispatch={dispatch} />;
      case 'round_end':
        return <RoundEndScreen gameState={gameState} dispatch={dispatch} />;
      case 'game_over':
        return <GameOverScreen gameState={gameState} dispatch={dispatch} />;
      default:
        return <SetupScreen dispatch={dispatch} />;
    }
  };

  return (
    <Card className="border-2 border-primary/50 shadow-lg shadow-primary/20">
      <CardContent className="p-4 sm:p-6">
        {renderScreen()}
      </CardContent>
    </Card>
  );
}
