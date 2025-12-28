/**
 * Settings API Route
 * 
 * GET /api/settings - Get user settings
 * PATCH /api/settings - Update user settings (partial)
 * 
 * ✅ Uses new ApiResponse<SettingsResponse> format
 * ⚠️ NOTE: language field removed - now in cookie
 */

import { NextRequest, NextResponse } from "next/server";
import { 
  DEFAULT_SETTINGS,
  type UserSettings,
  type PartialSettings  
} from "@/lib/types/settings";
import {
  createApiResponse,
  createApiError,
  createValidationError,
  ApiErrorCode,
  type ApiResponse,
  type ApiError,
  type SettingsResponse,
} from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app";

/**
 * GET /api/settings
 * 
 * Returns user settings from backend profile
 * Falls back to defaults if not found
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json<ApiError>(
        createApiError(
          ApiErrorCode.AUTH_REQUIRED,
          "Authentication required"
        ),
        { status: 401 }
      );
    }

    // TODO: Fetch from backend /api/user/profile
    // For now, return defaults
    console.log("⚙️ GET /api/settings - returning defaults (TODO: fetch from backend)");
    
    // Create minimal SettingsResponse (без language!)
    const settings: SettingsResponse = {
      theme: "system",
      timeFormat: DEFAULT_SETTINGS.timeFormat,
      units: DEFAULT_SETTINGS.units,
      notifications: {
        email: true,
        push: false,
      },
      privacy: {
        publicProfile: true,
        showEmail: false,
      },
    };

    return NextResponse.json<ApiResponse<SettingsResponse>>(
      createApiResponse(settings, {
        requestId: crypto.randomUUID(),
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ GET /api/settings error:", error);
    return NextResponse.json<ApiError>(
      createApiError(
        ApiErrorCode.INTERNAL_ERROR,
        "Failed to load settings",
        { error: error instanceof Error ? error.message : String(error) }
      ),
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/settings
 * 
 * Updates user settings (partial update)
 * Saves to backend profile
 * 
 * ⚠️ Rejects 'language' field - language is now cookie-based
 */
export async function PATCH(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json<ApiError>(
        createApiError(
          ApiErrorCode.AUTH_REQUIRED,
          "Authentication required"
        ),
        { status: 401 }
      );
    }

    const body: any = await request.json();
    
    // ⚠️ Reject language field
    if ("language" in body) {
      return NextResponse.json<ApiError>(
        createValidationError(
          "Language cannot be updated via settings API",
          [{
            field: "language",
            message: "Use cookie-based language system instead",
            code: "DEPRECATED_FIELD",
          }]
        ),
        { status: 400 }
      );
    }

    console.log("⚙️ PATCH /api/settings - updating:", body);

    // TODO: Send to backend /api/user/profile
    // For now, return updated settings
    const updated: SettingsResponse = {
      theme: body.theme || "system",
      timeFormat: body.timeFormat || DEFAULT_SETTINGS.timeFormat,
      units: body.units || DEFAULT_SETTINGS.units,
      notifications: body.notifications || {
        email: true,
        push: false,
      },
      privacy: body.privacy || {
        publicProfile: true,
        showEmail: false,
      },
    };
    
    console.log("✅ Settings updated:", updated);
    
    return NextResponse.json<ApiResponse<SettingsResponse>>(
      createApiResponse(updated, {
        requestId: crypto.randomUUID(),
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ PATCH /api/settings error:", error);
    return NextResponse.json<ApiError>(
      createApiError(
        ApiErrorCode.INTERNAL_ERROR,
        "Failed to update settings",
        { error: error instanceof Error ? error.message : String(error) }
      ),
      { status: 500 }
    );
  }
}
