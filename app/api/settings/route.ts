import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

export async function GET(req: NextRequest) {
  return proxyToBackend(req, {
    endpoint: '/api/settings',
    method: 'GET'
  });
}

export async function PATCH(req: NextRequest) {
  return proxyToBackend(req, {
    endpoint: '/api/settings',
    method: 'PATCH'
  });
}
