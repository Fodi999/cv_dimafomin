/**
 * Save edited recipe to database
 * POST /api/admin/recipes/save
 * 
 * This endpoint saves a user-edited recipe (after AI preview) to the database.
 * Use this after the user has reviewed and edited the AI-generated preview.
 */

import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/api/proxy";

export async function POST(req: NextRequest) {
  return proxyToBackend(req, {
    endpoint: '/api/admin/recipes/save',
    method: 'POST',
  });
}
