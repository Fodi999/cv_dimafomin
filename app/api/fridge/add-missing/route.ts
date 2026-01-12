import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from "@/lib/api/backend-url";
const BACKEND_URL = getBackendUrl();

/**
 * ✅ POST /api/fridge/add-missing
 * 
 * Додає недостатні інгредієнти з рецепта в холодильник користувача.
 * 
 * Body:
 * {
 *   "recipeId": "uuid"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "added": 3,
 *     "skipped": 1,
 *     "items": [
 *       { "name": "Pomidor", "addedQuantity": 300, "unit": "g" }
 *     ]
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Extract Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Authorization required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { recipeId } = body;

    if (!recipeId) {
      return NextResponse.json(
        { success: false, message: 'recipeId is required' },
        { status: 400 }
      );
    }

    console.log('🛒 [API] Adding missing ingredients for recipe:', recipeId);

    // Forward to Go backend
    const backendUrl = `${BACKEND_URL}/api/fridge/add-missing`;
    
    console.log('📡 [API] Forwarding to:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipeId }),
    });

    const data = await response.json();
    
    console.log('📦 [API] Backend response:', {
      status: response.status,
      data,
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to add items' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    console.error('❌ [API] Error in add-missing:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
