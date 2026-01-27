/**
 * Single Dish API
 * GET /api/admin/dishes/:id - Get dish
 * PATCH /api/admin/dishes/:id - Update dish
 * DELETE /api/admin/dishes/:id - Delete dish
 * 
 * Proxies to backend
 */

import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/api/proxy";
import { requireAdmin } from "@/lib/api/middleware";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;

  return proxyToBackend(request, {
    endpoint: `/api/admin/dishes/${id}`,
    method: "GET",
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;

  return proxyToBackend(request, {
    endpoint: `/api/admin/dishes/${id}`,
    method: "PATCH",
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;

  return proxyToBackend(request, {
    endpoint: `/api/admin/dishes/${id}`,
    method: "DELETE",
  });
}
