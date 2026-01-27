/**
 * Publish Dish
 * POST /api/admin/dishes/:id/publish
 * 
 * Proxies to backend
 */

import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/api/proxy";
import { requireAdmin } from "@/lib/api/middleware";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;

  return proxyToBackend(request, {
    endpoint: `/api/admin/dishes/${id}/publish`,
    method: "POST",
  });
}
