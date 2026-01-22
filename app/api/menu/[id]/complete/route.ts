import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 
  'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app';

/**
 * POST /api/menu/:id/complete
 * 
 * Proxies request to backend: POST /api/menu/:id/complete
 * Marks a menu item as "completed"
 */
export async function POST(
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

    const language = request.headers.get('Accept-Language')?.split(',')[0] || 'en';

    console.log('📡 [menu/:id/complete] Proxying to backend:', {
      url: `${BACKEND_URL}/api/menu/${id}/complete`,
      id,
      token: token.substring(0, 20) + '...',
    });

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/menu/${id}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept-Language': language,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await response.json();

    console.log('✅ [menu/:id/complete] Backend response:', {
      status: response.status,
      itemId: data.item?.id || 'unknown',
      itemStatus: data.item?.status || 'unknown',
    });

    if (!response.ok) {
      console.error('❌ [menu/:id/complete] Backend error:', data);
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ [menu/:id/complete] Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
