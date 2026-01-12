/**
 * Auth Interceptor - Global 401 handler
 * Automatically clears auth data on 401 errors
 * NOTE: Does NOT redirect - use AuthContext.openAuthModal() instead
 */

export function clearAuthAndRedirect() {
  if (typeof window === 'undefined') return;
  
  console.log('🔐 [AuthInterceptor] Clearing auth data (Modal-First architecture)');
  
  // Clear ALL auth-related data from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');
  
  // 🔧 FIX: Don't redirect to /login (doesn't exist in Modal-First)
  // Instead, the app will show auth modal via useEffect in protected pages
  console.log('ℹ️ [AuthInterceptor] Auth cleared - app will show login modal');
}

/**
 * Enhanced fetch wrapper with automatic 401 handling
 * Use this instead of native fetch for authenticated requests
 */
export async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  try {
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (!token) {
      console.warn('⚠️ [authFetch] No token found');
      clearAuthAndRedirect();
      throw new Error('Unauthorized - no token');
    }
    
    // Add Authorization header
    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${token}`);
    
    // Make request
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    // ✅ Check error.code instead of HTTP status
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (errorData.error?.code === 'UNAUTHORIZED' || errorData.error?.code === 'TOKEN_EXPIRED') {
        console.error('❌ [authFetch] Authentication required - clearing session');
        clearAuthAndRedirect();
        throw new Error('Session expired');
      }
    }
    
    return response;
  } catch (error) {
    console.error('❌ [authFetch] Error:', error);
    throw error;
  }
}

/**
 * Check if token exists and is not expired (basic check)
 */
export function isTokenValid(): boolean {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    // Parse JWT payload (basic check)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    
    if (exp < now) {
      console.warn('⚠️ [isTokenValid] Token expired');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ [isTokenValid] Invalid token format:', error);
    return false;
  }
}
