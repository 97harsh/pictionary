"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { X, Plus, Users, Settings, BookOpen, ArrowLeft, HelpCircle, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CategorySelectionScreen from '@/components/game/CategorySelectionScreen';
import type { SelectedCategories } from '@/lib/words';
import Link from 'next/link';

type OneVsAllSetupScreenProps = {
  dispatch: React.Dispatch<any>;
};

export default function OneVsAllSetupScreen({ dispatch }: OneVsAllSetupScreenProps) {
  const [players, setPlayers] = useState<string[]>(['Player 1', 'Player 2', 'Player 3']);
  const [roundTime, setRoundTime] = useState<number>(60);
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [skipLimit, setSkipLimit] = useState<number>(3);
  const [winningScore, setWinningScore] = useState<number>(20);
  const [penalizeDrawer, setPenalizeDrawer] = useState<boolean>(true);
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
        title: "Minimum Players",
        description: "You need at least 3 players to play.",
        variant: "destructive",
      })
    }
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index] = name;
    setPlayers(newPlayers);
  };

  const handleRoundTimeChange = (value: string) => {
    if (value === 'custom') {
      setIsCustomTime(true);
    } else {
      setIsCustomTime(false);
      setRoundTime(Number(value));
    }
  }

  const handleStartGame = () => {
    const totalSelected = Object.values(selectedCategories).reduce((acc, val) => acc + (val.subcategories?.length || 0), 0);
    if (totalSelected === 0) {
      toast({
        title: 'No Words to Play With',
        description: 'Please select at least one word subcategory.',
        variant: 'destructive',
      });
      return;
    }

    if (isCustomTime && (roundTime <= 0 || isNaN(roundTime))) {
        toast({
            title: 'Invalid Custom Time',
            description: 'Please enter a valid number of seconds for the round time.',
            variant: 'destructive'
        });
        return;
    }

    dispatch({
      type: 'START_GAME',
      players: players.map(p => p.trim()).filter(Boolean),
      settings: { roundTime, skipLimit, winningScore, categories: selectedCategories, penalizeDrawer },
    });
  };

  const selectedSubcategoryCount = Object.values(selectedCategories).reduce((acc, cat) => acc + (cat.subcategories?.length || 0), 0);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tighter text-primary">One vs All Pictionary</h1>
        <p className="text-muted-foreground">Individual player mode - first to shout wins!</p>
      </div>

      {players.length >= 6 && (
        <Alert variant="default" className="border-amber-500 bg-amber-50 dark:bg-amber-950">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle>Large Group Detected</AlertTitle>
          <AlertDescription>
            Recommended: 3-5 players for best experience. With {players.length} players, it might get chaotic!
            <br />
            <Link href="/apps/offline-pictionary" className="text-primary hover:underline font-medium">
              Want team play instead? Try our team-based mode →
            </Link>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <Label className="text-lg font-semibold flex items-center gap-2"><Users className="h-5 w-5" /> Players</Label>
        <div className="space-y-3">
          {players.map((player, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                type="text"
                value={player}
                onChange={e => handlePlayerNameChange(index, e.target.value)}
                placeholder={`Player ${index + 1} Name`}
                className="bg-background/50"
              />
              <Button variant="ghost" size="icon" onClick={() => handleRemovePlayer(index)} disabled={players.length <= 3}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={handleAddPlayer} disabled={players.length >= 8}>
          <Plus className="mr-2 h-4 w-4" /> Add Player
        </Button>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-semibold flex items-center gap-2"><Settings className="h-5 w-5" /> Game Settings</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="round-time">Round Time</Label>
            <Select onValueChange={handleRoundTimeChange} defaultValue={String(roundTime)}>
              <SelectTrigger id="round-time"><SelectValue placeholder="Select time" /></SelectTrigger>
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
                    placeholder="Seconds"
                    value={roundTime}
                    onChange={(e) => setRoundTime(Number(e.target.value))}
                    className="mt-2"
                />
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="skip-limit">Skips per Round</Label>
            <Select onValueChange={value => setSkipLimit(Number(value))} defaultValue={String(skipLimit)}>
              <SelectTrigger id="skip-limit"><SelectValue placeholder="Select skips" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 skip</SelectItem>
                <SelectItem value="2">2 skips</SelectItem>
                <SelectItem value="3">3 skips</SelectItem>
                <SelectItem value="5">5 skips</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="winning-score">Winning Score</Label>
             <Select onValueChange={value => setWinningScore(Number(value))} defaultValue={String(winningScore)}>
              <SelectTrigger id="winning-score"><SelectValue placeholder="Select score" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 points</SelectItem>
                <SelectItem value="20">20 points</SelectItem>
                <SelectItem value="30">30 points</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="penalize-drawer"
                checked={penalizeDrawer}
                onCheckedChange={(checked) => setPenalizeDrawer(checked as boolean)}
              />
              <Label htmlFor="penalize-drawer" className="flex items-center gap-2 cursor-pointer">
                Penalize drawer if no one guesses
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Drawer loses 0.5 points if no one guesses any word during their turn</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-lg font-semibold">Word Categories</Label>
        <Dialog open={isCategoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>
                        {selectedSubcategoryCount > 0 ? `${selectedSubcategoryCount} subcategories selected` : 'Select categories'}
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Select Word Categories</DialogTitle>
                </DialogHeader>
                <div className="flex-grow overflow-y-auto -mx-6 px-6">
                    <CategorySelectionScreen
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

      <div className="space-y-4">
        <Button onClick={handleStartGame} size="lg" className="w-full text-lg bg-accent hover:bg-accent/90">
            Start Game
        </Button>
        <Link href="/" passHref className="block">
            <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                All Games
            </Button>
        </Link>
      </div>
    </div>
  );
}
