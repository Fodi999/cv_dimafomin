/**
 * Public Challenge Detail API
 * 
 * GET /api/challenges/[id] - Get challenge details (guest-accessible)
 */

import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/api/proxy";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToBackend(request, {
    endpoint: `/api/challenges/${id}`,
    method: "GET",
    skipAuth: true,
  });
}
