import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from "@/lib/api/backend-url";
const BACKEND_URL = getBackendUrl();

/**
 * POST /api/user/recipes/save
 * Save a recipe to user's favorites
 * 
 * Protected route - requires JWT token
 */
export async function POST(req: NextRequest) {
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

    // Get request body
    const body = await req.json();
    const { recipeId } = body;

    if (!recipeId) {
      return NextResponse.json(
        { success: false, message: 'recipeId is required' },
        { status: 400 }
      );
    }

    console.log(`⭐ [POST /api/user/recipes/save]`);
    console.log('   Recipe ID:', recipeId);
    console.log('   Proxying to backend:', `${BACKEND_URL}/api/user/recipes/save`);

    // Proxy request to Go backend
    const response = await fetch(`${BACKEND_URL}/api/user/recipes/save`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipeId }),
    });

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
    console.log('✅ Recipe saved successfully');

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`❌ [POST /api/user/recipes/save] Error:`, error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
