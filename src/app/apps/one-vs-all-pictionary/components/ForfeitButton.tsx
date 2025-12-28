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
import { SkipForward } from 'lucide-react';

type ForfeitButtonProps = {
  dispatch: React.Dispatch<any>;
};

export default function ForfeitButton({ dispatch }: ForfeitButtonProps) {
  const handleForfeit = () => {
    dispatch({ type: 'FORFEIT_ROUND' });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          <SkipForward className="mr-2 h-4 w-4" /> Forfeit Round
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Forfeit this round?</AlertDialogTitle>
          <AlertDialogDescription>
            This will skip to the next drawer's turn. No points will be awarded for this round.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleForfeit} className="bg-destructive hover:bg-destructive/90">
            Forfeit Round
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
