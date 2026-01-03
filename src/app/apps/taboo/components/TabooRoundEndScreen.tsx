"use client";

import type { TabooGameState } from "../hooks/useTabooGameEngine";
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertCircle } from "lucide-react";
import Scoreboard from "@/components/game/Scoreboard";
import Confetti from "@/components/game/Confetti";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EndGameButton from "@/components/game/EndGameButton";

type TabooRoundEndScreenProps = {
    gameState: TabooGameState;
    dispatch: React.Dispatch<any>;
};

export default function TabooRoundEndScreen({ gameState, dispatch }: TabooRoundEndScreenProps) {
    const { roundWinner, currentRound } = gameState;
    const nextTeamIndex = (gameState.currentTurn.teamIndex + 1) % gameState.teams.length;
    const nextTeam = gameState.teams[nextTeamIndex];
    const currentTeam = gameState.teams[gameState.currentTurn.teamIndex];

    const handleNextTurn = () => {
        dispatch({ type: 'ADVANCE_TURN' });
    };

    return (
        <div className="text-center space-y-6">
            {roundWinner && <Confetti />}

            <div className="space-y-2">
                <h2 className="text-lg text-muted-foreground">Round {gameState.currentTurn.roundNumber}</h2>
                <h3 className="text-4xl font-bold">{currentTeam.name}'s Turn</h3>
                {currentRound.violations > 0 ? (
                    <div className="space-y-1">
                        <p className="text-2xl text-destructive font-bold">Taboo Violation!</p>
                        <p className="text-lg text-muted-foreground">Lost 1 point</p>
                    </div>
                ) : currentRound.wordsGuessed > 0 ? (
                    <p className="text-xl text-green-400">
                        Scored {currentRound.wordsGuessed} word{currentRound.wordsGuessed > 1 ? 's' : ''}!
                    </p>
                ) : (
                    <p className="text-xl text-muted-foreground">
                        Time's up!
                    </p>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>The word was:</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-4xl font-bold tracking-widest text-accent mb-4">{currentRound.word}</p>
                    <div className="border-t-2 pt-4 mt-4">
                        <p className="text-sm text-muted-foreground mb-2">Taboo words:</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {currentRound.tabooWords.map((tabooWord, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-destructive/20 text-destructive rounded-full text-sm font-medium"
                                >
                                    {tabooWord}
                                </span>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {currentRound.violations > 0 && (
                <Card className="border-destructive/50">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-center gap-2 text-destructive">
                            <AlertCircle className="h-5 w-5" />
                            <p className="text-lg font-semibold">
                                {currentRound.violations} violation{currentRound.violations > 1 ? 's' : ''} this round
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="pt-4">
                 <Scoreboard teams={gameState.teams} />
            </div>

            <Button onClick={handleNextTurn} size="lg" className="w-full text-lg h-14">
                Next Turn: {nextTeam.name} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="!mt-8">
                <EndGameButton dispatch={dispatch} />
            </div>
        </div>
    )
}
