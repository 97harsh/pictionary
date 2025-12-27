"use client";

import type { GameState } from "@/hooks/useGameEngine";
import React from 'react';
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Scoreboard from "./Scoreboard";
import EndGameButton from "./EndGameButton";

type TurnStartScreenProps = {
    gameState: GameState;
    dispatch: React.Dispatch<any>;
};

export default function TurnStartScreen({ gameState, dispatch }: TurnStartScreenProps) {
    const currentTeam = gameState.teams[gameState.currentTurn.teamIndex];

    return (
        <div className="text-center space-y-8">
            <div>
                <p className="text-lg text-primary">Next up!</p>
                <h2 className="text-4xl font-bold">{currentTeam.name}</h2>
            </div>
            
            <div className="bg-card/50 p-6 rounded-lg text-center space-y-2">
                <h3 className="text-2xl font-semibold">Drawer, Get Ready!</h3>
                <p className="text-muted-foreground">Pass the device to this round's artist.</p>
                <p className="text-muted-foreground">Don't let your team see the word!</p>
            </div>

            <Button onClick={() => dispatch({ type: 'START_ROUND' })} size="lg" className="w-full text-lg">
                I'm Ready! Start Round <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <div className="pt-4">
                <Scoreboard teams={gameState.teams} currentTeamId={currentTeam.id} />
            </div>

            <div className="!mt-8">
                <EndGameButton dispatch={dispatch} />
            </div>
        </div>
    )
}
