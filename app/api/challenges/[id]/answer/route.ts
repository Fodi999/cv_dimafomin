/**
 * Challenge Answer Submission API
 * 
 * POST /api/challenges/[id]/answer - Submit answer (guest)
 */

import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/api/proxy";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyToBackend(request, {
    endpoint: `/api/challenges/${id}/answer`,
    method: "POST",
    skipAuth: true,
  });
}
