import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE || 'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app';

/**
 * GET /api/catalog/ingredients/search?query=...
 * Поиск ингредиентов в каталоге для автокомплита
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

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        data: {
          count: 0,
          items: []
        }
      });
    }

    const backendUrl = `${BACKEND_URL}/api/catalog/ingredients/search?query=${encodeURIComponent(query)}`;
    console.log('[API Proxy] GET /api/catalog/ingredients/search?query=' + query);
    console.log('[API Proxy] Forwarding to:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Cookie': req.headers.get('cookie') || '',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('[API Proxy] Backend error:', response.status, data);
      console.error('[API Proxy] Full error:', JSON.stringify(data, null, 2));
      
      // 🔧 TEMPORARY: If backend returns 500, return empty results (endpoint not implemented yet)
      if (response.status === 500) {
        console.warn('[API Proxy] ⚠️ Backend catalog search endpoint not implemented yet - returning empty results');
        return NextResponse.json({ data: { count: 0, items: [] } });
      }
      
      return NextResponse.json(data, { status: response.status });
    }

    // ✅ Детальное логирование для отладки
    console.log('[API Proxy] ✅ Success!');
    console.log('[API Proxy] Response structure:', {
      hasData: !!data.data,
      hasItems: !!data.data?.items,
      itemsIsArray: Array.isArray(data.data?.items),
      count: data.data?.count || 0,
      itemsLength: data.data?.items?.length || 0
    });
    console.log('[API Proxy] Full response:', JSON.stringify(data, null, 2));
    
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error('[API Proxy] Error searching ingredients:', error);
    return NextResponse.json(
      { error: 'Failed to search ingredients', details: error.message },
      { status: 500 }
    );
  }
}
