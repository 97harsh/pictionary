"use client";

import { useTabooGameEngine } from '../hooks/useTabooGameEngine';
import { useWakeLock } from '@/hooks/useWakeLock';
import TabooSetupScreen from './TabooSetupScreen';
import TabooPlayingScreen from './TabooPlayingScreen';
import TabooGameOverScreen from './TabooGameOverScreen';
import TabooRoundEndScreen from './TabooRoundEndScreen';
import TabooTurnStartScreen from './TabooTurnStartScreen';
import { Card, CardContent } from '@/components/ui/card';

export default function TabooGameController() {
  const { gameState, dispatch } = useTabooGameEngine();

  useWakeLock(gameState.status === 'playing');

  const renderScreen = () => {
    switch (gameState.status) {
      case 'setup':
        return <TabooSetupScreen dispatch={dispatch} />;
      case 'turn_start':
        return <TabooTurnStartScreen gameState={gameState} dispatch={dispatch} />;
      case 'playing':
        return <TabooPlayingScreen gameState={gameState} dispatch={dispatch} />;
      case 'round_end':
        return <TabooRoundEndScreen gameState={gameState} dispatch={dispatch} />;
      case 'game_over':
        return <TabooGameOverScreen gameState={gameState} dispatch={dispatch} />;
      default:
        return <TabooSetupScreen dispatch={dispatch} />;
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
