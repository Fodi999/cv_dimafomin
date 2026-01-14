/**
 * Admin Challenges API - Single Challenge
 * 
 * GET    /api/admin/challenges/[id]      - Get challenge details
 * PUT    /api/admin/challenges/[id]      - Update challenge
 * DELETE /api/admin/challenges/[id]      - Delete challenge
 */

import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/api/proxy";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    return await proxyToBackend(request, {
      endpoint: `/api/admin/challenges/${id}`,
      method: "GET",
    });
  } catch (error) {
    console.warn("Backend not available for GET challenge");
    return NextResponse.json(
      { success: false, error: "Backend not available" },
      { status: 503 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    return await proxyToBackend(request, {
      endpoint: `/api/admin/challenges/${id}`,
      method: "PUT",
    });
  } catch (error) {
    console.error("Backend PUT error:", error);
    return NextResponse.json(
      { success: false, error: "Backend not available" },
      { status: 503 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    return await proxyToBackend(request, {
      endpoint: `/api/admin/challenges/${id}`,
      method: "DELETE",
    });
  } catch (error) {
    console.error("Backend DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Backend not available" },
      { status: 503 }
    );
  }
}
