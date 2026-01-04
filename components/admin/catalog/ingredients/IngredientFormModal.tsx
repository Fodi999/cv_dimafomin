"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ingredient } from "@/hooks/useIngredients";

interface IngredientFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ingredient: Ingredient | null;
  onSave: (data: Omit<Ingredient, "id">) => void;
}

const CATEGORIES = [
  { value: "meat", label: "М'ясо" },
  { value: "fish", label: "Риба" },
  { value: "vegetables", label: "Овочі" },
  { value: "fruits", label: "Фрукти" },
  { value: "dairy", label: "Молочні продукти" },
  { value: "grains", label: "Крупи" },
  { value: "spices", label: "Спеції" },
  { value: "other", label: "Інше" },
];

const UNITS = [
  { value: "g", label: "г (грами)" },
  { value: "kg", label: "кг (кілограми)" },
  { value: "ml", label: "мл (мілілітри)" },
  { value: "l", label: "л (літри)" },
  { value: "pcs", label: "шт (штуки)" },
  { value: "tbsp", label: "ст.л. (столові ложки)" },
  { value: "tsp", label: "ч.л. (чайні ложки)" },
];

export function IngredientFormModal({
  open,
  onOpenChange,
  ingredient,
  onSave,
}: IngredientFormModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");

  useEffect(() => {
    if (ingredient) {
      setName(ingredient.name);
      setCategory(ingredient.category);
      setUnit(ingredient.unit);
    } else {
      setName("");
      setCategory("");
      setUnit("");
    }
  }, [ingredient, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !category || !unit) {
      return;
    }

    onSave({
      name: name.trim(),
      category,
      unit,
    });
  };

  const isValid = name.trim() && category && unit;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {ingredient ? "Редагувати інгредієнт" : "Новий інгредієнт"}
          </DialogTitle>
          <DialogDescription>
            {ingredient
              ? "Оновіть дані інгредієнта"
              : "Додайте новий інгредієнт до бази"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Назва <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Лосось"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">
              Категорія <span className="text-red-500">*</span>
            </Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Оберіть категорію" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Unit */}
          <div className="space-y-2">
            <Label htmlFor="unit">
              Одиниця виміру <span className="text-red-500">*</span>
            </Label>
            <Select value={unit} onValueChange={setUnit} required>
              <SelectTrigger>
                <SelectValue placeholder="Оберіть одиницю" />
              </SelectTrigger>
              <SelectContent>
                {UNITS.map((u) => (
                  <SelectItem key={u.value} value={u.value}>
                    {u.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Скасувати
            </Button>
            <Button type="submit" disabled={!isValid}>
              {ingredient ? "Зберегти" : "Створити"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
