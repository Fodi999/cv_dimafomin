import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * GET /api/admin/ingredients/suggest
 * AI-powered ingredient name suggestions for autocomplete
 * 
 * Query params:
 * - q: string (search query)
 * - limit: number (max results, default 10)
 */
export async function GET(req: NextRequest) {
  return proxyToBackend(req, {
    endpoint: '/api/admin/ingredients/suggest',
    method: 'GET'
  });
}
