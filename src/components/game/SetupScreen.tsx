
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
import { useToast } from '@/hooks/use-toast';
import { X, Plus, Gamepad2, Settings, BookOpen, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import CategorySelectionScreen from './CategorySelectionScreen';
import type { SelectedCategories } from '@/lib/words';
import Link from 'next/link';


type SetupScreenProps = {
  dispatch: React.Dispatch<any>;
};

export default function SetupScreen({ dispatch }: SetupScreenProps) {
  const [teams, setTeams] = useState<string[]>(['Team 1', 'Team 2']);
  const [roundTime, setRoundTime] = useState<number>(60);
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [skipLimit, setSkipLimit] = useState<number>(3);
  const [winningScore, setWinningScore] = useState<number>(50);
  const [totalRounds, setTotalRounds] = useState<number>(5);
  const [isCustomRounds, setIsCustomRounds] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<SelectedCategories>({
    'General': { difficulty: 'Beginner', subcategories: ['Objects', 'Actions'] },
  });
  const [isCategoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddTeam = () => {
    if (teams.length < 6) {
      setTeams([...teams, `Team ${teams.length + 1}`]);
    } else {
      toast({
        title: "Team Limit Reached",
        description: "You can have a maximum of 6 teams.",
        variant: "destructive",
      })
    }
  };

  const handleRemoveTeam = (index: number) => {
    if (teams.length > 2) {
      setTeams(teams.filter((_, i) => i !== index));
    } else {
      toast({
        title: "Minimum Teams",
        description: "You need at least 2 teams to play.",
        variant: "destructive",
      })
    }
  };

  const handleTeamNameChange = (index: number, name: string) => {
    const newTeams = [...teams];
    newTeams[index] = name;
    setTeams(newTeams);
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

    if (isCustomRounds && (totalRounds <= 0 || isNaN(totalRounds))) {
        toast({
            title: 'Invalid Custom Rounds',
            description: 'Please enter a valid number of rounds.',
            variant: 'destructive'
        });
        return;
    }

    dispatch({
      type: 'START_GAME',
      teams: teams.map(t => t.trim()).filter(Boolean),
      settings: { roundTime, skipLimit, winningScore, totalRounds, categories: selectedCategories },
    });
  };

  const handleRoundsChange = (value: string) => {
    if (value === 'custom') {
      setIsCustomRounds(true);
    } else if (value === 'unlimited') {
      setIsCustomRounds(false);
      setTotalRounds(0);
    } else {
      setIsCustomRounds(false);
      setTotalRounds(Number(value));
    }
  };

  const selectedSubcategoryCount = Object.values(selectedCategories).reduce((acc, cat) => acc + (cat.subcategories?.length || 0), 0);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tighter text-primary">Offline Pictionary</h1>
        <p className="text-muted-foreground">Your digital assistant for Pictionary!</p>
      </div>
      
      <div className="space-y-4">
        <Label className="text-lg font-semibold flex items-center gap-2"><Gamepad2 className="h-5 w-5" /> Teams</Label>
        <div className="space-y-3">
          {teams.map((team, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                type="text"
                value={team}
                onChange={e => handleTeamNameChange(index, e.target.value)}
                placeholder={`Team ${index + 1} Name`}
                className="bg-background/50"
              />
              <Button variant="ghost" size="icon" onClick={() => handleRemoveTeam(index)} disabled={teams.length <= 2}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={handleAddTeam} disabled={teams.length >= 6}>
          <Plus className="mr-2 h-4 w-4" /> Add Team
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
          <div className="space-y-2">
            <Label htmlFor="winning-score">Winning Score</Label>
             <Select onValueChange={value => setWinningScore(Number(value))} defaultValue={String(winningScore)}>
              <SelectTrigger id="winning-score"><SelectValue placeholder="Select score" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Disabled (play by rounds)</SelectItem>
                <SelectItem value="30">30 points</SelectItem>
                <SelectItem value="50">50 points</SelectItem>
                <SelectItem value="100">100 points</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="total-rounds">Total Rounds</Label>
            <Select onValueChange={handleRoundsChange} defaultValue={String(totalRounds)}>
              <SelectTrigger id="total-rounds"><SelectValue placeholder="Select rounds" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Unlimited (play by score)</SelectItem>
                <SelectItem value="3">3 rounds</SelectItem>
                <SelectItem value="5">5 rounds</SelectItem>
                <SelectItem value="7">7 rounds</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            {isCustomRounds && (
                <Input
                    type="number"
                    placeholder="Number of rounds"
                    value={totalRounds}
                    onChange={(e) => setTotalRounds(Number(e.target.value))}
                    className="mt-2"
                />
            )}
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
