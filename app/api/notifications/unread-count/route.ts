import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/notifications/unread-count
 * Get count of unread notifications
 */
export async function GET(req: NextRequest) {
  return proxyToBackend(req, {
    endpoint: '/api/notifications/unread-count',
    method: 'GET'
  });
}
