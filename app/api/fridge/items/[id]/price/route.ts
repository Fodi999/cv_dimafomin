import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

/**
 * POST /api/fridge/items/{id}/price
 * Добавить price-event для продукта (event sourcing)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get token from Authorization header
    const token = request.headers.get("authorization");

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Token not found" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Валидация входных данных
    if (typeof body.pricePerUnit !== "number" || body.pricePerUnit <= 0) {
      return NextResponse.json(
        { error: "Invalid pricePerUnit: must be a positive number" },
        { status: 400 }
      );
    }

    if (!body.currency || typeof body.currency !== "string") {
      return NextResponse.json(
        { error: "Invalid currency: must be a string" },
        { status: 400 }
      );
    }

    if (!body.source || typeof body.source !== "string") {
      return NextResponse.json(
        { error: "Invalid source: must be one of 'manual', 'receipt', 'estimate', 'market', 'ai'" },
        { status: 400 }
      );
    }

    // Проксируем запрос на бэкенд (POST для создания price-event)
    const response = await fetch(`${API_BASE}/api/fridge/items/${id}/price`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        pricePerUnit: body.pricePerUnit,
        currency: body.currency,
        source: body.source,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend POST /fridge/items/:id/price error:", errorText);
      return NextResponse.json(
        { error: "Failed to add item price" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error adding item price:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
