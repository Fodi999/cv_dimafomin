import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToBackend(req, {
    endpoint: `/api/admin/recipes/${id}`,
    method: 'GET'
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToBackend(req, {
    endpoint: `/api/admin/recipes/${id}`,
    method: 'PUT'
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToBackend(req, {
    endpoint: `/api/admin/recipes/${id}`,
    method: 'DELETE'
  });
}
