"use client";

import type { OneVsAllGameState } from "../hooks/useOneVsAllGameEngine";
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Scoreboard from "@/components/game/Scoreboard";
import Confetti from "@/components/game/Confetti";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EndGameButton from "@/components/game/EndGameButton";

type OneVsAllRoundEndScreenProps = {
    gameState: OneVsAllGameState;
    dispatch: React.Dispatch<any>;
};

export default function OneVsAllRoundEndScreen({ gameState, dispatch }: OneVsAllRoundEndScreenProps) {
    const { roundWinner, currentRound, settings } = gameState;
    const nextDrawerIndex = (gameState.currentTurn.drawerIndex + 1) % gameState.players.length;
    const nextDrawer = gameState.players[nextDrawerIndex];
    const currentDrawer = gameState.players[gameState.currentTurn.drawerIndex];

    const handleNextTurn = () => {
        dispatch({ type: 'ADVANCE_TURN' });
    };

    return (
        <div className="text-center space-y-6">
            {roundWinner && <Confetti />}

            <div className="space-y-2">
                <h2 className="text-4xl font-bold">
                    {roundWinner ? `${roundWinner.name} Got It!` : "No One Guessed!"}
                </h2>
                {roundWinner ? (
                    <p className="text-xl text-green-400">
                        {roundWinner.name} scores +1 point!
                    </p>
                ) : (
                    <div className="space-y-1">
                        <p className="text-xl text-destructive">
                            No points awarded this round.
                        </p>
                        {settings.penalizeDrawer && !currentRound.anyoneGuessed && (
                            <p className="text-sm text-muted-foreground">
                                {currentDrawer.name} loses 0.5 points
                            </p>
                        )}
                    </div>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>The word was:</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold tracking-widest text-accent">{gameState.currentRound.word}</p>
                </CardContent>
            </Card>

            <div className="pt-4">
                 <Scoreboard teams={gameState.players} />
            </div>

            <Button onClick={handleNextTurn} size="lg" className="w-full text-lg">
                Next Turn: {nextDrawer.name} draws <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="!mt-8">
                <EndGameButton dispatch={dispatch} />
            </div>
        </div>
    )
}
