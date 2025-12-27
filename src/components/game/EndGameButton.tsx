"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { LogOut } from 'lucide-react';

type EndGameButtonProps = {
  dispatch: React.Dispatch<any>;
};

export default function EndGameButton({ dispatch }: EndGameButtonProps) {
  const handleEndGame = () => {
    dispatch({ type: 'FORCE_GAME_OVER' });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          <LogOut className="mr-2 h-4 w-4" /> End Game
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to end the game?</AlertDialogTitle>
          <AlertDialogDescription>
            This will end the current game for all players. The team with the highest score will be declared the winner.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleEndGame} className="bg-destructive hover:bg-destructive/90">
            End Game
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
