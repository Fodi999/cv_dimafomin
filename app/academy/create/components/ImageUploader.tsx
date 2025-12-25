"use client";

import { useState } from "react";
import { Upload, Loader2, Trash2 } from "lucide-react";

interface ImageUploaderProps {
  imagePreview: string;
  onImageChange: (url: string, preview: string) => void;
}

export default function ImageUploader({ imagePreview, onImageChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Будь ласка, завантажте зображення");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Максимальний розмір файлу - 5MB");
      return;
    }

    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const preview = reader.result as string;
        
        // Upload to server
        uploadToServer(file, preview);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error reading file:", error);
      alert("Помилка завантаження фото. Спробуйте ще раз.");
      setUploading(false);
    }
  };

  const uploadToServer = async (file: File, preview: string) => {
    try {
      const { uploadApi } = await import("@/lib/api");
      const token = localStorage.getItem("token");
      const result = await uploadApi.uploadImageFile(file, token || undefined);
      
      onImageChange(result.url, preview);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Помилка завантаження фото. Спробуйте ще раз.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onImageChange("", "");
  };

  return (
    <div>
      <label className="block text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
        <Upload className="w-5 h-5 text-purple-600" />
        Фото страви
      </label>
      
      {!imagePreview ? (
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-purple-400 transition-colors bg-gray-50 hover:bg-purple-50">
          <div className="flex flex-col items-center justify-center">
            {uploading ? (
              <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-3" />
            ) : (
              <Upload className="w-12 h-12 text-gray-400 mb-3" />
            )}
            <p className="mb-2 text-sm text-gray-600 font-medium">
              {uploading ? "Завантаження..." : "Клікніть для завантаження"}
            </p>
            <p className="text-xs text-gray-400">PNG, JPG (MAX. 5MB)</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
          />
        </label>
      ) : (
        <div className="relative rounded-2xl overflow-hidden">
          <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
          <button
            onClick={handleRemove}
            className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
            type="button"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
