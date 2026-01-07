import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/middleware";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app";

/**
 * GET /api/admin/ingredients
 * Получить список всех ингредиентов с фильтрацией
 * Использует /api/catalog/ingredients из бэкенда
 */
export async function GET(request: NextRequest) {
  try {
    // Check admin access
    const { user, error } = await requireAdmin(request);
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '50';

    console.log('[Admin Ingredients API] Query params received:', {
      search,
      searchLength: search.length,
      category,
      page,
      limit,
      rawURL: request.url,
    });

    // Build query string for admin endpoint
    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    if (category && category !== 'all') queryParams.append('category', category);
    queryParams.append('page', page);
    queryParams.append('limit', limit);

    // Use admin endpoint (returns all ingredients with full details)
    const url = `${BACKEND_URL}/api/admin/ingredients?${queryParams.toString()}`;
    console.log('[Admin Ingredients API] Fetching from backend:', url);
    console.log('[Admin Ingredients API] Query string:', queryParams.toString());

    const token = request.headers.get('Authorization')?.replace('Bearer ', '') || '';
    const acceptLanguage = request.headers.get('Accept-Language') || 'pl';
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept-Language': acceptLanguage,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Admin Ingredients API] Backend error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to fetch ingredients' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    console.log('[Admin Ingredients API] Backend response summary:', {
      dataType: typeof data,
      isArray: Array.isArray(data),
      dataLength: Array.isArray(data) ? data.length : 'N/A',
      hasData: !!data.data,
      dataDataLength: data.data?.length,
      hasMeta: !!data.meta,
      metaTotal: data.meta?.total,
      firstItemName: (Array.isArray(data) ? data[0]?.name : data.data?.[0]?.name) || 'N/A',
    });
    
    // Transform response to match expected format
    // Backend returns: { data: { items: [...], count: number }, success: true }
    // OR just an array directly: [...]
    // Frontend expects: { data: [...], meta: { total, page, limit, totalPages } }
    
    // Handle multiple possible response formats:
    // 1. Direct array: [...]
    // 2. Wrapped in data: { data: [...] }
    // 3. Nested structure: { data: { items: [...] } }
    let itemsArray: any[] = [];
    
    if (Array.isArray(data)) {
      // Case 1: Backend returns array directly
      itemsArray = data;
      console.log('[Admin Ingredients API] Backend returned direct array:', itemsArray.length);
    } else {
      // Case 2 & 3: Backend returns object
      const backendData = data.data || data;
      const items = backendData.items || backendData.ingredients || data.ingredients || backendData;
      itemsArray = Array.isArray(items) ? items : [];
      console.log('[Admin Ingredients API] Backend returned object, extracted items:', itemsArray.length);
    }
    
    const totalCount = data.count || data.total || data.data?.count || itemsArray.length;
    const currentPage = parseInt(page);
    const pageLimit = parseInt(limit);
    
    console.log('[Admin Ingredients API] Transformed response:', {
      itemsCount: itemsArray.length,
      totalCount,
      firstItem: itemsArray[0],
      firstItemKeys: itemsArray[0] ? Object.keys(itemsArray[0]) : [],
    });
    
    return NextResponse.json({
      data: itemsArray,
      meta: {
        total: totalCount,
        page: currentPage,
        limit: pageLimit,
        totalPages: Math.ceil(totalCount / pageLimit),
      },
    });
  } catch (error) {
    console.error('[Admin Ingredients API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/ingredients
 * Создать новый ингредиент
 * Backend сам определяет category, unit и переводит на все языки через AI
 */
export async function POST(request: NextRequest) {
  try {
    // Check admin access
    const { user, error } = await requireAdmin(request);
    if (error) return error;

    const body = await request.json();
    console.log('[Admin Ingredients API] Creating ingredient:', body);

    // Validate ТОЛЬКО inputName - остальное делает backend + AI
    if (!body.inputName?.trim()) {
      return NextResponse.json(
        { error: 'inputName is required' },
        { status: 400 }
      );
    }

    // Просто проксируем запрос в backend - он сам всё определит через AI
    const response = await fetch(`${BACKEND_URL}/api/admin/ingredients`, {
      method: 'POST',
      headers: {
        'Authorization': request.headers.get('Authorization') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputName: body.inputName.trim() }),
    });

    console.log('[Admin Ingredients API] Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Admin Ingredients API] Backend error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to create ingredient', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('[Admin Ingredients API] Backend response data:', data);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('[Admin Ingredients API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
