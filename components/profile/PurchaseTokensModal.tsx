// PurchaseTokensModal.tsx — модальне вікно покупки токенів

import { motion } from "framer-motion";
import { X, Coins, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PurchaseTokensModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  tokenAmount: number;
  onAmountChange: (amount: number) => void;
  onPurchase: () => void;
  isSaving: boolean;
  loadingBalance: boolean;
}

export function PurchaseTokensModal({
  isOpen,
  onClose,
  currentBalance,
  tokenAmount,
  onAmountChange,
  onPurchase,
  isSaving,
  loadingBalance,
}: PurchaseTokensModalProps) {
  if (!isOpen) return null;

  const pricePerToken = 0.10;
  const totalPrice = (tokenAmount / 10).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-4 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Купити токени</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Balance */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border-2 border-yellow-200">
            <p className="text-sm text-gray-600 mb-1">Поточний баланс</p>
            <p className="text-3xl font-bold text-gray-900">
              {loadingBalance ? "..." : currentBalance} токенів
            </p>
          </div>

          {/* Amount Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Оберіть кількість токенів
            </label>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[100, 500, 1000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => onAmountChange(amount)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    tokenAmount === amount
                      ? "border-orange-500 bg-orange-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <p className="text-2xl font-bold text-gray-900">{amount}</p>
                  <p className="text-xs text-gray-500">${(amount / 10).toFixed(2)}</p>
                </button>
              ))}
            </div>
            
            {/* Custom Amount */}
            <div>
              <label className="block text-xs text-gray-500 mb-2">Або введіть свою кількість</label>
              <Input
                type="number"
                min="10"
                step="10"
                value={tokenAmount}
                onChange={(e) => onAmountChange(Number(e.target.value))}
                className="text-lg font-semibold text-center"
              />
            </div>
          </div>

          {/* Price Display */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Токени:</span>
              <span className="font-semibold text-gray-900">{tokenAmount}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Ціна за токен:</span>
              <span className="font-semibold text-gray-900">${pricePerToken.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">Загальна сума:</span>
                <span className="text-2xl font-bold text-orange-600">
                  ${totalPrice}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Безпечна оплата</p>
              <p className="text-blue-700">Платіж буде оброблений через захищений шлюз</p>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-3xl flex gap-3">
          <Button
            onClick={onPurchase}
            disabled={isSaving || tokenAmount < 10}
            className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 h-12 text-lg shadow-md"
          >
            <Coins className="w-5 h-5 mr-2" />
            {isSaving ? "Обробка..." : `Купити за $${totalPrice}`}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            disabled={isSaving}
            className="px-8 h-12"
          >
            Скасувати
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
