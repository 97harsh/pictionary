"use client";

import { useOneVsAllGameEngine } from '../hooks/useOneVsAllGameEngine';
import { useWakeLock } from '@/hooks/useWakeLock';
import OneVsAllSetupScreen from './OneVsAllSetupScreen';
import OneVsAllPlayingScreen from './OneVsAllPlayingScreen';
import OneVsAllGameOverScreen from './OneVsAllGameOverScreen';
import OneVsAllRoundEndScreen from './OneVsAllRoundEndScreen';
import OneVsAllTurnStartScreen from './OneVsAllTurnStartScreen';
import GuesserSelectionScreen from './GuesserSelectionScreen';
import { Card, CardContent } from '@/components/ui/card';

export default function OneVsAllGameController() {
  const { gameState, dispatch } = useOneVsAllGameEngine();

  useWakeLock(gameState.status === 'playing');

  const renderScreen = () => {
    switch (gameState.status) {
      case 'setup':
        return <OneVsAllSetupScreen dispatch={dispatch} />;
      case 'turn_start':
        return <OneVsAllTurnStartScreen gameState={gameState} dispatch={dispatch} />;
      case 'playing':
        return <OneVsAllPlayingScreen gameState={gameState} dispatch={dispatch} />;
      case 'guesser_selection':
        return <GuesserSelectionScreen gameState={gameState} dispatch={dispatch} />;
      case 'round_end':
        return <OneVsAllRoundEndScreen gameState={gameState} dispatch={dispatch} />;
      case 'game_over':
        return <OneVsAllGameOverScreen gameState={gameState} dispatch={dispatch} />;
      default:
        return <OneVsAllSetupScreen dispatch={dispatch} />;
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
