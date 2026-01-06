"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { createIngredient, type CreateIngredientPayload } from "@/lib/api/ingredients.api";
import { useLanguage } from "@/contexts/LanguageContext";

interface AddIngredientDialogProps {
  onCreated?: () => void;
}

export function AddIngredientDialog({ onCreated }: AddIngredientDialogProps) {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [inputName, setInputName] = useState("");
  const [category, setCategory] = useState<CreateIngredientPayload["category"]>("vegetable");
  const [unit, setUnit] = useState("g");

  const resetForm = () => {
    setInputName("");
    setCategory("vegetable");
    setUnit("g");
  };

  const handleSubmit = async () => {
    if (!inputName.trim()) {
      toast.error(t.admin.catalog.products.form.nameRequired || "Name is required");
      return;
    }

    try {
      setLoading(true);

      // Auto-detect language from current interface language
      // User doesn't need to select it manually anymore
      const inputLang = (language === "pl" || language === "en" || language === "ru") 
        ? language 
        : "pl"; // fallback to Polish

      await createIngredient({
        inputName: inputName.trim(),
        inputLang, // Backend still requires this field
        category,
        unit,
      });

      toast.success(
        t.admin.catalog.products.form.successMessage || "Product added and translated by AI"
      );
      
      setOpen(false);
      resetForm();
      
      // Trigger parent refetch
      if (onCreated) {
        onCreated();
      }
    } catch (error: any) {
      console.error("[AddIngredientDialog] Error:", error);
      toast.error(
        error?.message || t.admin.catalog.products.form.errorMessage || "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          {t.admin.catalog.products.addProduct}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t.admin.catalog.products.addProduct}</DialogTitle>
          <DialogDescription>
            {t.admin.catalog.products.form.description || "Enter product name in any language. AI will translate automatically (using current UI language as hint)."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Product Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">{t.admin.catalog.products.form.name}</Label>
            <Input
              id="name"
              placeholder={t.admin.catalog.products.form.namePlaceholder || "e.g. Arbuz, Watermelon, Арбуз"}
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Category */}
          <div className="grid gap-2">
            <Label htmlFor="category">{t.admin.catalog.products.table.category}</Label>
            <Select value={category} onValueChange={(value: any) => setCategory(value)} disabled={loading}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vegetable">🥦 {t.admin.catalog.products.categories.vegetables}</SelectItem>
                <SelectItem value="protein">🥩 {t.admin.catalog.products.categories.meat}</SelectItem>
                <SelectItem value="dairy">🥛 {t.admin.catalog.products.categories.dairy}</SelectItem>
                <SelectItem value="grain">🌾 {t.admin.catalog.products.categories.grains}</SelectItem>
                <SelectItem value="condiment">🧂 {t.admin.catalog.products.categories.condiment}</SelectItem>
                <SelectItem value="other">📦 {t.admin.catalog.products.categories.other}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Unit */}
          <div className="grid gap-2">
            <Label htmlFor="unit">{t.admin.catalog.products.table.unit}</Label>
            <Select value={unit} onValueChange={setUnit} disabled={loading}>
              <SelectTrigger id="unit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="g">g (gram)</SelectItem>
                <SelectItem value="kg">kg (kilogram)</SelectItem>
                <SelectItem value="ml">ml (milliliter)</SelectItem>
                <SelectItem value="l">l (liter)</SelectItem>
                <SelectItem value="pcs">pcs (pieces)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            {t.common.cancel}
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !inputName.trim()}>
            {loading ? (
              <>
                <span className="mr-2">⏳</span>
                {t.common.saving || "Creating..."}
              </>
            ) : (
              t.common.create
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
