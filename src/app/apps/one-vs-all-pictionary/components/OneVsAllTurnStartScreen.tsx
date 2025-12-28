"use client";

import type { OneVsAllGameState } from "../hooks/useOneVsAllGameEngine";
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Scoreboard from "@/components/game/Scoreboard";
import EndGameButton from "@/components/game/EndGameButton";

type OneVsAllTurnStartScreenProps = {
    gameState: OneVsAllGameState;
    dispatch: React.Dispatch<any>;
};

export default function OneVsAllTurnStartScreen({ gameState, dispatch }: OneVsAllTurnStartScreenProps) {
    const drawer = gameState.players[gameState.currentTurn.drawerIndex];
    const guessers = gameState.players.filter(p => p.id !== drawer.id);

    return (
        <div className="text-center space-y-8">
            <div>
                <p className="text-lg text-primary">Next Drawer!</p>
                <h2 className="text-4xl font-bold">{drawer.name}</h2>
            </div>

            <div className="bg-card/50 p-6 rounded-lg text-center space-y-2">
                <h3 className="text-2xl font-semibold">Drawer, Get Ready!</h3>
                <p className="text-muted-foreground">Don't let the guessers see the word!</p>
                <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm font-semibold text-primary">Guessers:</p>
                    <p className="text-muted-foreground">{guessers.map(p => p.name).join(', ')}</p>
                    <p className="text-sm text-muted-foreground mt-2">Shout the answer when you know it!</p>
                </div>
            </div>

            <Button onClick={() => dispatch({ type: 'START_ROUND' })} size="lg" className="w-full text-lg">
                I'm Ready! Start Drawing <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="pt-4">
                <Scoreboard teams={gameState.players} currentTeamId={drawer.id} />
            </div>

            <div className="!mt-8">
                <EndGameButton dispatch={dispatch} />
            </div>
        </div>
    )
}
