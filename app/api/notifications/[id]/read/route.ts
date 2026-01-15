import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * PATCH /api/notifications/:id/read
 * Mark notification as read
 * 
 * TODO: Remove mock when backend implements this endpoint
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Try backend first
  const backendResponse = await proxyToBackend(req, {
    endpoint: `/api/notifications/${id}/read`,
    method: 'PATCH'
  });

  // If backend returns 404, use mock success
  if (backendResponse.status === 404) {
    console.log(`[Notifications] Backend not ready, mock marking ${id} as read`);
    
    return NextResponse.json({
      data: {
        id,
        isRead: true
      },
      success: true
    });
  }

  return backendResponse;
}
