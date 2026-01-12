import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json(
        { error: "Brak tokenu autoryzacji" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { ingredients } = body;

    if (!ingredients || !Array.isArray(ingredients)) {
      return NextResponse.json(
        { error: "Brak listy składników" },
        { status: 400 }
      );
    }

    // Proxy request to backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app";
    const response = await fetch(`${backendUrl}/api/fridge/deduct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ ingredients }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || errorData.error || "Błąd podczas odejmowania składników" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: data.message || "Składniki zostały odjęte z lodówki",
      deducted: data.deducted || ingredients,
      remaining: data.remaining,
      totalValue: data.totalValue,
    });

  } catch (error: any) {
    console.error("Deduct API Error:", error);
    return NextResponse.json(
      { error: error.message || "Błąd serwera" },
      { status: 500 }
    );
  }
}
