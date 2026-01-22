import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 
  'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app';

/**
 * PATCH /api/menu/:id
 * 
 * Proxies request to backend: PATCH /api/menu/:id
 * Updates menu item (servings, etc)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get auth token
    const token = request.headers.get('Authorization')?.replace('Bearer ', '') ||
                  request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'NO_TOKEN' },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const language = request.headers.get('Accept-Language')?.split(',')[0] || 'en';

    console.log('📡 [menu/:id PATCH] Proxying to backend:', {
      url: `${BACKEND_URL}/api/menu/${id}`,
      id,
      body,
      token: token.substring(0, 20) + '...',
    });

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/menu/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept-Language': language,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await response.json();

    console.log('✅ [menu/:id PATCH] Backend response:', {
      status: response.status,
      itemId: data.item?.id || 'unknown',
      servings: data.item?.servings || 'unknown',
    });

    if (!response.ok) {
      console.error('❌ [menu/:id PATCH] Backend error:', data);
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ [menu/:id PATCH] Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
