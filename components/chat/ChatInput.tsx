// ChatInput.tsx - Component for chat input with image upload

import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip, X, Gem, AlertCircle, Coins } from "lucide-react";
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
  tokenCount?: number;
  onTokenClick?: () => void;
  requestCost?: number; // NEW: Cost of current AI request
  requestType?: string; // NEW: Type of request (basic/advanced/expert)
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
  tokenCount = 0,
  onTokenClick,
  requestCost = 10,
  requestType = 'basic',
}: ChatInputProps) {
  const hasInsufficientTokens = tokenCount < requestCost;
  
  const getRequestTypeColor = () => {
    switch (requestType) {
      case 'expert':
        return 'text-purple-500 bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800';
      case 'advanced':
        return 'text-blue-500 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800';
      default:
        return 'text-green-500 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800';
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-0 sm:px-4 py-1 sm:py-2 space-y-2"
>
      {/* Cost & Warning Banner */}
      <AnimatePresence>
        {value.trim() && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className={`flex items-center justify-between p-2 sm:p-3 rounded-xl border ${
              hasInsufficientTokens 
                ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800' 
                : getRequestTypeColor()
            }`}>
              <div className="flex items-center gap-2 flex-1">
                {hasInsufficientTokens ? (
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                ) : (
                  <Coins className="w-4 h-4 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs sm:text-sm font-semibold ${
                    hasInsufficientTokens ? 'text-red-600 dark:text-red-400' : ''
                  }`}>
                    {hasInsufficientTokens ? (
                      'Недостатньо токенів!'
                    ) : (
                      `Вартість запиту: ${requestCost} CT`
                    )}
                  </p>
                  {hasInsufficientTokens && (
                    <p className="text-[10px] sm:text-xs text-red-500 dark:text-red-400 mt-0.5">
                      Потрібно: {requestCost} CT, є: {tokenCount} CT
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold uppercase ${
                  hasInsufficientTokens 
                    ? 'bg-red-200 dark:bg-red-900/50 text-red-700 dark:text-red-300'
                    : 'bg-white/50 dark:bg-black/20'
                }`}>
                  {requestType}
                </span>
                {hasInsufficientTokens && onTokenClick && (
                  <button
                    onClick={onTokenClick}
                    className="text-[10px] sm:text-xs px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold transition-colors"
                  >
                    Купити
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Image Preview */}
      {attachedImage && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3 bg-sky-50 dark:bg-sky-950/30 p-2 sm:p-3 rounded-xl border border-sky-200 dark:border-sky-800/50"
        >
          <img 
            src={attachedImage} 
            alt="Preview" 
            className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border-2 border-sky-300 dark:border-sky-700 shadow-sm"
          />
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex-1">Прикріплено фото</span>
          <button
            onClick={onRemoveImage}
            className="text-gray-400 dark:text-gray-500 hover:text-rose-500 dark:hover:text-rose-400 transition p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </motion.div>
      )}

      {/* Input Bar */}
      <div className="flex items-center gap-1.5 sm:gap-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl px-2 sm:px-4 py-2 sm:py-3 shadow-md bg-white dark:bg-gray-900 focus-within:border-sky-400 dark:focus-within:border-sky-500 focus-within:shadow-lg dark:focus-within:shadow-sky-500/20 transition-all">
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
          className="text-gray-400 dark:text-gray-500 hover:text-sky-500 dark:hover:text-sky-400 transition disabled:text-gray-300 dark:disabled:text-gray-600 p-1 sm:p-2 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-950/30 active:bg-sky-100 dark:active:bg-sky-900/40"
          title="Прикріпити фото"
        >
          <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
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
          className="flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm sm:text-[15px]"
        />

        {/* Token Button */}
        {onTokenClick && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onTokenClick}
            className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition p-1 sm:p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 active:bg-blue-100 dark:active:bg-blue-900/40 flex items-center gap-0.5 sm:gap-1"
            title="Показати баланс токенів"
          >
            <Gem className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xs font-semibold">{tokenCount}</span>
          </motion.button>
        )}

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onSend}
          disabled={!value.trim() || disabled}
          className="text-sky-500 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-300 transition disabled:text-gray-300 dark:disabled:text-gray-600 p-1 sm:p-2 rounded-lg hover:bg-sky-50 dark:hover:bg-sky-950/30 active:bg-sky-100 dark:active:bg-sky-900/40"
        >
          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>
      </div>
      
      {/* Footer Info */}
      <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-1.5 sm:mt-2 mb-1 sm:mb-2 text-center px-2">
        AI може помилятися. Перевіряйте важливу інформацію.
      </p>
    </div>
  );
}
