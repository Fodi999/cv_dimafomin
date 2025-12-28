/**
 * Settings API Route
 * 
 * GET /api/settings - Get user settings
 * PATCH /api/settings - Update user settings (partial)
 */

import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_SETTINGS, type UserSettings, type PartialSettings } from "@/lib/types/settings";

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
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // TODO: Fetch from backend /api/user/profile
    // For now, return defaults
    console.log("⚙️ GET /api/settings - returning defaults (TODO: fetch from backend)");
    
    return NextResponse.json(DEFAULT_SETTINGS);
  } catch (error) {
    console.error("❌ GET /api/settings error:", error);
    return NextResponse.json(
      { error: "Failed to load settings" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/settings
 * 
 * Updates user settings (partial update)
 * Saves to backend profile
 */
export async function PATCH(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const partial: PartialSettings = await request.json();
    
    console.log("⚙️ PATCH /api/settings - updating:", partial);

    // TODO: Send to backend /api/user/profile
    // For now, return merged settings
    const updated: UserSettings = {
      ...DEFAULT_SETTINGS,
      ...partial,
      updatedAt: new Date().toISOString()
    };
    
    console.log("✅ Settings updated:", updated);
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error("❌ PATCH /api/settings error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
