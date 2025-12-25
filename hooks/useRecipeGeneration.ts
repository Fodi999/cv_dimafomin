// useRecipeGeneration.ts - Hook for managing recipe generation and image upload

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

interface RecipeData {
  title: string;
  description?: string;
  ingredients?: Array<{ name: string; amount: string }>;
  steps?: string[];
  cookingTime?: number;
  servings?: number;
  difficulty?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  [key: string]: any;
}

interface UseRecipeGenerationReturn {
  // State
  generatedRecipe: RecipeData | null;
  recipeImage: string | null;
  attachedImage: string | null;
  uploadingImage: boolean;
  isComplete: boolean;
  expandedSections: {
    ingredients: boolean;
    steps: boolean;
  };
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  
  // Actions
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  removeAttachedImage: () => void;
  setRecipeFromAI: (recipe: RecipeData) => void;
  markRecipeComplete: () => void;
  toggleSection: (section: 'ingredients' | 'steps') => void;
  publishRecipe: () => Promise<void>;
  resetRecipe: () => void;
}

const API_BASE_URL = "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api";

export function useRecipeGeneration(): UseRecipeGenerationReturn {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [generatedRecipe, setGeneratedRecipe] = useState<RecipeData | null>(null);
  const [recipeImage, setRecipeImage] = useState<string | null>(null);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    ingredients: false,
    steps: false
  });

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Будь ласка, завантажте зображення");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Максимальний розмір файлу - 5MB");
      return;
    }

    setUploadingImage(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Помилка завантаження фото");
    } finally {
      setUploadingImage(false);
    }
  }, []);

  const removeAttachedImage = useCallback(() => {
    setAttachedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const setRecipeFromAI = useCallback((recipe: RecipeData) => {
    setGeneratedRecipe(recipe);
  }, []);

  const markRecipeComplete = useCallback(() => {
    setIsComplete(true);
  }, []);

  const toggleSection = useCallback((section: 'ingredients' | 'steps') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  const publishRecipe = useCallback(async () => {
    if (!generatedRecipe) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(generatedRecipe),
      });

      if (response.ok) {
        const data = await response.json();
        const recipeId = data.data?.id || data.id;
        
        // Upload image if available
        if (recipeImage && recipeId) {
          try {
            await fetch(`${API_BASE_URL}/ai/recipes/${recipeId}/image`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ imageUrl: recipeImage }),
            });
          } catch (imgError) {
            console.error("Error uploading image:", imgError);
            // Continue even if image upload fails
          }
        }
        
        router.push("/academy/community?tab=feed");
      } else {
        alert("Помилка публікації рецепту");
      }
    } catch (error) {
      console.error("Error publishing recipe:", error);
      alert("Помилка публікації");
    }
  }, [generatedRecipe, recipeImage, router]);

  const resetRecipe = useCallback(() => {
    setGeneratedRecipe(null);
    setRecipeImage(null);
    setAttachedImage(null);
    setIsComplete(false);
    setExpandedSections({
      ingredients: false,
      steps: false
    });
  }, []);

  return {
    generatedRecipe,
    recipeImage,
    attachedImage,
    uploadingImage,
    isComplete,
    expandedSections,
    fileInputRef,
    handleImageUpload,
    removeAttachedImage,
    setRecipeFromAI,
    markRecipeComplete,
    toggleSection,
    publishRecipe,
    resetRecipe,
  };
}
