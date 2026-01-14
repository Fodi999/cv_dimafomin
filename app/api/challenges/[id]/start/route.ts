/**
 * Challenge Start Session API
 * 
 * POST /api/challenges/[id]/start - Start a new challenge session (guest)
 */

import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/api/proxy";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToBackend(request, {
    endpoint: `/api/challenges/${id}/start`,
    method: "POST",
    skipAuth: true,
  });
}
