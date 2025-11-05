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
      alert("Будь ласка, оберіть файл зображення");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Розмір файлу не може перевищувати 5MB");
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
      // First, convert file to base64 or upload to temporary storage
      // Then use backend API endpoint for upload
      const reader = new FileReader();
      
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const base64Data = await base64Promise;
      
      // Use backend API to upload image
      const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app';
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        throw new Error("Ви не авторизовані");
      }

      // Upload via backend endpoint
      const response = await fetch(`${backendUrl}/api/upload/image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          imageUrl: base64Data,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || "Upload failed");
      }

      const data = await response.json();
      const imageUrl = data.data?.url || data.url;
      
      if (!imageUrl) {
        throw new Error("Не отримано URL зображення від сервера");
      }
      
      // Call parent callback with uploaded URL
      onUploadComplete(imageUrl);
      
      // Show success message
      alert("✅ Фото успішно завантажено!");
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage = error instanceof Error ? error.message : "Невідома помилка";
      alert(`❌ Помилка під час завантаження фото: ${errorMessage}`);
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
        JPG, PNG або WEBP. Макс. 5MB.
      </p>
    </div>
  );
}
