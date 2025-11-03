"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PurchaseButtonProps {
  recipeId: string;
  price: number;
  isPurchased?: boolean;
}

export default function PurchaseButton({
  recipeId,
  price,
  isPurchased = false,
}: PurchaseButtonProps) {
  const [purchased, setPurchased] = useState(isPurchased);
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    
    // TODO: API call to purchase recipe
    // await fetch('/api/purchase', { method: 'POST', body: JSON.stringify({ recipeId }) });
    
    setTimeout(() => {
      setPurchased(true);
      setLoading(false);
    }, 1000);
  };

  if (purchased) {
    return (
      <Button
        disabled
        className="w-full bg-green-500 text-white cursor-not-allowed"
      >
        <Check className="w-4 h-4 mr-2" />
        Придбано
      </Button>
    );
  }

  return (
    <Button
      onClick={handlePurchase}
      disabled={loading}
      className="w-full bg-gradient-to-r from-[#3BC864] to-[#C5E98A] text-white hover:opacity-90"
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          Обробка...
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4 mr-2" />
          Купити за {price} zł
        </>
      )}
    </Button>
  );
}
