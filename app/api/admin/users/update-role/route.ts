import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, logAdminAction } from "@/lib/api/middleware";

/**
 * PATCH /api/admin/users/update-role
 * Обновить роль пользователя
 * 
 * Body:
 * {
 *   "userId": "user-uuid",
 *   "role": "admin | home_chef | pro_chef"
 * }
 */
export async function PATCH(request: NextRequest) {
  // 🔐 Проверка админских прав
  const { user, error } = await requireAdmin(request);
  if (error) return error;

  try {
    const body = await request.json();
    const { userId, role } = body;

    // Валидация входных данных
    if (!userId) {
      return NextResponse.json(
        {
          error: {
            code: "MISSING_USER_ID",
            message: "userId is required",
          },
        },
        { status: 400 }
      );
    }

    // Валидация роли
    const validRoles = ["admin", "home_chef", "pro_chef"];
    if (!role || !validRoles.includes(role)) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_ROLE",
            message: `Invalid role. Allowed values: ${validRoles.join(", ")}`,
          },
        },
        { status: 400 }
      );
    }

    // Логирование действия
    logAdminAction(user!.sub || user!.email, "UPDATE_USER_ROLE", {
      userId,
      newRole: role,
      timestamp: new Date().toISOString(),
      adminEmail: user!.email,
    });

    // TODO: Обновить роль в базе данных
    // await db.users.update({
    //   where: { id: userId },
    //   data: { role: role }
    // });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      message: "User role updated successfully",
      data: {
        userId,
        role,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[API] Update role error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to update user role",
        },
      },
      { status: 500 }
    );
  }
}
