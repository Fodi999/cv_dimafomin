// ChatInput.tsx - Component for chat input with image upload

import { motion } from "framer-motion";
import { Send, Paperclip, X } from "lucide-react";
import { animations } from "@/lib/design-tokens";

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
          className="mb-3 flex items-center gap-3 bg-sky-50 dark:bg-sky-950/30 p-3 rounded-xl border border-sky-200 dark:border-sky-800/50"
        >
          <img 
            src={attachedImage} 
            alt="Preview" 
            className="w-16 h-16 object-cover rounded-lg border-2 border-sky-300 dark:border-sky-700 shadow-sm"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400 flex-1">Прикріплено фото</span>
          <button
            onClick={onRemoveImage}
            className="text-gray-400 dark:text-gray-500 hover:text-rose-500 dark:hover:text-rose-400 transition p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
          >
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      )}

      {/* Input Bar */}
      <div className="flex items-center gap-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 shadow-md bg-white dark:bg-gray-900 focus-within:border-sky-400 dark:focus-within:border-sky-500 focus-within:shadow-lg dark:focus-within:shadow-sky-500/20 transition-all">
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
          className="text-gray-400 dark:text-gray-500 hover:text-sky-500 dark:hover:text-sky-400 transition disabled:text-gray-300 dark:disabled:text-gray-600 p-2 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-950/30 active:bg-sky-100 dark:active:bg-sky-900/40"
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
          className="flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-[15px]"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onSend}
          disabled={!value.trim() || disabled}
          className="text-sky-500 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-300 transition disabled:text-gray-300 dark:disabled:text-gray-600 p-2 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-950/30 active:bg-sky-100 dark:active:bg-sky-900/40"
        >
          <Send className="w-5 h-5" />
        </motion.button>
      </div>
      
      {/* Footer Info */}
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">
        AI може помилятися. Перевіряйте важливу інформацію.
      </p>
    </div>
  );
}
