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

  // Compress image before upload
  const compressImage = async (file: File): Promise<File> => {
    console.log("🔧 Starting image compression...", { originalSize: file.size });
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          
          // Scale down if image is too large
          const maxWidth = 800;
          const maxHeight = 800;
          
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Не вдалося отримати контекст Canvas"));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with quality 0.7
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Не вдалося створити Blob"));
                return;
              }
              
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              
              console.log("✅ Image compressed:", {
                originalSize: file.size,
                compressedSize: compressedFile.size,
                reduction: `${((1 - compressedFile.size / file.size) * 100).toFixed(1)}%`,
              });
              
              resolve(compressedFile);
            },
            "image/jpeg",
            0.7
          );
        };
        
        img.onerror = () => reject(new Error("Не вдалося завантажити зображення"));
        img.src = e.target?.result as string;
      };
      
      reader.onerror = () => reject(new Error("Не вдалося прочитати файл"));
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Будь ласка, оберіть файл зображення");
        return;
      }

      // Check initial size and compress if needed
      let fileToUpload = file;
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB (match backend limit)
      
      if (file.size > MAX_FILE_SIZE) {
        console.log(`⚠️ File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds limit, compressing...`);
        try {
          fileToUpload = await compressImage(file);
          
          // Check compressed size
          if (fileToUpload.size > MAX_FILE_SIZE) {
            const compressedSizeMB = (fileToUpload.size / (1024 * 1024)).toFixed(2);
            alert(`Навіть після стиснення файл занадто великий (${compressedSizeMB}MB). Спробуйте меншу картинку.`);
            return;
          }
        } catch (compressError) {
          console.error("❌ Compression failed:", compressError);
          alert(`Помилка при стисненні зображення: ${compressError instanceof Error ? compressError.message : "невідома помилка"}`);
          return;
        }
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(fileToUpload);

      // Upload to backend
      await uploadToCloudinary(fileToUpload);
    } catch (error) {
      console.error("❌ File selection error:", error);
      alert(`Помилка при виборі файлу: ${error instanceof Error ? error.message : "невідома помилка"}`);
    }
  };

  const uploadToCloudinary = async (file: File) => {
    setIsUploading(true);
    console.log("🚀 Starting avatar upload...", { fileName: file.name, fileSize: file.size, fileType: file.type });

    try {
      const token = localStorage.getItem("token");
      console.log("🔐 Auth token retrieved:", token ? "✓ Present" : "✗ Missing");
      
      if (!token) {
        throw new Error("Ви не авторизовані");
      }

      // Create FormData and append the file
      const formData = new FormData();
      formData.append("file", file);
      console.log("📦 FormData created with file");

      // Upload directly to backend
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api';
      console.log("🌐 Backend URL:", backendUrl);
      
      const uploadUrl = `${backendUrl}/user/avatar`;
      console.log("📤 Uploading directly to backend:", uploadUrl);
      console.log("🔑 Headers:", { Authorization: `Bearer ${token.substring(0, 20)}...` });
      
      console.log("⏳ Sending fetch request...");
      let response: Response;
      try {
        response = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formData,
        });
        console.log("✅ Fetch completed without error");
      } catch (fetchError) {
        console.error("❌ Fetch error (network/CORS issue):", fetchError);
        throw new Error(`Помилка мережі: ${fetchError instanceof Error ? fetchError.message : String(fetchError)}`);
      }

      console.log("📬 Response received:", { status: response.status, statusText: response.statusText, ok: response.ok });

      if (!response.ok) {
        console.error("❌ Response not OK, parsing error...");
        let errorData: any;
        try {
          errorData = await response.json();
          console.error("❌ Error response JSON:", errorData);
        } catch (e) {
          const text = await response.text();
          console.error("❌ Error response text:", text);
          errorData = { error: text };
        }
        throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`);
      }

      console.log("✅ Response OK, parsing JSON...");
      const data = await response.json();
      console.log("✅ Response data:", data);
      
      // Extract URL from response - handle different response formats
      const imageUrl = data.url || data.data?.url || data.secure_url;
      console.log("🖼️ Image URL extracted:", imageUrl);
      
      if (!imageUrl) {
        console.error("❌ No URL in response!");
        throw new Error("Не отримано URL зображення від сервера");
      }
      
      // Call parent callback with uploaded URL
      console.log("📞 Calling onUploadComplete with URL:", imageUrl);
      onUploadComplete(imageUrl);
      console.log("✨ Avatar upload completed successfully");
      
      // Show success message
      alert("✅ Фото успішно завантажено!");
    } catch (error) {
      console.error("❌ Upload error caught:", error);
      const errorMessage = error instanceof Error ? error.message : "Невідома помилка";
      console.error("💥 Error details:", errorMessage);
      console.error("🔍 Full error:", error);
      alert(`❌ Помилка під час завантаження фото: ${errorMessage}`);
      setPreview(null);
    } finally {
      setIsUploading(false);
      console.log("🏁 Upload process finished");
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
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-sky-500 to-cyan-600 dark:from-sky-500 dark:to-cyan-600 shadow-lg border-4 border-white dark:border-gray-800">
          {isImageUrl ? (
            <>
              {displayAvatar && displayAvatar.includes("res.cloudinary.com") ? (
                <img
                  src={displayAvatar}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={displayAvatar}
                  alt={userName}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              )}
              {preview && (
                <div className="absolute top-0 right-0 bg-sky-500 text-white text-xs px-2 py-1 rounded-bl-lg">
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
