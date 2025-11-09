// Avatar.tsx - Компонент для відображення аватара користувача

import Image from "next/image";
import { User } from "lucide-react";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  fallbackText?: string;
  className?: string;
  onClick?: () => void;
}

export function Avatar({
  src,
  alt = "Avatar",
  size = "md",
  fallbackText,
  className = "",
  onClick
}: AvatarProps) {
  const sizeClasses = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-16 h-16 text-xl",
    xl: "w-24 h-24 text-3xl"
  };

  const iconSizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  };

  const getInitials = (text?: string) => {
    if (!text) return "";
    const words = text.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const baseClasses = `${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center ${className}`;
  const clickableClasses = onClick ? "cursor-pointer hover:opacity-80 transition" : "";

  if (src) {
    return (
      <div className={`${baseClasses} ${clickableClasses}`} onClick={onClick}>
        <Image
          src={src}
          alt={alt}
          width={100}
          height={100}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  if (fallbackText) {
    return (
      <div
        className={`${baseClasses} ${clickableClasses} bg-gradient-to-br from-purple-400 to-pink-500 text-white font-bold`}
        onClick={onClick}
      >
        {getInitials(fallbackText)}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${clickableClasses} bg-gray-200 text-gray-500`}
      onClick={onClick}
    >
      <User className={iconSizes[size]} />
    </div>
  );
}
