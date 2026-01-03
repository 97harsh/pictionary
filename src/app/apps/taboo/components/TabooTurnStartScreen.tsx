"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CategoryIcon from '@/components/icons/CategoryIcon';
import type { TabooGameState } from '../hooks/useTabooGameEngine';

type TabooTurnStartScreenProps = {
  gameState: TabooGameState;
  dispatch: React.Dispatch<any>;
};

export default function TabooTurnStartScreen({ gameState, dispatch }: TabooTurnStartScreenProps) {
  const currentDescriber = gameState.players[gameState.currentTurn.describerIndex];

  return (
    <div className="flex flex-col items-center justify-center space-y-6 min-h-[400px]">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold text-muted-foreground">Next Describer</h2>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold">{currentDescriber.name}</h1>
      </div>

      <Card className="w-full max-w-md border-2">
        <CardContent className="p-6 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-xl font-medium">
            <CategoryIcon category={gameState.currentRound.category} className="h-8 w-8" />
            <span>{gameState.currentRound.category}</span>
          </div>
          <div className="text-lg text-muted-foreground">
            {gameState.currentRound.subCategory}
          </div>
          <div className="text-sm text-muted-foreground">
            Describe the word without saying the taboo words!
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={() => dispatch({ type: 'START_ROUND' })}
        size="lg"
        className="w-full max-w-md h-16 text-xl"
      >
        Start Round
      </Button>
    </div>
  );
}
