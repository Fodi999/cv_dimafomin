import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

export async function POST(req: NextRequest) {
  return proxyToBackend(req, {
    endpoint: '/api/auth/login',
    method: 'POST',
    skipAuth: true  // Login doesn't require auth
  });
}
