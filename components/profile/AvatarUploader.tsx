"use client";

import { useState, useRef } from "react";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface AvatarUploaderProps {
  currentAvatar?: string;
  userName: string;
  onUploadComplete: (url: string) => void;
}

export default function AvatarUploader({
  currentAvatar,
  userName,
  onUploadComplete,
}: AvatarUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Proszę wybrać plik obrazu");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Rozmiar pliku nie może przekraczać 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    await uploadToCloudinary(file);
  };

  const uploadToCloudinary = async (file: File) => {
    setIsUploading(true);

    try {
      // Create FormData for Cloudinary upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "cv_sushi_chef");
      formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "");

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      
      // Call parent callback with uploaded URL
      onUploadComplete(data.secure_url);
      
      // Show success message
      alert("✅ Zdjęcie zostało pomyślnie przesłane!");
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      alert("❌ Błąd podczas przesyłania zdjęcia. Spróbuj ponownie.");
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayAvatar = preview || currentAvatar;
  const isImageUrl = displayAvatar && (
    displayAvatar.startsWith("http") || 
    displayAvatar.startsWith("blob:") || 
    displayAvatar.startsWith("data:")
  );

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar Display */}
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg border-4 border-white">
          {isImageUrl ? (
            <>
              <Image
                src={displayAvatar}
                alt={userName}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
              {preview && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl-lg">
                  Preview
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
              {userName.charAt(0).toUpperCase()}
              {userName.split(" ")[1]?.charAt(0).toUpperCase() || ""}
            </div>
          )}
        </div>

        {/* Upload Overlay */}
        <div
          onClick={handleClick}
          className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          ) : (
            <Camera className="w-8 h-8 text-white" />
          )}
        </div>

        {/* Remove Preview Button */}
        {preview && !isUploading && (
          <button
            onClick={handleRemovePreview}
            className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors shadow-lg"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Upload Button */}
      <Button
        onClick={handleClick}
        disabled={isUploading}
        variant="outline"
        className="gap-2"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Przesyłanie...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            Prześlij zdjęcie
          </>
        )}
      </Button>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Info Text */}
      <p className="text-xs text-gray-500 text-center max-w-xs">
        JPG, PNG lub WEBP. Maks. 5MB.
      </p>
    </div>
  );
}
