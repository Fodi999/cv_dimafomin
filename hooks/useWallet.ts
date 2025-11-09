// useWallet.ts — хук для управління гаманцем токенів

import { useState, useEffect } from "react";
import { walletApi, academyApi } from "@/lib/api";
import type { Transaction } from "@/lib/profile-types";

interface UseWalletProps {
  userId?: string;
}

export function useWallet({ userId }: UseWalletProps) {
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [walletRetryCount, setWalletRetryCount] = useState(0);

  const loadWalletData = async () => {
    if (!userId) return;
    
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.warn("⚠️ No auth token found");
      return;
    }
    
    setLoadingWallet(true);
    try {
      const walletData = await walletApi.getBalance(userId, token);
      console.log("💰 Wallet data received:", walletData);
      
      const balance = (walletData as any)?.balance || (walletData as any)?.chefTokens || 0;
      const txs = (walletData as any)?.transactions || [];
      
      setWalletBalance(balance);
      setTransactions(txs);
      
      console.log(`✅ Wallet loaded: ${balance} tokens, ${txs.length} transactions`);
      
      if (balance === 0 && txs.length === 0) {
        console.warn("⚠️ User has empty wallet");
      }
    } catch (error: any) {
      console.error("Error loading wallet data:", error);
      
      if (error.status === 500 && error.message?.includes("Failed to create profile")) {
        console.warn("⚠️ Profile creation failed. Using default values.");
        setWalletBalance(0);
        setTransactions([]);
        
        if (walletRetryCount < 2) {
          setWalletRetryCount(prev => prev + 1);
          
          try {
            console.log(`🔄 Attempting to initialize profile (attempt ${walletRetryCount + 1}/2)...`);
            await academyApi.getProfile(userId, token);
            console.log("✅ Profile initialized, retrying wallet load in 2s...");
            
            setTimeout(() => {
              console.log("🔄 Retrying wallet load...");
              loadWalletData();
            }, 2000);
          } catch (profileError) {
            console.error("❌ Could not initialize profile:", profileError);
          }
        } else {
          console.warn("⚠️ Max retry attempts reached");
          setWalletRetryCount(0);
        }
      } else {
        setWalletBalance(0);
        setTransactions([]);
      }
    } finally {
      setLoadingWallet(false);
    }
  };

  const purchaseTokens = async (amount: number, paymentMethod: string = "card") => {
    if (!userId) return false;
    
    const token = localStorage.getItem("authToken");
    if (!token) return false;
    
    try {
      await walletApi.purchaseTokens(userId, amount, paymentMethod, token);
      await loadWalletData();
      return true;
    } catch (error) {
      console.error("Error purchasing tokens:", error);
      return false;
    }
  };

  const refreshWallet = () => {
    console.log("🔄 Manual wallet reload requested");
    setWalletRetryCount(0);
    loadWalletData();
  };

  useEffect(() => {
    if (userId) {
      loadWalletData();
    }
  }, [userId]);

  return {
    walletBalance,
    transactions,
    loadingWallet,
    walletRetryCount,
    loadWalletData,
    purchaseTokens,
    refreshWallet,
  };
}
