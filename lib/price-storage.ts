/**
 * MVP: Local price storage fallback
 * Since backend doesn't store/return price data yet, we store it locally
 * This is a TEMPORARY solution until backend implements price handling
 */

interface ItemPrice {
  pricePerUnit: number;
  priceUnit: string;
  totalPrice: number;
  timestamp: number;
}

const STORAGE_KEY = 'fridge_item_prices';

export const priceStorage = {
  /**
   * Save price data for an item
   */
  savePrice(itemId: string, data: Omit<ItemPrice, 'timestamp'>) {
    try {
      const storage = this.getAllPrices();
      storage[itemId] = {
        ...data,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
      console.log('[PriceStorage] 💾 Saved price for item:', itemId, data);
    } catch (err) {
      console.error('[PriceStorage] Failed to save price:', err);
    }
  },

  /**
   * Get price data for an item
   */
  getPrice(itemId: string): ItemPrice | null {
    try {
      const storage = this.getAllPrices();
      return storage[itemId] || null;
    } catch (err) {
      console.error('[PriceStorage] Failed to get price:', err);
      return null;
    }
  },

  /**
   * Get all stored prices
   */
  getAllPrices(): Record<string, ItemPrice> {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (err) {
      console.error('[PriceStorage] Failed to get all prices:', err);
      return {};
    }
  },

  /**
   * Remove price data for an item
   */
  removePrice(itemId: string) {
    try {
      const storage = this.getAllPrices();
      delete storage[itemId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
      console.log('[PriceStorage] 🗑️ Removed price for item:', itemId);
    } catch (err) {
      console.error('[PriceStorage] Failed to remove price:', err);
    }
  },

  /**
   * Clear all price data
   */
  clearAll() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log('[PriceStorage] 🗑️ Cleared all prices');
    } catch (err) {
      console.error('[PriceStorage] Failed to clear prices:', err);
    }
  },
};
