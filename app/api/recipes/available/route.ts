import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/api/proxy";

/**
 * GET /api/recipes/available
 * Get recipes categorized by cooking feasibility (canCook, almostCook, needToBuy)
 * 
 * Protected route - requires JWT token
 */
export async function GET(req: NextRequest) {
  return proxyToBackend(req, {
    endpoint: '/api/recipes/available',
    method: 'GET'
  });
}
