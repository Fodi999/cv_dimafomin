/**
 * DifficultySelect - Select with level, icon, and color
 * Sorted by difficulty level (1 = easy, 3 = hard)
 */

"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetaDifficulty } from "@/lib/meta/types";

interface DifficultySelectProps {
  value: string;                    // difficulty: "easy", "medium", "hard"
  onChange: (difficulty: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export function DifficultySelect({
  value,
  onChange,
  required = false,
  disabled = false,
}: DifficultySelectProps) {
  const [difficulties, setDifficulties] = useState<MetaDifficulty[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch difficulties on mount
  useEffect(() => {
    const fetchDifficulties = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/meta/difficulties');
        if (!response.ok) throw new Error('Failed to fetch difficulties');
        const data = await response.json();
        
        // Sort by level
        const sorted = (data.difficulties || []).sort(
          (a: MetaDifficulty, b: MetaDifficulty) => a.level - b.level
        );
        
        setDifficulties(sorted);
      } catch (error) {
        console.error('Error fetching difficulties:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDifficulties();
  }, []);

  const selectedDifficulty = difficulties.find((d) => d.id === value);

  // Color mapping for badge
  const getColorClass = (color: string) => {
    switch (color) {
      case 'green':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'yellow':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'red':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="difficulty">
        Складність {required && <span className="text-red-500">*</span>}
      </Label>

      <Select 
        value={value} 
        onValueChange={onChange}
        disabled={disabled || isLoading}
      >
        <SelectTrigger id="difficulty">
          <SelectValue>
            {isLoading ? (
              "Завантаження..."
            ) : selectedDifficulty ? (
              <div className="flex items-center gap-2">
                <span>{selectedDifficulty.icon}</span>
                <span>{selectedDifficulty.namePL}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getColorClass(selectedDifficulty.color)}`}>
                  Level {selectedDifficulty.level}
                </span>
              </div>
            ) : (
              "Виберіть складність..."
            )}
          </SelectValue>
        </SelectTrigger>
        
        <SelectContent>
          {difficulties.map((difficulty) => (
            <SelectItem key={difficulty.id} value={difficulty.id}>
              <div className="flex items-center gap-2">
                <span>{difficulty.icon}</span>
                <span>{difficulty.namePL}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getColorClass(difficulty.color)}`}>
                  Level {difficulty.level}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
