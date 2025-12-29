/**
 * Hook: useFridgeLosses
 * Purpose: Fetch and manage fridge loss history
 * Backend: GET /api/history/losses?days=30
 */

"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api/base";

interface LossEvent {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  loss: number; // PLN
  reason: "expired" | "damaged" | "spoiled" | "mistake";
  addedDate: string;
  expiryDate: string;
  context?: string;
}

interface LossSummary {
  products: number;
  totalLoss: number;
  avgLoss: number;
}

interface UseFridgeLossesReturn {
  losses: LossEvent[];
  summary: LossSummary;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Fetches loss history from backend
 * @param days Number of days to look back (default: 30)
 * @returns Loss events, summary, loading state
 */
export function useFridgeLosses(days: number = 30): UseFridgeLossesReturn {
  const [losses, setLosses] = useState<LossEvent[]>([]);
  const [summary, setSummary] = useState<LossSummary>({
    products: 0,
    totalLoss: 0,
    avgLoss: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLosses = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        // Silent fallback: no token, no data, no error noise
        setLosses([]);
        setSummary({ products: 0, totalLoss: 0, avgLoss: 0 });
        setLoading(false);
        return;
      }

      // Use apiFetch with proper token handling
      const data = await apiFetch<any>(`/history/losses?days=${days}`, {
        token,
        method: "GET",
      });

      console.log("[useFridgeLosses] 📦 Full API response:", data);
      console.log("[useFridgeLosses] 📦 data.events:", data.events);
      console.log("[useFridgeLosses] 📦 data.summary:", data.summary);

      // Parse response
      const events: LossEvent[] = data.events || [];
      const summaryData = data.summary || {};

      console.log("[useFridgeLosses] 📊 Parsed events:", events);
      console.log("[useFridgeLosses] 📊 Parsed summary:", summaryData);

      setLosses(events);
      setSummary({
        products: summaryData.totalProducts || events.length,
        totalLoss: summaryData.totalValue || events.reduce((sum, e) => sum + e.loss, 0),
        avgLoss: summaryData.avgValue || (events.length > 0 
          ? events.reduce((sum, e) => sum + e.loss, 0) / events.length 
          : 0),
      });
    } catch (err) {
      console.warn("[useFridgeLosses] Error (silent fallback):", err);
      setError(err instanceof Error ? err.message : "Failed to load losses");
      // Fallback: empty state (silent, no UI disruption)
      setLosses([]);
      setSummary({ products: 0, totalLoss: 0, avgLoss: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLosses();
  }, [days]);

  return {
    losses,
    summary,
    loading,
    error,
    refetch: fetchLosses,
  };
}
