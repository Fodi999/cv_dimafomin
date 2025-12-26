import { apiFetch } from './base';

export const walletApi = {
  // Get wallet balance (updated endpoint)
  getBalance: async (userId: string, token: string) => {
    return apiFetch(`/token-bank/me`, { token });
  },

  // Get transaction history (updated endpoint)
  getTransactions: async (userId: string, token: string, filters?: {
    limit?: number;
    offset?: number;
    type?: 'earned' | 'spent' | 'bonus' | 'purchase';
  }) => {
    const params = new URLSearchParams();
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.offset) params.append("offset", filters.offset.toString());
    if (filters?.type) params.append("type", filters.type);
    return apiFetch(`/token-bank/me/transactions?${params}`, { token });
  },

  // Purchase tokens
  purchaseTokens: async (userId: string, amount: number, paymentMethod: string, token: string) => {
    return apiFetch("/wallet/purchase", {
      method: "POST",
      token,
      body: JSON.stringify({ userId, amount, paymentMethod }),
    });
  },

  // Spend tokens
  spendTokens: async (userId: string, amount: number, reason: string, token: string) => {
    return apiFetch("/wallet/spend", {
      method: "POST",
      token,
      body: JSON.stringify({ userId, amount, reason }),
    });
  },
};
