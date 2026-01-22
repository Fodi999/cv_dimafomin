import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 
  'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app';

/**
 * GET /api/menu/today
 * 
 * Proxies request to backend: GET /api/menu/today
 * Returns today's menu for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Get auth token from cookies or Authorization header
    const token = request.headers.get('Authorization')?.replace('Bearer ', '') ||
                  request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'NO_TOKEN' },
        { status: 401 }
      );
    }

    // Get language from query params or headers
    const language = request.nextUrl.searchParams.get('lang') ||
                     request.headers.get('Accept-Language')?.split(',')[0] ||
                     'en';

    console.log('📡 [menu/today] Proxying to backend:', {
      url: `${BACKEND_URL}/api/menu/today`,
      token: token.substring(0, 20) + '...',
      language,
    });

    // Forward request to backend
    const response = await fetch(`${BACKEND_URL}/api/menu/today`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept-Language': language,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await response.json();

    console.log('✅ [menu/today] Backend response:', {
      status: response.status,
      itemsCount: data.items?.length || 0,
    });

    if (!response.ok) {
      console.error('❌ [menu/today] Backend error:', data);
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ [menu/today] Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
