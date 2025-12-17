import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app";

type AIGoal =
  | "today_meals"
  | "3_days_plan"
  | "reduce_waste"
  | "budget_review";

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { goal, preferences } = await request.json();

    if (!goal) {
      return NextResponse.json({ error: "Goal is required" }, { status: 400 });
    }

    console.log("[AI Proxy] Goal:", goal);

    const aiResponse = await fetch(`${API_BASE}/api/ai/fridge/analyze`, {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        goal,
        preferences: preferences || {
          time: "normal",
          budget: "normal"
        },
      }),
    });

    const text = await aiResponse.text();

    if (!aiResponse.ok) {
      console.error("[AI Proxy] Backend error:", text);
      return NextResponse.json(
        { error: "AI analysis failed", details: text },
        { status: aiResponse.status }
      );
    }

    return new NextResponse(text, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[AI Proxy] Fatal error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
