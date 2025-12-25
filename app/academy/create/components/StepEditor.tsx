"use client";

import { Plus, Trash2, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepEditorProps {
  steps: string[];
  onChange: (steps: string[]) => void;
}

export default function StepEditor({ steps, onChange }: StepEditorProps) {
  const addStep = () => {
    onChange([...steps, ""]);
  };

  const removeStep = (index: number) => {
    onChange(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, value: string) => {
    onChange(steps.map((item, i) => (i === index ? value : item)));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <ChefHat className="w-4 h-4 text-purple-600" />
          Кроки приготування
        </label>
        <Button
          onClick={addStep}
          variant="outline"
          size="sm"
          className="text-purple-600 border-purple-600 hover:bg-purple-50"
          type="button"
        >
          <Plus className="w-4 h-4 mr-1" />
          Додати крок
        </Button>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm mt-2">
              {index + 1}
            </div>
            <textarea
              value={step}
              onChange={(e) => updateStep(index, e.target.value)}
              placeholder={`Крок ${index + 1}...`}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none resize-none"
              rows={2}
            />
            <button
              onClick={() => removeStep(index)}
              className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-2"
              type="button"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {steps.length === 0 && (
        <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-sm">Додайте перший крок приготування</p>
        </div>
      )}
    </div>
  );
}
