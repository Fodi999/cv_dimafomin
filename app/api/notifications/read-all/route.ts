import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * POST /api/notifications/read-all
 * Mark all notifications as read
 * 
 * TODO: Remove mock when backend implements this endpoint
 */
export async function POST(req: NextRequest) {
  // Try backend first
  const backendResponse = await proxyToBackend(req, {
    endpoint: '/api/notifications/read-all',
    method: 'POST'
  });

  // If backend returns 404, use mock success
  if (backendResponse.status === 404) {
    console.log('[Notifications] Backend not ready, mock marking all as read');
    
    return NextResponse.json({
      data: {
        markedCount: 2
      },
      success: true
    });
  }

  return backendResponse;
}
