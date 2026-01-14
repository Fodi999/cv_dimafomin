/**
 * 🎯 UNIFIED API BASE URL HELPER
 * 
 * ПРАВИЛО: Используй ТОЛЬКО этот файл для получения backend URL
 * 
 * ❌ НЕ ДЕЛАЙ ТАК:
 * const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://...";
 * const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://...";
 * 
 * ✅ ДЕЛАЙ ТАК:
 * import { getBackendUrl } from '@/lib/api/backend-url';
 * const BACKEND_URL = getBackendUrl();
 */

/**
 * Get unified backend URL
 * 
 * Always uses Koyeb backend: https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app
 * 
 * @returns Backend base URL without /api suffix (added per-endpoint)
 */
export function getBackendUrl(): string {
  // КРИТИЧНО: ВСЕГДА используем Koyeb backend
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE || 'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app';
  
  // Remove trailing /api if present (we add it per-endpoint)
  return baseUrl.replace(/\/api$/, '');
}

/**
 * Get full backend URL with endpoint
 * 
 * @param endpoint - API endpoint (e.g., "/admin/ingredients")
 * @returns Full URL
 * 
 * @example
 * getFullBackendUrl('/admin/ingredients') 
 * // → "http://localhost:8080/api/admin/ingredients"
 */
export function getFullBackendUrl(endpoint: string): string {
  const base = getBackendUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${cleanEndpoint}`;
}
