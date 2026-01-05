"use client";

import type { OneVsAllGameState } from "../hooks/useOneVsAllGameEngine";
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, X } from "lucide-react";

type GuesserSelectionScreenProps = {
    gameState: OneVsAllGameState;
    dispatch: React.Dispatch<any>;
};

export default function GuesserSelectionScreen({ gameState, dispatch }: GuesserSelectionScreenProps) {
    const drawer = gameState.players[gameState.currentTurn.drawerIndex];
    const guessers = gameState.players.filter(p => p.id !== drawer.id);

    const handleGuesserSelected = (guesserId: number) => {
        dispatch({ type: 'GUESSER_SELECTED', guesserId });
    };

    const handleNoOneGuessed = () => {
        dispatch({ type: 'NO_ONE_GUESSED' });
    };

    return (
        <div className="text-center space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-4xl font-bold text-primary">Who guessed it first?</h2>
                <p className="text-muted-foreground mt-2">Drawer, select the person who shouted the correct answer</p>
            </div>

            <Card className="bg-card/50">
                <CardHeader>
                    <CardTitle className="text-2xl">The word was:</CardTitle>
                    <CardDescription className="text-3xl font-bold text-foreground">
                        {gameState.currentRound.word}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        {guessers.map(player => (
                            <Button
                                key={player.id}
                                onClick={() => handleGuesserSelected(player.id)}
                                size="lg"
                                className="h-20 text-xl font-bold bg-accent hover:bg-accent/90 tap-highlight"
                            >
                                <UserCheck className="mr-2 h-6 w-6" />
                                {player.name}
                            </Button>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-border">
                        <Button
                            onClick={handleNoOneGuessed}
                            variant="outline"
                            size="lg"
                            className="w-full h-16 text-lg border-2 tap-highlight"
                        >
                            <X className="mr-2 h-5 w-5" />
                            No One Guessed
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
