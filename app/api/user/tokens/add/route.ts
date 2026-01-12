import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from "@/lib/api/backend-url";
const BACKEND_URL = getBackendUrl();

/**
 * POST /api/user/tokens/add
 * Add tokens to the user's balance
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
    console.log('[API Proxy] POST /api/user/tokens/add');
    console.log('[API Proxy] Body:', JSON.stringify(body, null, 2));

    const backendUrl = `${BACKEND_URL}/api/user/tokens/add`;
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Cookie': req.headers.get('cookie') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
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

    console.log('[API Proxy] ✅ Success, tokens added');
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error('[API Proxy] Error adding tokens:', error);
    return NextResponse.json(
      { error: 'Failed to add tokens', details: error.message },
      { status: 500 }
    );
  }
}
