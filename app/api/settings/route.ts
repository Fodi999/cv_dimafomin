import { NextRequest, NextResponse } from 'next/server';
import { getBackendUrl } from "@/lib/api/backend-url";

const BACKEND_URL = getBackendUrl();

/**
 * GET /api/settings
 * 
 * ⚠️ Backend doesn't have /api/settings endpoint
 * Settings are part of user profile (/api/user/profile)
 * This route provides fallback defaults
 */
export async function GET(req: NextRequest) {
  try {
    // Try to get token from Authorization header or cookie
    const authHeader = req.headers.get('authorization');
    const tokenFromCookie = req.cookies.get('token')?.value;
    const token = authHeader?.replace('Bearer ', '') || tokenFromCookie;
    
    if (!token) {
      // Return default settings if no token
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

    // Try to fetch from backend profile
    const backendUrl = `${BACKEND_URL}/api/user/profile`;
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      // Extract settings from profile if available
      const profileData = data.data || data;
      return NextResponse.json({
        success: true,
        data: {
          language: profileData.language || 'pl',
          timeFormat: profileData.timeFormat || '24h',
          units: profileData.units || 'metric',
          aiStyle: profileData.aiStyle || 'mentor'
        }
      });
    }

    // Fallback to defaults
    return NextResponse.json({
      success: true,
      data: {
        language: 'pl',
        timeFormat: '24h',
        units: 'metric',
        aiStyle: 'mentor'
      }
    });
  } catch (error) {
    console.error('[Settings GET] Error:', error);
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
}

/**
 * PATCH /api/settings
 * 
 * Updates user profile settings via /api/user/profile
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[Settings PATCH] Request body:', JSON.stringify(body, null, 2));
    
    // Get token from Authorization header or cookie
    const authHeader = req.headers.get('authorization');
    const tokenFromCookie = req.cookies.get('token')?.value;
    const token = authHeader?.replace('Bearer ', '') || tokenFromCookie;
    
    if (!token) {
      console.error('[Settings PATCH] No token found');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    console.log('[Settings PATCH] Token found, updating profile...');
    console.log('[Settings PATCH] Backend URL:', `${BACKEND_URL}/api/user/profile`);
    
    // Update user profile (which includes settings)
    // Try PATCH first, fallback to PUT if backend doesn't support PATCH
    const backendUrl = `${BACKEND_URL}/api/user/profile`;
    
    let response = await fetch(backendUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Cookie': req.headers.get('cookie') || '',
      },
      body: JSON.stringify(body)
    });
    
    // If PATCH returns 405, try PUT instead
    if (response.status === 405) {
      console.log('[Settings PATCH] PATCH not supported, trying PUT...');
      response = await fetch(backendUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Cookie': req.headers.get('cookie') || '',
        },
        body: JSON.stringify(body)
      });
    }
    
    console.log('[Settings PATCH] Backend response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText || 'Update failed' };
      }
      console.error('[Settings PATCH] Backend error:', response.status, errorData);
      return NextResponse.json(
        { success: false, error: errorData.message || errorData.error || 'Update failed' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('[Settings PATCH] Success:', data);
    
    // Extract settings from profile response
    const profileData = data.data || data;
    const settingsData = {
      language: profileData.language || body.language,
      timeFormat: profileData.timeFormat || body.timeFormat,
      units: profileData.units || body.units,
      aiStyle: profileData.aiStyle || body.aiStyle,
    };
    
    return NextResponse.json({
      success: true,
      data: settingsData
    });
  } catch (error: any) {
    console.error('[Settings PATCH] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
