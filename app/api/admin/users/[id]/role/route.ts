import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, logAdminAction } from "@/lib/api/middleware";

const BACKEND_URL = process.env.BACKEND_URL || "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app";

/**
 * ✅ 2026: PATCH /api/admin/users/{id}/role
 * 
 * Изменение роли пользователя (только super_admin)
 * 
 * Body: { "role": "customer" | "home_chef" | "chef_staff" | "admin" | "super_admin" }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  console.log("\n🔄 ===== PATCH /api/admin/users/[id]/role =====");
  
  // 🔐 Проверка админских прав
  const { user, error } = await requireAdmin(request);
  if (error) {
    console.error("❌ [Change Role] Unauthorized");
    return error;
  }

  const { id } = await params;
  console.log(`✅ [Change Role] Admin: ${user!.email}, Target user: ${id}`);

  try {
    const body = await request.json();
    const { role } = body;

    // ✅ 2026: Валидация ролей
    const validRoles = ["customer", "home_chef", "chef_staff", "admin", "super_admin"];
    if (!role || !validRoles.includes(role)) {
      console.error(`❌ [Change Role] Invalid role: ${role}`);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_ROLE",
            message: `Invalid role. Must be one of: ${validRoles.join(", ")}`,
          },
        },
        { status: 400 },
      );
    }

    // Логирование действия
    logAdminAction(
      user!.sub || user!.email,
      "CHANGE_USER_ROLE",
      {
        userId: id,
        newRole: role,
        timestamp: new Date().toISOString(),
        adminEmail: user!.email,
      }
    );

    // ✅ Проксируем на backend
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const backendUrl = `${BACKEND_URL}/api/admin/users/${id}/role`;
    
    console.log(`📤 [Change Role] Backend request: PATCH ${backendUrl}`);
    console.log(`📋 [Change Role] New role: ${role}`);

    const backendResponse = await fetch(backendUrl, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    });

    console.log(`📥 [Change Role] Backend status: ${backendResponse.status}`);

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      console.error("❌ [Change Role] Backend error:", errorData);
      
      if (backendResponse.status === 403) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "FORBIDDEN",
              message: "Only super_admin can change roles",
            },
          },
          { status: 403 }
        );
      }
      
      if (backendResponse.status === 404) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "NOT_FOUND",
              message: "User not found",
            },
          },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "CHANGE_ROLE_FAILED",
            message: errorData.error || errorData.message || "Failed to change role",
          },
        },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    console.log("✅ [Change Role] Success:", {
      userId: id,
      newRole: role,
    });

    // ✅ Возвращаем данные в правильном формате
    return NextResponse.json({
      success: true,
      message: data.message || "Role updated successfully",
      user_id: id,
      new_role: role,
    });
  } catch (error) {
    console.error("[Change Role] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to change role",
        },
      },
      { status: 500 }
    );
  }
}
