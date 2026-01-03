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
  const [teams, setTeams] = useState<string[]>(['Team 1', 'Team 2']);
  const [roundTime, setRoundTime] = useState<number>(60);
  const [isCustomTime, setIsCustomTime] = useState(false);
  const [skipLimit, setSkipLimit] = useState<number>(3);
  const [totalRounds, setTotalRounds] = useState<number>(5);
  const [continueUntilClearWinner, setContinueUntilClearWinner] = useState<boolean>(false);
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
        title: "Minimum Teams Required",
        description: "You need at least 2 teams to play Taboo.",
        variant: "destructive",
      })
    }
  };

  const handleTeamNameChange = (index: number, newName: string) => {
    const newTeams = [...teams];
    newTeams[index] = newName;
    setTeams(newTeams);
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

    const filledTeams = teams.filter(t => t.trim());
    if (filledTeams.length < 2) {
      toast({
        title: "Not Enough Teams",
        description: "You need at least 2 teams to start the game.",
        variant: "destructive",
      })
      return;
    }

    dispatch({
      type: 'START_GAME',
      players: filledTeams,
      settings: {
        roundTime,
        skipLimit,
        totalRounds,
        continueUntilClearWinner,
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
        {/* Team Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" /> Teams
            </CardTitle>
            <CardDescription>Add 2-6 teams</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {teams.map((team, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder={`Team ${index + 1}`}
                    value={team}
                    onChange={(e) => handleTeamNameChange(index, e.target.value)}
                    className="flex-grow"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveTeam(index)}
                    disabled={teams.length <= 2}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              onClick={handleAddTeam}
              variant="outline"
              className="w-full"
              disabled={teams.length >= 6}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Team
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
              <Label>Total Rounds</Label>
              <Select value={String(totalRounds)} onValueChange={(value) => setTotalRounds(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select total rounds" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 rounds</SelectItem>
                  <SelectItem value="5">5 rounds</SelectItem>
                  <SelectItem value="7">7 rounds</SelectItem>
                  <SelectItem value="10">10 rounds</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="continueUntilClearWinner"
                checked={continueUntilClearWinner}
                onChange={(e) => setContinueUntilClearWinner(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="continueUntilClearWinner" className="text-sm cursor-pointer">
                Continue until clear winner
              </Label>
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
