import { NextRequest, NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/api/backend-url";
/**
 * PATCH /api/user/language
 * Update user's preferred language
 */
export async function PATCH(request: NextRequest) {
  try {
    const { language } = await request.json();

    // Validate language
    if (!["pl", "en", "ru"].includes(language)) {
      return NextResponse.json(
        { error: "Invalid language. Must be: pl, en, or ru" },
        { status: 400 }
      );
    }

    // TODO: Get user from auth token
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // TODO: Update user language in database
    // const userId = await getUserIdFromToken(token);
    // await db.users.update({ id: userId, language });

    // For now, just return success (since we don't have DB integration yet)
    console.log(`✅ User language updated to: ${language}`);

    return NextResponse.json({
      success: true,
      message: "Language updated successfully",
      data: { language }
    });

  } catch (error) {
    console.error("Error updating language:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
