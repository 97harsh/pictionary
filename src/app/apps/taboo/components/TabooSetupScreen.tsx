"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { X, Plus, Users, Settings, BookOpen, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CategorySelectionScreen from '@/components/game/CategorySelectionScreen';
import type { SelectedCategories } from '@/lib/tabooWords';
import { TABOO_WORDS } from '@/lib/tabooWords';
import Link from 'next/link';

type TabooSetupScreenProps = {
  dispatch: React.Dispatch<any>;
};

export default function TabooSetupScreen({ dispatch }: TabooSetupScreenProps) {
  const [players, setPlayers] = useState<string[]>(['Player 1', 'Player 2', 'Player 3']);
  const [roundTime, setRoundTime] = useState<number>(60);
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [skipLimit, setSkipLimit] = useState<number>(3);
  const [winningScore, setWinningScore] = useState<number>(20);
  const [selectedCategories, setSelectedCategories] = useState<SelectedCategories>({
    'General': { difficulty: 'Beginner', subcategories: ['Objects', 'Actions'] },
  });
  const [isCategoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddPlayer = () => {
    if (players.length < 8) {
      setPlayers([...players, `Player ${players.length + 1}`]);
    } else {
      toast({
        title: "Player Limit Reached",
        description: "You can have a maximum of 8 players.",
        variant: "destructive",
      })
    }
  };

  const handleRemovePlayer = (index: number) => {
    if (players.length > 3) {
      setPlayers(players.filter((_, i) => i !== index));
    } else {
      toast({
        title: "Minimum Players Required",
        description: "You need at least 3 players to play Taboo.",
        variant: "destructive",
      })
    }
  };

  const handlePlayerNameChange = (index: number, newName: string) => {
    const newPlayers = [...players];
    newPlayers[index] = newName;
    setPlayers(newPlayers);
  };

  const handleStartGame = () => {
    const totalSelected = Object.values(selectedCategories).reduce((acc, val) => acc + (val.subcategories?.length || 0), 0);
    if (totalSelected === 0) {
        toast({
            title: "No Categories Selected",
            description: "Please select at least one category to start the game.",
            variant: "destructive",
        })
        return;
    }

    const filledPlayers = players.filter(p => p.trim());
    if (filledPlayers.length < 3) {
      toast({
        title: "Not Enough Players",
        description: "You need at least 3 players to start the game.",
        variant: "destructive",
      })
      return;
    }

    dispatch({
      type: 'START_GAME',
      players: filledPlayers,
      settings: {
        roundTime,
        skipLimit,
        winningScore,
        categories: selectedCategories,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Taboo Setup</h1>
          <p className="text-muted-foreground">Describe words without saying the taboo words!</p>
        </div>
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Player Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" /> Players
            </CardTitle>
            <CardDescription>Add 3-8 players</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {players.map((player, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder={`Player ${index + 1}`}
                    value={player}
                    onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                    className="flex-grow"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemovePlayer(index)}
                    disabled={players.length <= 3}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              onClick={handleAddPlayer}
              variant="outline"
              className="w-full"
              disabled={players.length >= 8}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Player
            </Button>
          </CardContent>
        </Card>

        {/* Game Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" /> Game Settings
            </CardTitle>
            <CardDescription>Configure game rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Round Time</Label>
              <div className="flex gap-2">
                <Select
                  value={isCustomTime ? 'custom' : String(roundTime)}
                  onValueChange={(value) => {
                    if (value === 'custom') {
                      setIsCustomTime(true);
                    } else {
                      setIsCustomTime(false);
                      setRoundTime(Number(value));
                    }
                  }}
                >
                  <SelectTrigger className="flex-grow">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">60 seconds</SelectItem>
                    <SelectItem value="90">90 seconds</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                {isCustomTime && (
                  <Input
                    type="number"
                    min="10"
                    max="300"
                    value={roundTime}
                    onChange={(e) => setRoundTime(Number(e.target.value))}
                    className="w-24"
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Skip Limit per Round</Label>
              <Select value={String(skipLimit)} onValueChange={(value) => setSkipLimit(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select skip limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 skip</SelectItem>
                  <SelectItem value="2">2 skips</SelectItem>
                  <SelectItem value="3">3 skips</SelectItem>
                  <SelectItem value="5">5 skips</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Winning Score</Label>
              <Select value={String(winningScore)} onValueChange={(value) => setWinningScore(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select winning score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 points</SelectItem>
                  <SelectItem value="20">20 points</SelectItem>
                  <SelectItem value="30">30 points</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Selection */}
      <div>
        <Dialog open={isCategoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full h-16" size="lg">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Select Word Categories ({Object.values(selectedCategories).reduce((acc, val) => acc + (val.subcategories?.length || 0), 0)} selected)
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Select Word Categories</DialogTitle>
                </DialogHeader>
                <div className="flex-grow overflow-y-auto -mx-6 px-6">
                    <CategorySelectionScreen
                        wordsStructure={TABOO_WORDS}
                        initialSelection={selectedCategories}
                        onSave={(newSelection) => {
                            setSelectedCategories(newSelection);
                            setCategoryDialogOpen(false);
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
      </div>

      <Button onClick={handleStartGame} className="w-full" size="lg">
        Start Game
      </Button>
    </div>
  );
}
