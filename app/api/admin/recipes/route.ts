import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

export async function GET(req: NextRequest) {
  return proxyToBackend(req, {
    endpoint: '/api/admin/recipes',
    method: 'GET'
  });
}

export async function POST(req: NextRequest) {
  return proxyToBackend(req, {
    endpoint: '/api/admin/recipes',
    method: 'POST'
  });
}
