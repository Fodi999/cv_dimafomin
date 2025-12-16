"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useEffect, useState } from "react";

interface PriceHistoryEntry {
  pricePerUnit: number;
  currency: string;
  source: string;
  createdAt: string;
}

interface PriceTrendProps {
  itemId: string;
  currentPrice: number;
  unit: string;
  token: string;
}

export default function PriceTrend({ itemId, currentPrice, unit, token }: PriceTrendProps) {
  const [trend, setTrend] = useState<'up' | 'down' | 'stable' | null>(null);
  const [percentChange, setPercentChange] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      console.log('[PriceTrend] Fetching history for item:', itemId, 'Current price:', currentPrice);
      
      try {
        const response = await fetch(`/api/fridge/items/${itemId}/price/history`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error('[PriceTrend] Failed to fetch price history:', response.status);
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log('[PriceTrend] History data:', data);
        const history: PriceHistoryEntry[] = data.history || [];

        if (history.length < 2) {
          console.log('[PriceTrend] Not enough history entries:', history.length);
          setTrend('stable');
          setLoading(false);
          return;
        }

        // Сравниваем последнюю цену с предыдущей
        const latest = history[0].pricePerUnit;
        const previous = history[1].pricePerUnit;

        console.log('[PriceTrend] Comparing prices:', { latest, previous });

        const change = ((latest - previous) / previous) * 100;
        setPercentChange(Math.abs(change));

        console.log('[PriceTrend] Price change:', change.toFixed(2) + '%');

        if (change > 0.5) {
          setTrend('up');
        } else if (change < -0.5) {
          setTrend('down');
        } else {
          setTrend('stable');
        }

        setLoading(false);
      } catch (error) {
        console.error('[PriceTrend] Error fetching price history:', error);
        setLoading(false);
      }
    };

    if (token && itemId) {
      fetchHistory();
    }
  }, [itemId, token, currentPrice]); // ✅ Добавлена зависимость от currentPrice

  if (loading || !trend) {
    return null;
  }

  if (trend === 'stable') {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400">
        <Minus className="w-3 h-3" />
        <span>stabilna</span>
      </div>
    );
  }

  if (trend === 'up') {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 dark:bg-red-900/20 rounded text-xs text-red-600 dark:text-red-400 font-medium">
        <TrendingUp className="w-3 h-3" />
        <span>+{percentChange.toFixed(1)}%</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 dark:bg-green-900/20 rounded text-xs text-green-600 dark:text-green-400 font-medium">
      <TrendingDown className="w-3 h-3" />
      <span>-{percentChange.toFixed(1)}%</span>
    </div>
  );
}
