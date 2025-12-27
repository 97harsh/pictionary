"use client";

import type { GameState } from "@/hooks/useGameEngine";
import React from 'react';
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Scoreboard from "./Scoreboard";
import Confetti from "./Confetti";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import EndGameButton from "./EndGameButton";

type RoundEndScreenProps = {
    gameState: GameState;
    dispatch: React.Dispatch<any>;
};

export default function RoundEndScreen({ gameState, dispatch }: RoundEndScreenProps) {
    const { roundWinner } = gameState;
    const nextTeamIndex = (gameState.currentTurn.teamIndex + 1) % gameState.teams.length;
    const nextTeam = gameState.teams[nextTeamIndex];

    const handleNextTurn = () => {
        dispatch({ type: 'ADVANCE_TURN' });
    };

    return (
        <div className="text-center space-y-6">
            {roundWinner && <Confetti />}
            
            <div className="space-y-2">
                <h2 className="text-4xl font-bold">
                    {roundWinner ? "Correct!" : "Time's Up!"}
                </h2>
                {roundWinner ? (
                    <p className="text-xl text-green-400">
                        {roundWinner.name} scores 10 points!
                    </p>
                ) : (
                    <p className="text-xl text-destructive">
                        No points awarded this round.
                    </p>
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
                 <Scoreboard teams={gameState.teams} />
            </div>

            <Button onClick={handleNextTurn} size="lg" className="w-full text-lg">
                Next Turn: {nextTeam.name} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <div className="!mt-8">
                <EndGameButton dispatch={dispatch} />
            </div>
        </div>
    )
}
