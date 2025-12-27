
"use client";

import React, { useState, useMemo } from 'react';
import { WORDS, type SelectedCategories, type Difficulty } from '@/lib/words';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import CategoryIcon from '../icons/CategoryIcon';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type CategorySelectionScreenProps = {
  initialSelection: SelectedCategories;
  onSave: (selection: SelectedCategories) => void;
};

export default function CategorySelectionScreen({ initialSelection, onSave }: CategorySelectionScreenProps) {
  const [selection, setSelection] = useState<SelectedCategories>(initialSelection);
  const mainCategories = useMemo(() => Object.keys(WORDS), []);
  const { toast } = useToast();

  const handleDifficultyChange = (mainCategory: string, difficulty: Difficulty) => {
    if (!difficulty) return;
    setSelection(prev => {
        const newSelection = { ...prev };
        if (newSelection[mainCategory]) {
            newSelection[mainCategory] = {
                ...newSelection[mainCategory],
                difficulty,
            };
        } else {
             newSelection[mainCategory] = {
                difficulty,
                subcategories: [],
            };
        }
        return newSelection;
    });
  };

  const handleSubcategoryChange = (mainCategory: string, subcategory: string) => {
    setSelection(prev => {
      const newSelection = { ...prev };
      const mainCatSelection = newSelection[mainCategory] || { difficulty: 'Beginner', subcategories: [] };
      
      const subcategories = mainCatSelection.subcategories || [];
      const isCurrentlySelected = subcategories.includes(subcategory);
      
      const newSubcategories = isCurrentlySelected
        ? subcategories.filter(sc => sc !== subcategory)
        : [...subcategories, subcategory];
      
      if (newSubcategories.length === 0 && !mainCatSelection.difficulty) {
        delete newSelection[mainCategory];
      } else {
        newSelection[mainCategory] = { ...mainCatSelection, subcategories: newSubcategories };
      }
      
      return newSelection;
    });
  };

  const handleSave = () => {
    const totalSelected = Object.values(selection).reduce((acc, val) => acc + (val.subcategories?.length || 0), 0);
    if (totalSelected === 0) {
        toast({
            title: "No Categories Selected",
            description: "Please select at least one subcategory to start the game.",
            variant: "destructive",
        })
        return;
    }
    const cleanedSelection = Object.entries(selection).reduce((acc, [key, value]) => {
        if(value.subcategories && value.subcategories.length > 0) {
            acc[key] = value;
        }
        return acc;
    }, {} as SelectedCategories)
    onSave(cleanedSelection);
  };
  
  return (
    <div className="space-y-6 h-full flex flex-col">
      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full"
      >
        <CarouselContent>
          {mainCategories.map(mainCategory => {
            const subcategories = Object.keys(WORDS[mainCategory]);
            const currentSelection = selection[mainCategory];
            const currentDifficulty = currentSelection?.difficulty || 'Beginner';
            const selectedSubcategories = currentSelection?.subcategories || [];

            return (
              <CarouselItem key={mainCategory} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-xl font-medium flex items-center gap-2">
                         <CategoryIcon category={mainCategory} /> {mainCategory}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium">Difficulty</Label>
                          <ToggleGroup
                            type="single"
                            defaultValue="Beginner"
                            value={currentDifficulty}
                            onValueChange={(value: Difficulty) => handleDifficultyChange(mainCategory, value)}
                            className="grid grid-cols-2 mt-1"
                          >
                            <ToggleGroupItem value="Beginner" aria-label="Toggle Beginner">
                              Beginner
                            </ToggleGroupItem>
                            <ToggleGroupItem value="Advanced" aria-label="Toggle Advanced">
                              Advanced
                            </ToggleGroupItem>
                          </ToggleGroup>
                        </div>
                        
                        <div className="space-y-2">
                           <Label className="text-sm font-medium">Subcategories</Label>
                           <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                            {subcategories.map(sub => (
                                <div 
                                    key={sub}
                                    onClick={() => handleSubcategoryChange(mainCategory, sub)}
                                    className={cn(
                                        "flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors",
                                        selectedSubcategories.includes(sub) ? "bg-accent/20" : "hover:bg-muted"
                                    )}
                                >
                                    <Checkbox
                                      id={`${mainCategory}-${sub}`}
                                      checked={selectedSubcategories.includes(sub)}
                                      readOnly
                                    />
                                    <label
                                      htmlFor={`${mainCategory}-${sub}`}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-grow cursor-pointer"
                                    >
                                      {sub}
                                    </label>
                                     {selectedSubcategories.includes(sub) && <CheckCircle2 className="h-4 w-4 text-accent" />}
                                </div>
                            ))}
                           </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="mt-auto pt-4">
        <Button onClick={handleSave} className="w-full" size="lg">Save Selection</Button>
      </div>
    </div>
  );
}
