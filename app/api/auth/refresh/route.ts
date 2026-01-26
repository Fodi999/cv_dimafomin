import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

export async function POST(req: NextRequest) {
  return proxyToBackend(req, {
    endpoint: '/api/auth/refresh',
    method: 'POST',
    skipAuth: true  // Refresh doesn't require access_token
  });
}
