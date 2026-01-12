import { NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/api/backend-url";
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const { role } = body;

  // Validate role
  if (!role || !["user", "admin", "premium"].includes(role)) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_ROLE",
          message: "Невалідна роль. Допустимі значення: user, admin, premium",
        },
      },
      { status: 400 },
    );
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // TODO: Update user role in database
  // TODO: Log action to admin_activity_log

  return NextResponse.json({
    success: true,
    user: {
      id: id,
      role: role,
    },
  });
}
