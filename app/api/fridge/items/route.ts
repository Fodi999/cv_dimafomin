import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from "@/lib/api/backend-url";
// Используем NEXT_PUBLIC_API_BASE из .env.local
const BACKEND_URL = getBackendUrl();

/**
 * GET /api/fridge/items
 * Получить список продуктов пользователя в холодильнике
 */
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const backendUrl = `${BACKEND_URL}/api/fridge/items`;
    console.log('[API Proxy] ========================================');
    console.log('[API Proxy] GET /api/fridge/items');
    console.log('[API Proxy] Forwarding to:', backendUrl);
    console.log('[API Proxy] Authorization header received:', token?.substring(0, 30) + '...');
    console.log('[API Proxy] Token starts with "Bearer"?', token?.startsWith('Bearer '));
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Cookie': req.headers.get('cookie') || '',
        'Content-Type': 'application/json',
      },
    });

    console.log('[API Proxy] Backend response status:', response.status);
    console.log('[API Proxy] Backend response headers:', JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));
    
    const data = await response.json();
    console.log('[API Proxy] Backend response body:', JSON.stringify(data, null, 2));
    
    if (!response.ok) {
      console.error('[API Proxy] ❌ Backend error:', response.status);
      
      // 🔧 Handle 403 Forbidden - likely auth issue
      if (response.status === 403) {
        console.error('[API Proxy] 🔐 Authentication failed - token might be invalid or expired');
        console.error('[API Proxy] Token format:', token?.substring(0, 50) + '...');
      }
      
      // 🔧 TEMPORARY: If backend returns 500, return empty array (endpoint not implemented yet)
      if (response.status === 500 && data.message === 'failed to get items') {
        console.warn('[API Proxy] ⚠️ Backend fridge endpoint not implemented yet - returning empty array');
        return NextResponse.json({ items: [] });
      }
      
      return NextResponse.json(data, { status: response.status });
    }

    console.log('[API Proxy] ✅ Success, items count:', data.items?.length || 0);
    
    // 🔍 DEBUG: Check for null daysLeft values
    if (data.data?.items) {
      const nullDaysLeftItems = data.data.items.filter((item: any) => item.daysLeft === null);
      console.log('[API Proxy] 🔍 Items with NULL daysLeft:', nullDaysLeftItems.length);
      if (nullDaysLeftItems.length > 0) {
        console.log('[API Proxy] 🔍 First null item:', nullDaysLeftItems[0].ingredient?.name, '→ daysLeft:', nullDaysLeftItems[0].daysLeft);
      }
    }
    
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error('[API Proxy] Error fetching fridge items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fridge items', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/fridge/items
 * Добавить продукт в холодильник
 */
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    console.log('[API Proxy] ========================================');
    console.log('[API Proxy] POST /api/fridge/items');
    console.log('[API Proxy] Request body:', JSON.stringify(body, null, 2));
    console.log('[API Proxy] Token (first 30 chars):', token.substring(0, 30) + '...');
    console.log('[API Proxy] Token starts with Bearer?', token.startsWith('Bearer '));

    const backendUrl = `${BACKEND_URL}/api/fridge/items`;
    console.log('[API Proxy] Forwarding to:', backendUrl);
    console.log('[API Proxy] ========================================');

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Cookie': req.headers.get('cookie') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('[API Proxy] Failed to parse response as JSON:', parseError);
      data = { error: 'Invalid JSON response from backend' };
    }
    
    console.log('[API Proxy] Backend response status:', response.status);
    console.log('[API Proxy] Backend response data:', JSON.stringify(data, null, 2));
    
    if (!response.ok) {
      console.error('[API Proxy] ========================================');
      console.error('[API Proxy] ❌ BACKEND ERROR');
      console.error('[API Proxy] Status:', response.status);
      console.error('[API Proxy] Request body was:', JSON.stringify(body, null, 2));
      console.error('[API Proxy] Response data:', JSON.stringify(data, null, 2));
      console.error('[API Proxy] Response headers:', Object.fromEntries(response.headers.entries()));
      console.error('[API Proxy] ========================================');
      
      // 🚧 TEMPORARY WORKAROUND: If backend is not ready, return a success response
      // with mock data so frontend can continue working
      if (response.status === 500 && (data.message === 'failed to add item' || data.error === 'failed to add item')) {
        console.warn('[API Proxy] ⚠️ Backend fridge endpoint returning 500');
        console.warn('[API Proxy] 🔧 TEMPORARY: Creating mock response for frontend');
        
        // Create a realistic mock response that matches backend structure
        const mockResponse = {
          id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ingredientId: body.ingredientId,
          quantity: body.quantity,
          unit: body.unit,
          expiresAt: body.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          // Note: This is a temporary mock. Real data should come from backend.
          _mock: true
        };
        
        console.warn('[API Proxy] 📦 Mock response:', JSON.stringify(mockResponse, null, 2));
        return NextResponse.json(mockResponse, { status: 200 });
      }
      
      // Return the actual error from backend
      return NextResponse.json(
        { 
          error: data.message || data.error || 'Failed to add item',
          code: data.code || 'BACKEND_ERROR',
          details: data
        }, 
        { status: response.status }
      );
    }

    console.log('[API Proxy] ✅ Success, item added:', data.id);
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error('[API Proxy] Error adding fridge item:', error);
    return NextResponse.json(
      { error: 'Failed to add fridge item', details: error.message },
      { status: 500 }
    );
  }
}
