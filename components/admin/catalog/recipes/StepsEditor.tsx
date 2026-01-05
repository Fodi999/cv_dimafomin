"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface RecipeStep {
  id?: string;
  stepNumber: number;
  instructionPl?: string;
  instructionEn?: string;
  instructionRu?: string;
}

interface StepsEditorProps {
  recipeId: string;
  initialSteps?: RecipeStep[];
}

export function StepsEditor({ recipeId, initialSteps = [] }: StepsEditorProps) {
  const [steps, setSteps] = useState<RecipeStep[]>(initialSteps);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStep, setNewStep] = useState({
    instructionPl: '',
    instructionEn: '',
    instructionRu: '',
  });

  const handleAddStep = async () => {
    if (!newStep.instructionPl.trim()) {
      toast.error('Додайте опис кроку польською мовою');
      return;
    }

    try {
      const response = await fetch(`/api/admin/recipes/${recipeId}/steps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stepNumber: steps.length + 1,
          ...newStep,
        }),
      });

      if (!response.ok) throw new Error('Failed to add step');

      const addedStep = await response.json();
      setSteps([...steps, addedStep]);
      
      // Reset form
      setNewStep({ instructionPl: '', instructionEn: '', instructionRu: '' });
      setShowAddForm(false);
      
      toast.success('Крок додано');
    } catch (error) {
      console.error('Error adding step:', error);
      toast.error('Помилка при додаванні кроку');
    }
  };

  const handleRemoveStep = async (stepId: string) => {
    try {
      const response = await fetch(`/api/admin/recipes/${recipeId}/steps/${stepId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove step');

      setSteps(steps.filter(s => s.id !== stepId));
      toast.success('Крок видалено');
    } catch (error) {
      console.error('Error removing step:', error);
      toast.error('Помилка при видаленні кроку');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Кроки приготування
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {steps.length} кроків додано
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Додати крок
        </Button>
      </div>

      {/* Add Step Form */}
      {showAddForm && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 space-y-4">
          <div className="space-y-4">
            {/* Instruction PL */}
            <div className="space-y-2">
              <Label htmlFor="instruction-pl">🇵🇱 Опис кроку (Польська) *</Label>
              <Textarea
                id="instruction-pl"
                value={newStep.instructionPl}
                onChange={(e) => setNewStep({ ...newStep, instructionPl: e.target.value })}
                placeholder="Obierz ziemniaki i ugotuj je w osolonej wodzie..."
                rows={3}
              />
            </div>

            {/* Instruction EN */}
            <div className="space-y-2">
              <Label htmlFor="instruction-en">🇬🇧 Опис кроку (Англійська)</Label>
              <Textarea
                id="instruction-en"
                value={newStep.instructionEn}
                onChange={(e) => setNewStep({ ...newStep, instructionEn: e.target.value })}
                placeholder="Peel and boil the potatoes in salted water..."
                rows={3}
              />
            </div>

            {/* Instruction RU */}
            <div className="space-y-2">
              <Label htmlFor="instruction-ru">🇷🇺 Опис кроку (Російська)</Label>
              <Textarea
                id="instruction-ru"
                value={newStep.instructionRu}
                onChange={(e) => setNewStep({ ...newStep, instructionRu: e.target.value })}
                placeholder="Очистите картофель и отварите в подсоленной воде..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAddForm(false);
                setNewStep({ instructionPl: '', instructionEn: '', instructionRu: '' });
              }}
            >
              Скасувати
            </Button>
            <Button
              type="button"
              onClick={handleAddStep}
              disabled={!newStep.instructionPl.trim()}
            >
              Додати крок
            </Button>
          </div>
        </div>
      )}

      {/* Steps List */}
      {steps.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-2 border-dashed">
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            Кроків ще немає
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Натисніть "Додати крок" для початку
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.id || index}
              className="flex gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {/* Drag Handle */}
              <GripVertical className="w-5 h-5 text-gray-400 cursor-grab flex-shrink-0 mt-1" />
              
              {/* Step Number */}
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full flex items-center justify-center font-bold text-sm">
                {step.stepNumber}
              </div>
              
              {/* Step Content */}
              <div className="flex-1 space-y-2">
                {step.instructionPl && (
                  <p className="text-gray-900 dark:text-gray-100">
                    🇵🇱 {step.instructionPl}
                  </p>
                )}
                {step.instructionEn && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    🇬🇧 {step.instructionEn}
                  </p>
                )}
                {step.instructionRu && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    🇷🇺 {step.instructionRu}
                  </p>
                )}
              </div>
              
              {/* Delete */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => step.id && handleRemoveStep(step.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
