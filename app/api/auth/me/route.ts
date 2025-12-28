/**
 * GET /api/auth/me
 * 
 * Get current authenticated user profile
 * 
 * ✅ Uses new ApiResponse<UserProfile> format
 */

import { NextRequest, NextResponse } from "next/server";
import {
  createApiResponse,
  createApiError,
  ApiErrorCode,
  type UserProfile,
  type ApiResponse,
  type ApiError,
} from "@/lib/api";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE || "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    
    if (!authHeader) {
      return NextResponse.json<ApiError>(
        createApiError(
          ApiErrorCode.AUTH_REQUIRED,
          "Authentication required"
        ),
        { status: 401 }
      );
    }

    const backendUrl = `${BACKEND_URL}/api/auth/me`;
    console.log("👤 [Proxy] Get user info request to:", backendUrl);

    const res = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Authorization": authHeader,
        "Cookie": req.headers.get("cookie") || "",
      },
    });

    console.log("📥 [Proxy] Backend response status:", res.status);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json<ApiError>(
        createApiError(
          res.status === 401 ? ApiErrorCode.INVALID_TOKEN : ApiErrorCode.INTERNAL_ERROR,
          errorData.message || `Backend error: ${res.status}`,
          errorData
        ),
        { status: res.status }
      );
    }

    const userData = await res.json() as UserProfile;
    
    return NextResponse.json<ApiResponse<UserProfile>>(
      createApiResponse(userData, {
        requestId: crypto.randomUUID(),
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ [Proxy] Get user info error:", error);
    return NextResponse.json<ApiError>(
      createApiError(
        ApiErrorCode.INTERNAL_ERROR,
        "Internal proxy error",
        { error: error instanceof Error ? error.message : String(error) }
      ),
      { status: 500 }
    );
  }
}
