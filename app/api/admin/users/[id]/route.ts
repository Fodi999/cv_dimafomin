import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, logAdminAction } from "@/lib/api/middleware";
import { getBackendUrl } from "@/lib/api/backend-url";
const BACKEND_URL = process.env.BACKEND_URL || "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app";

// Mock user details (для fallback)
const mockUserDetails: Record<string, any> = {
  usr_1: {
    id: "usr_1",
    name: "Олександр Коваленко",
    email: "alex.kovalenko@example.com",
    phone: "+380501234567",
    role: "admin",
    status: "active",
    joinedAt: "2024-01-15T10:00:00Z",
    lastActiveAt: "2025-01-04T14:30:00Z",
    locale: "uk",
    timezone: "Europe/Kyiv",
    stats: {
      ordersCount: 45,
      totalSpent: 1250,
      recipesCreated: 12,
      aiRequests: 230,
    },
  },
  usr_2: {
    id: "usr_2",
    name: "Марія Шевченко",
    email: "maria.shevchenko@example.com",
    phone: "+380502345678",
    role: "premium",
    status: "active",
    joinedAt: "2024-02-20T12:00:00Z",
    lastActiveAt: "2025-01-04T09:15:00Z",
    locale: "uk",
    timezone: "Europe/Kyiv",
    stats: {
      ordersCount: 32,
      totalSpent: 890,
      recipesCreated: 8,
      aiRequests: 156,
    },
  },
  usr_3: {
    id: "usr_3",
    name: "Іван Петренко",
    email: "ivan.petrenko@example.com",
    phone: undefined,
    role: "user",
    status: "active",
    joinedAt: "2024-03-10T08:00:00Z",
    lastActiveAt: "2025-01-03T16:45:00Z",
    locale: "uk",
    timezone: "Europe/Kyiv",
    stats: {
      ordersCount: 12,
      totalSpent: 340,
      recipesCreated: 3,
      aiRequests: 45,
    },
  },
  usr_4: {
    id: "usr_4",
    name: "Анна Мельник",
    email: "anna.melnyk@example.com",
    phone: "+380503456789",
    role: "premium",
    status: "inactive",
    joinedAt: "2024-01-05T14:00:00Z",
    lastActiveAt: "2024-12-30T11:20:00Z",
    locale: "uk",
    timezone: "Europe/Kyiv",
    stats: {
      ordersCount: 28,
      totalSpent: 720,
      recipesCreated: 6,
      aiRequests: 98,
    },
  },
  usr_5: {
    id: "usr_5",
    name: "Дмитро Бойко",
    email: "dmitro.boyko@example.com",
    phone: undefined,
    role: "user",
    status: "blocked",
    joinedAt: "2024-04-12T09:00:00Z",
    lastActiveAt: "2024-12-01T13:00:00Z",
    locale: "uk",
    timezone: "Europe/Kyiv",
    stats: {
      ordersCount: 3,
      totalSpent: 85,
      recipesCreated: 1,
      aiRequests: 12,
    },
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // 🔐 Проверка админских прав
  const { user, error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;

  // Логирование действия
  logAdminAction(user!.sub || user!.email, "GET_USER_DETAILS", { 
    userId: id,
    email: user!.email 
  });

  const userDetails = mockUserDetails[id];

  if (!userDetails) {
    return NextResponse.json(
      {
        error: {
          code: "NOT_FOUND",
          message: "User not found",
        },
      },
      { status: 404 }
    );
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return NextResponse.json(userDetails);
}

/**
 * PUT /api/admin/users/[userId]
 * Обновить данные пользователя
 * 
 * Body:
 * {
 *   "name": "New Name",
 *   "email": "newemail@example.com"
 * }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // 🔐 Проверка админских прав
  const { user, error } = await requireAdmin(request);
  if (error) return error;

  const { id } = await params;

  try {
    const body = await request.json();
    const { name, email } = body;

    // Проверка существования пользователя
    if (!mockUserDetails[id]) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "User not found",
          },
        },
        { status: 404 }
      );
    }

    // Валидация данных
    if (!name && !email) {
      return NextResponse.json(
        {
          error: {
            code: "MISSING_DATA",
            message: "At least one field (name or email) is required",
          },
        },
        { status: 400 }
      );
    }

    // Валидация email
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_EMAIL",
            message: "Invalid email format",
          },
        },
        { status: 400 }
      );
    }

    // Логирование действия
    logAdminAction(
      user!.sub || user!.email,
      "UPDATE_USER",
      {
        userId: id,
        changes: { name, email },
        timestamp: new Date().toISOString(),
        adminEmail: user!.email,
      }
    );

    // TODO: Обновить данные в базе данных
    // await db.users.update({
    //   where: { id },
    //   data: { 
    //     ...(name && { name }),
    //     ...(email && { email })
    //   }
    // });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Обновляем mock данные для демонстрации
    const updatedUser = {
      ...mockUserDetails[id],
      ...(name && { name }),
      ...(email && { email }),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("[API] Update user error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to update user",
        },
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[userId]
 * Удалить пользователя (только super_admin!)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  console.log("\n🗑️ ===== DELETE /api/admin/users/[id] =====");
  
  // 🔐 Проверка админских прав
  const { user, error } = await requireAdmin(request);
  if (error) {
    console.error("❌ [DELETE User] Unauthorized");
    return error;
  }

  console.log(`✅ [DELETE User] Admin: ${user!.email} (role: ${user!.role})`);

  // 🔥 КРИТИЧНО: Только super_admin может удалять!
  if (user!.role !== "super_admin") {
    console.error(`❌ [DELETE User] Forbidden: ${user!.role} tried to delete user`);
    return NextResponse.json(
      {
        error: {
          code: "FORBIDDEN",
          message: "Only super_admin can delete users",
        },
      },
      { status: 403 }
    );
  }

  const { id } = await params;
  console.log(`🎯 [DELETE User] Target user ID: ${id}`);

  try {
    // Запретить удаление самого себя
    if (user!.sub === id) {
      console.error("❌ [DELETE User] Cannot delete self");
      return NextResponse.json(
        {
          error: {
            code: "FORBIDDEN",
            message: "Cannot delete your own account",
          },
        },
        { status: 403 }
      );
    }

    // 🔥 Удаление через бэкенд
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    const backendUrl = `${BACKEND_URL}/api/admin/users/${id}`;
    
    console.log(`📤 [DELETE User] Backend request: DELETE ${backendUrl}`);

    const backendResponse = await fetch(backendUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log(`📥 [DELETE User] Backend status: ${backendResponse.status}`);

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      console.error("❌ [DELETE User] Backend error:", errorData);
      
      return NextResponse.json(
        {
          error: {
            code: "DELETE_FAILED",
            message: errorData.message || "Failed to delete user",
          },
        },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();
    console.log("✅ [DELETE User] Success:", data);

    // Логирование действия
    logAdminAction(
      user!.sub || user!.email,
      "DELETE_USER",
      {
        userId: id,
        timestamp: new Date().toISOString(),
        adminEmail: user!.email,
        adminRole: user!.role,
      }
    );

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
      data: {
        userId: id,
        deletedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[DELETE User] Error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to delete user",
        },
      },
      { status: 500 }
    );
  }
}
