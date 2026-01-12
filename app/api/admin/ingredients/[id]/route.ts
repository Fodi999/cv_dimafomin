import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/api/middleware";
import { proxyToBackend } from "@/lib/api/proxy";

/**
 * PUT /api/admin/ingredients/[id]
 * Обновить ингредиент
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check admin access
  const { user, error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  return proxyToBackend(request, {
    endpoint: `/api/admin/ingredients/${id}`,
    method: 'PUT'
  });
}

/**
 * DELETE /api/admin/ingredients/[id]
 * Удалить ингредиент
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check admin access
  const { user, error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;
  return proxyToBackend(request, {
    endpoint: `/api/admin/ingredients/${id}`,
    method: 'DELETE'
  });
}
