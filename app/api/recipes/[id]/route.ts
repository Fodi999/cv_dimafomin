import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from "@/lib/api/backend-url";
const BACKEND_URL = getBackendUrl();

/**
 * GET /api/recipes/[id]
 * Get recipe details by ID
 * 
 * Proxy to backend: GET /api/recipes/{id}
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: recipeId } = await params;

    // 🔐 Get token from Authorization header (if provided)
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    console.log(`📥 [GET /api/recipes/${recipeId}]`);
    console.log('   Token:', token ? `${token.substring(0, 20)}... (${token.length} chars)` : 'NO TOKEN');
    console.log('   Proxying to backend:', `${BACKEND_URL}/api/recipes/${recipeId}`);

    // 🌍 Get Accept-Language from request headers
    const acceptLanguage = req.headers.get('Accept-Language') || 'pl';
    console.log('   🌍 Accept-Language:', acceptLanguage);

    // Prepare headers for backend request
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept-Language': acceptLanguage,
    };

    // Add Authorization header if token is present
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('   ✅ Sending with Authorization header');
    } else {
      console.log('   ⚠️ Sending without Authorization (public request)');
    }

    // Proxy request to Go backend
    const response = await fetch(`${BACKEND_URL}/api/recipes/${recipeId}`, {
      method: 'GET',
      headers,
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
    
    // 🔍 DEBUG: Check what backend actually returns
    console.log('🔍 Backend recipe fields:', {
      id: data.data?.id,
      title: data.data?.title,
      localName: data.data?.localName,
      canonicalName: data.data?.canonicalName,
      hasTitle: !!data.data?.title,
      hasLocalName: !!data.data?.localName,
      hasCanonicalName: !!data.data?.canonicalName,
    });
    
    console.log('✅ Recipe details received:', data.data?.localName || 'Unknown');

    return NextResponse.json(data);
  } catch (error: any) {
    console.error(`❌ [GET /api/recipes] Error:`, error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
