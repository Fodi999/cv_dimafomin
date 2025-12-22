import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app';

/**
 * GET /api/user/recipes/saved
 * Get user's saved recipes
 * 
 * Protected route - requires JWT token
 */
export async function GET(req: NextRequest) {
  try {
    // 🔐 Get token from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - token required' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    console.log(`📥 [GET /api/user/recipes/saved]`);
    console.log('   Token received from client (first 20 chars):', token.substring(0, 20) + '...');
    console.log('   Token length:', token.length, 'chars');
    console.log('   Proxying to backend:', `${BACKEND_URL}/api/user/recipes/saved`);
    console.log('   Sending Authorization header:', `Bearer ${token.substring(0, 20)}...`);

    // Proxy request to Go backend
    const response = await fetch(`${BACKEND_URL}/api/user/recipes/saved`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend error:', response.status, errorText);
      console.error('   Backend URL was:', `${BACKEND_URL}/api/user/recipes/saved`);
      console.error('   Token was sent:', token ? 'YES' : 'NO');
      console.error('   Token length:', token?.length || 0);

      return NextResponse.json(
        {
          success: false,
          message: `Backend error: ${response.status}`,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Saved recipes received');
    console.log('   Count:', data.data?.length || 0);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`❌ [GET /api/user/recipes/saved] Error:`, error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
