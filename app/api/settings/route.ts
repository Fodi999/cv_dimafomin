import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/settings
 * 
 * ⚠️ Backend doesn't have /api/settings endpoint
 * Settings are part of user profile (/api/user/profile)
 * This route provides fallback defaults
 */
export async function GET(req: NextRequest) {
  // Return default settings without backend call
  // (Backend has settings in profile, not separate endpoint)
  return NextResponse.json({
    success: true,
    data: {
      language: 'pl',
      timeFormat: '24h',
      units: 'metric',
      aiStyle: 'mentor'
    }
  });
}

/**
 * PATCH /api/settings
 * 
 * ⚠️ This should update user profile, not settings
 * Consider using /api/user/profile instead
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Get token from cookie
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    
    // Update user profile (which includes settings)
    const response = await fetch(`${backendUrl}/api/user/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Update failed' }));
      return NextResponse.json(
        { success: false, error: error.message },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data.data || data
    });
  } catch (error) {
    console.error('[Settings PATCH] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
