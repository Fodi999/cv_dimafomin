/**
 * Create recipe with AI generation
 * POST /api/admin/recipes/create-ai
 */

import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/api/proxy";

export async function POST(req: NextRequest) {
  return proxyToBackend(req, {
    endpoint: '/api/admin/recipes/create-ai',
    method: 'POST',
  });
}

