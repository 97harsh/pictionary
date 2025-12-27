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
import { CATEGORIES } from '@/lib/words';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { X, Plus, Gamepad2, Settings } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';

type SetupScreenProps = {
  dispatch: React.Dispatch<any>;
};

export default function SetupScreen({ dispatch }: SetupScreenProps) {
  const [teams, setTeams] = useState<string[]>(['Team 1', 'Team 2']);
  const [roundTime, setRoundTime] = useState<number>(60);
  const [skipLimit, setSkipLimit] = useState<number>(3);
  const [winningScore, setWinningScore] = useState<number>(50);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(CATEGORIES);
  const [customWords, setCustomWords] = useState('');
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

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleStartGame = () => {
    const parsedCustomWords = customWords.split('\n').map(w => w.trim()).filter(Boolean);
    if (parsedCustomWords.length === 0 && selectedCategories.length === 0) {
      toast({
        title: 'No Words to Play With',
        description: 'Please select at least one category or add custom words.',
        variant: 'destructive',
      });
      return;
    }

    if (parsedCustomWords.length > 0 && parsedCustomWords.length < teams.length * 2) {
        toast({
            title: 'Not Enough Custom Words',
            description: `Please add at least ${teams.length * 2} custom words for a good game.`,
            variant: 'destructive',
          });
          return;
    }

    dispatch({
      type: 'START_GAME',
      teams: teams.map(t => t.trim()).filter(Boolean),
      settings: { roundTime, skipLimit, winningScore, categories: selectedCategories },
      customWords: parsedCustomWords,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tighter text-primary">PictoGame Master</h1>
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
            <Select onValueChange={value => setRoundTime(Number(value))} defaultValue={String(roundTime)}>
              <SelectTrigger id="round-time"><SelectValue placeholder="Select time" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 seconds</SelectItem>
                <SelectItem value="60">60 seconds</SelectItem>
                <SelectItem value="90">90 seconds</SelectItem>
              </SelectContent>
            </Select>
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
                <SelectItem value="30">30 points</SelectItem>
                <SelectItem value="50">50 points</SelectItem>
                <SelectItem value="100">100 points</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
          <Label className="text-lg font-semibold">Word Categories</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map(category => (
                  <div key={category} className="flex items-center space-x-2">
                      <Checkbox 
                          id={category} 
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => handleCategoryChange(category)}
                      />
                      <label htmlFor={category} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {category}
                      </label>
                  </div>
              ))}
          </div>
      </div>
      
      <div className="space-y-2">
          <Label htmlFor="custom-words" className="text-lg font-semibold">Or Add Custom Words</Label>
          <Textarea 
              id="custom-words"
              placeholder="Add your own words, one per line..."
              value={customWords}
              onChange={e => setCustomWords(e.target.value)}
              className="min-h-[100px]"
          />
          <p className="text-xs text-muted-foreground">If you add custom words, the selected categories will be ignored.</p>
      </div>

      <Button onClick={handleStartGame} size="lg" className="w-full text-lg bg-accent hover:bg-accent/90">
        Start Game
      </Button>
    </div>
  );
}
