import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/notifications
 * Get all user notifications with filtering
 * 
 * Query params:
 * - page: number
 * - limit: number
 * - unread: boolean (optional)
 * - type: string (optional) - "ai" | "fridge" | "order" | "system" | "error"
 */
export async function GET(req: NextRequest) {
  return proxyToBackend(req, {
    endpoint: '/api/notifications',
    method: 'GET'
  });
}
