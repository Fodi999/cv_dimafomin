"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface TokenPackage {
  id: string;
  tokens: number;
  price: number;
  currency: string;
  discount?: number;
  popular?: boolean;
  description?: string;
}

interface PurchaseTokenSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase?: (packageId: string, tokens: number, price: number) => Promise<void>;
  currentBalance?: number;
}

const TOKEN_PACKAGES: TokenPackage[] = [
  {
    id: "starter",
    tokens: 50,
    price: 4.99,
    currency: "USD",
    description: "Dla początkujących",
  },
  {
    id: "basic",
    tokens: 150,
    price: 12.99,
    currency: "USD",
    discount: 5,
    popular: true,
    description: "Popularne",
  },
  {
    id: "pro",
    tokens: 400,
    price: 29.99,
    currency: "USD",
    discount: 10,
    description: "Profesjonalne",
  },
  {
    id: "elite",
    tokens: 1000,
    price: 69.99,
    currency: "USD",
    discount: 15,
    description: "Elitarne",
  },
  {
    id: "mega",
    tokens: 2500,
    price: 149.99,
    currency: "USD",
    discount: 20,
    description: "Mega pakiet",
  },
];

export function PurchaseTokenSheet({
  isOpen,
  onClose,
  onPurchase,
  currentBalance = 0,
}: PurchaseTokenSheetProps) {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [purchaseStatus, setPurchaseStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handlePurchase = async (packageId: string) => {
    const pkg = TOKEN_PACKAGES.find((p) => p.id === packageId);
    if (!pkg || !onPurchase) return;

    setIsLoading(true);
    setSelectedPackage(packageId);

    try {
      await onPurchase(packageId, pkg.tokens, pkg.price);
      setPurchaseStatus("success");

      // Auto-close after 2 seconds
      setTimeout(() => {
        onClose();
        setPurchaseStatus("idle");
      }, 2000);
    } catch (error) {
      setPurchaseStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Błąd podczas zakupu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          />

          {/* Sliding Sheet */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-white dark:bg-neutral-950 z-50 shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-neutral-950 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                💰 Kup ChefTokens
              </h2>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Current Balance */}
              <div className="bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-950/30 dark:to-cyan-950/30 rounded-lg p-4 border border-sky-200 dark:border-sky-900">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Twoje saldo
                </p>
                <p className="text-3xl font-bold text-sky-600 dark:text-sky-400">
                  {currentBalance.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  ChefTokens dostępne
                </p>
              </div>

              {/* Token Packages */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Pakiety
                </h3>

                <div className="space-y-2">
                  {TOKEN_PACKAGES.map((pkg) => (
                    <motion.button
                      key={pkg.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePurchase(pkg.id)}
                      disabled={isLoading}
                      className={`w-full p-4 rounded-lg border-2 transition-all disabled:opacity-50 ${
                        selectedPackage === pkg.id && isLoading
                          ? "bg-sky-500/20 border-sky-500"
                          : pkg.popular
                          ? "bg-sky-50 dark:bg-sky-950/20 border-sky-300 dark:border-sky-800"
                          : "bg-white dark:bg-neutral-900 border-gray-200 dark:border-gray-800 hover:border-sky-300 dark:hover:border-sky-700"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 text-left">
                          {/* Package Header */}
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                              {pkg.tokens.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-500">
                              ChefTokens
                            </span>
                            {pkg.popular && (
                              <span className="inline-block px-2 py-0.5 bg-sky-500 text-white text-xs font-semibold rounded">
                                ⭐ Popular
                              </span>
                            )}
                          </div>

                          {/* Description */}
                          {pkg.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
                              {pkg.description}
                            </p>
                          )}

                          {/* Price Info */}
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                              ${pkg.price.toFixed(2)}
                            </span>
                            {pkg.discount && (
                              <span className="text-xs bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded font-semibold">
                                -{pkg.discount}%
                              </span>
                            )}
                          </div>

                          {/* Price per token */}
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            ${(pkg.price / pkg.tokens).toFixed(4)} za token
                          </p>
                        </div>

                        {/* Buy Button */}
                        <div className="flex-shrink-0">
                          {selectedPackage === pkg.id && isLoading ? (
                            <Loader2 className="w-5 h-5 text-sky-500 animate-spin" />
                          ) : purchaseStatus === "success" && selectedPackage === pkg.id ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                              <span className="text-sm font-semibold">→</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {purchaseStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-900 dark:text-red-300">
                      Błąd zakupu
                    </p>
                    <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                      {errorMessage}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Info Section */}
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Informacje
                </h3>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-start gap-2">
                    <span className="text-lg mt-0.5">✓</span>
                    <span>Tokeny dostępne natychmiast po zakupie</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-lg mt-0.5">✓</span>
                    <span>Bezpieczna płatność przez Stripe</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-lg mt-0.5">✓</span>
                    <span>Tokeny nigdy nie wygasają</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-lg mt-0.5">✓</span>
                    <span>Zwrot gwarancja w ciągu 24h</span>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  FAQ
                </h3>

                <div className="space-y-3 text-xs text-gray-600 dark:text-gray-400">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">
                      Gdzie są moje tokeny?
                    </p>
                    <p>
                      Tokeny pojawiają się w Twoim koszyku natychmiast po potwierdzeniu
                      płatności.
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">
                      Czy mogę je zwrócić?
                    </p>
                    <p>
                      Nieużyte tokeny można zwrócić w ciągu 24 godzin od zakupu bez
                      pytań.
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">
                      Jaki jest maksymalny limit?
                    </p>
                    <p>
                      Możesz posiadać maksymalnie 100 000 tokenów. Jeśli masz więcej, nie
                      możesz kupić więcej.
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Kupując tokeny, zgadzasz się na nasze{" "}
                  <button className="text-sky-600 dark:text-sky-400 hover:underline">
                    warunki usługi
                  </button>
                  . Transakcje są bezpieczne i szyfrowane.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
