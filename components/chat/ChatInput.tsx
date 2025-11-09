// ChatInput.tsx - Component for chat input with image upload

import { motion } from "framer-motion";
import { Send, Paperclip, X } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  disabled: boolean;
  isComplete: boolean;
  attachedImage: string | null;
  uploadingImage: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  onKeyPress,
  disabled,
  isComplete,
  attachedImage,
  uploadingImage,
  onImageUpload,
  onRemoveImage,
  fileInputRef,
}: ChatInputProps) {
  return (
    <div className="max-w-3xl mx-auto p-4 pb-6">
      {/* Image Preview */}
      {attachedImage && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 flex items-center gap-3 bg-orange-50 p-3 rounded-xl border border-orange-200"
        >
          <img 
            src={attachedImage} 
            alt="Preview" 
            className="w-16 h-16 object-cover rounded-lg border-2 border-orange-300 shadow-sm"
          />
          <span className="text-sm text-gray-600 flex-1">Прикріплено фото</span>
          <button
            onClick={onRemoveImage}
            className="text-gray-400 hover:text-red-500 transition p-1 rounded-lg hover:bg-red-50"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      )}

      {/* Input Bar */}
      <div className="flex items-center gap-3 border-2 border-gray-200 rounded-2xl px-4 py-3 shadow-md bg-white focus-within:border-orange-400 focus-within:shadow-lg transition-all">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          className="hidden"
        />
        
        {/* Paperclip Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploadingImage}
          className="text-gray-400 hover:text-orange-500 transition disabled:text-gray-300 p-2 rounded-lg hover:bg-orange-50 active:bg-orange-100"
          title="Прикріпити фото"
        >
          <Paperclip className="w-5 h-5" />
        </motion.button>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyPress}
          placeholder={isComplete 
            ? "Напишіть, що змінити або нову страву..." 
            : "Що будемо готувати сьогодні?"
          }
          disabled={disabled}
          className="flex-1 bg-transparent outline-none text-gray-800 placeholder:text-gray-400 text-[15px]"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onSend}
          disabled={!value.trim() || disabled}
          className="text-orange-500 hover:text-orange-600 transition disabled:text-gray-300 p-2 rounded-lg hover:bg-orange-50 active:bg-orange-100"
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </div>
      
      {/* Footer Info */}
      <p className="text-xs text-gray-400 mt-3 text-center">
        AI може помилятися. Перевіряйте важливу інформацію.
      </p>
    </div>
  );
}
