import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from "@/lib/api/backend-url";
const BACKEND_URL = getBackendUrl();

/**
 * GET /api/fridge/test
 * Тестовый endpoint для проверки подключения к backend
 */
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization');
    
    console.log('=== FRIDGE API TEST ===');
    console.log('BACKEND_URL from env:', process.env.NEXT_PUBLIC_API_BASE);
    console.log('BACKEND_URL used:', BACKEND_URL);
    console.log('Token present:', !!token);
    console.log('Token value:', token?.substring(0, 30) + '...');
    
    if (!token) {
      return NextResponse.json({
        error: 'No token provided',
        backend_url: BACKEND_URL,
        env_value: process.env.NEXT_PUBLIC_API_BASE || 'NOT SET'
      }, { status: 401 });
    }

    // Пробуем подключиться к backend
    const testUrl = `${BACKEND_URL}/api/fridge/items`;
    console.log('Testing connection to:', testUrl);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
    });

    console.log('Backend response status:', response.status);
    console.log('Backend response headers:', Object.fromEntries(response.headers.entries()));
    
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.log('Backend response (text):', text);
      data = { raw: text };
    }
    
    console.log('Backend response data:', JSON.stringify(data, null, 2));
    
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      backend_url: testUrl,
      data: data,
      env: {
        NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE || 'NOT SET'
      }
    });
    
  } catch (error: any) {
    console.error('=== TEST ERROR ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
      backend_url: BACKEND_URL
    }, { status: 500 });
  }
}
