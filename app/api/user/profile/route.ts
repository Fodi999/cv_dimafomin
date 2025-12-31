import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE || 'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app';

/**
 * GET /api/user/profile
 * Получить профиль текущего авторизованного пользователя
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

    const backendUrl = `${BACKEND_URL}/api/user/profile`;
    console.log('[API Proxy] GET /api/user/profile');
    console.log('[API Proxy] Forwarding to:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Cookie': req.headers.get('cookie') || '',
        'Content-Type': 'application/json',
      },
    });

    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.warn('[API Proxy] Non-JSON response:', text);
      data = { error: 'Invalid response format', raw: text };
    }
    
    if (!response.ok) {
      console.error('[API Proxy] Backend error:', response.status, data);
      return NextResponse.json(data, { status: response.status });
    }

    console.log('[API Proxy] ✅ Success, profile loaded');
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error('[API Proxy] Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/user/profile
 * Обновить профиль текущего пользователя
 */
export async function PUT(req: NextRequest) {
  try {
    const token = req.headers.get('authorization');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log('[API Proxy] PUT /api/user/profile');
    console.log('[API Proxy] Body:', JSON.stringify(body, null, 2));

    const backendUrl = `${BACKEND_URL}/api/user/profile`;
    
    const response = await fetch(backendUrl, {
      method: 'PUT',
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
      return NextResponse.json(data, { status: response.status });
    }

    console.log('[API Proxy] ✅ Success, profile updated');
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error('[API Proxy] Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/user/profile
 * Частично обновить профиль текущего пользователя
 */
export async function PATCH(req: NextRequest) {
  try {
    const token = req.headers.get('authorization');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log('[API Proxy] PATCH /api/user/profile');
    console.log('[API Proxy] Body:', JSON.stringify(body, null, 2));

    const backendUrl = `${BACKEND_URL}/api/user/profile`;
    
    const response = await fetch(backendUrl, {
      method: 'PATCH',
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
      return NextResponse.json(data, { status: response.status });
    }

    console.log('[API Proxy] ✅ Success, profile updated');
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error('[API Proxy] Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile', details: error.message },
      { status: 500 }
    );
  }
}
