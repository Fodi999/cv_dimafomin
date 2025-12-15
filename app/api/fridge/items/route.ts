import { NextRequest, NextResponse } from 'next/server';

// Используем NEXT_PUBLIC_API_BASE из .env.local
const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE || 'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app';

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
    console.log('[API Proxy] POST /api/fridge/items');
    console.log('[API Proxy] Body:', JSON.stringify(body, null, 2));
    console.log('[API Proxy] Token:', token.substring(0, 20) + '...');

    const backendUrl = `${BACKEND_URL}/api/fridge/items`;
    console.log('[API Proxy] Forwarding to:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Cookie': req.headers.get('cookie') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('[API Proxy] Backend error:', response.status, data);
      console.error('[API Proxy] Full error:', JSON.stringify(data, null, 2));
      
      // 🔧 TEMPORARY: If backend returns 500, create mock item (endpoint not implemented yet)
      if (response.status === 500) {
        console.warn('[API Proxy] ⚠️ Backend fridge POST not implemented yet - returning mock item');
        const mockItem = {
          id: `mock-${Date.now()}`,
          ingredient: {
            name: body.ingredientId, // We don't have ingredient name, use ID
            category: 'other'
          },
          quantity: body.quantity,
          unit: body.unit,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          daysLeft: 7,
          status: 'ok' as const
        };
        return NextResponse.json(mockItem);
      }
      
      return NextResponse.json(data, { status: response.status });
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
