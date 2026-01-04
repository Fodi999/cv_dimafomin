import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();
  const { status, reason } = body;

  // Validate status
  if (!status || !["active", "blocked", "inactive"].includes(status)) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_STATUS",
          message:
            "Невалідний статус. Допустимі значення: active, blocked, inactive",
        },
      },
      { status: 400 },
    );
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // TODO: Update user status in database
  // TODO: Log action to admin_activity_log with reason
  // TODO: If blocked, logout user and invalidate sessions

  return NextResponse.json({
    success: true,
    user: {
      id: id,
      status: status,
    },
  });
}
