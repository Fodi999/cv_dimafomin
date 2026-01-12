import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * DELETE /api/user/recipes/saved/[id]
 * Proxy to backend: DELETE /api/user/recipes/saved/[id]
 * Removes a recipe from user's saved recipes list
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Brak autoryzacji' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { id: recipeId } = await params;

    console.log(`🗑️ DELETE /api/user/recipes/saved/${recipeId}`);

    // Proxy request to backend
    const response = await fetch(`${BACKEND_URL}/api/user/recipes/saved/${recipeId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    console.log('📡 Backend response status:', response.status);
    console.log('📦 Backend response data:', data);

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json({
      success: true,
      message: 'Przepis usunięty z zapisanych',
      data: data.data || null,
    });
  } catch (error: any) {
    console.error('❌ Error deleting saved recipe:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Błąd serwera' 
      },
      { status: 500 }
    );
  }
}
