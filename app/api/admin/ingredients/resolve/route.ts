/**
 * Universal ingredient resolution endpoint
 * Handles both existing and new ingredients with AI classification
 * 
 * POST /api/admin/ingredients/resolve
 * Body: { input: string }
 * Response: { status: "created" | "existing", ingredient: {...} }
 */

import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

export async function POST(req: NextRequest) {
  return proxyToBackend(req, {
    endpoint: '/api/admin/ingredients/resolve',
    method: 'POST'
  });
}
