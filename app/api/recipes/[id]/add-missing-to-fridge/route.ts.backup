import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app';

/**
 * POST /api/recipes/[id]/add-missing-to-fridge
 * Add missing ingredients from recipe to user's fridge
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: recipeId } = await params;

    // 🔐 Get token from Authorization header
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Authorization required' },
        { status: 401 }
      );
    }

    console.log(`📦 [POST /api/recipes/${recipeId}/add-missing-to-fridge]`);
    console.log('   Token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
    console.log('   Proxying to backend:', `${BACKEND_URL}/api/recipes/${recipeId}/add-missing-to-fridge`);

    // Proxy request to Go backend
    const response = await fetch(
      `${BACKEND_URL}/api/recipes/${recipeId}/add-missing-to-fridge`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    console.log('📡 Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend error:', response.status, errorText);

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
    console.log('✅ Added items to fridge:', data.data?.addedItems?.length || 0);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`❌ [POST /api/recipes/add-missing-to-fridge] Error:`, error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
