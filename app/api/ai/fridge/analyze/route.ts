import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app";

type AIGoal = "recipe_today" | "plan_3days" | "use_expiring" | "spending_analysis";

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { goal } = body as { goal: AIGoal };

    if (!goal) {
      return NextResponse.json(
        { error: "Goal is required" },
        { status: 400 }
      );
    }

    console.log(`[AI Fridge Analyze] Goal: ${goal}`);

    // Получаем продукты из холодильника
    const itemsResponse = await fetch(`${API_BASE}/api/fridge/items`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!itemsResponse.ok) {
      console.error("[AI Fridge Analyze] Failed to fetch items:", itemsResponse.statusText);
      return NextResponse.json(
        { error: "Failed to fetch fridge items" },
        { status: itemsResponse.status }
      );
    }

    const itemsData = await itemsResponse.json();
    const items = itemsData.data || [];

    console.log(`[AI Fridge Analyze] Fetched ${items.length} items`);

    // Отправляем в AI на бекенд
    const aiResponse = await fetch(`${API_BASE}/api/ai/fridge/analyze`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        goal,
        items,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("[AI Fridge Analyze] AI analysis failed:", errorText);
      return NextResponse.json(
        { error: "AI analysis failed", details: errorText },
        { status: aiResponse.status }
      );
    }

    const aiResult = await aiResponse.json();
    console.log("[AI Fridge Analyze] Success:", aiResult);

    return NextResponse.json(aiResult);
  } catch (error) {
    console.error("[AI Fridge Analyze] Error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
