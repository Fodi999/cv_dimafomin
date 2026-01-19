"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface RecipeImageUploadProps {
  recipeId: string;
  currentImageUrl?: string | null;
  onUploadSuccess?: (imageUrl: string) => void;
}

export function RecipeImageUpload({
  recipeId,
  currentImageUrl,
  onUploadSuccess,
}: RecipeImageUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.match(/^image\/(jpeg|png|webp)$/)) {
      toast.error("Nieprawidłowy format", {
        description: "Tylko JPEG, PNG, WEBP są dozwolone",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("Plik zbyt duży", {
        description: "Maksymalny rozmiar to 5MB",
      });
      return;
    }

    setFile(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file); // ✅ Backend expects "file", not "image"

      const token = localStorage.getItem("token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/admin/recipes/${recipeId}/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Upload failed" }));
        throw new Error(error.message || "Upload failed");
      }

      const data = await response.json();
      
      toast.success("Obraz przesłany pomyślnie!");
      
      if (onUploadSuccess && data.imageUrl) {
        onUploadSuccess(data.imageUrl);
      }

      // Clear preview
      setFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Błąd przesyłania", {
        description: error instanceof Error ? error.message : "Spróbuj ponownie",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayImage = preview || currentImageUrl;

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Obraz przepisu
          </h3>
        </div>

        {/* Image Preview */}
        <div className="relative aspect-[4/3] bg-muted rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/25">
          {displayImage ? (
            <img
              src={displayImage}
              alt="Recipe preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/images/recipe-placeholder.svg";
              }}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
              <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
              <p className="text-sm">Brak obrazu</p>
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />

          {!file ? (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              Wybierz obraz
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                type="button"
                className="flex-1"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Przesyłanie...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Prześlij
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isUploading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          {file && (
            <p className="text-xs text-muted-foreground text-center">
              {file.name} ({(file.size / 1024).toFixed(0)} KB)
            </p>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Obsługiwane formaty: JPEG, PNG, WEBP. Maksymalny rozmiar: 5MB
        </p>
      </div>
    </Card>
  );
}
