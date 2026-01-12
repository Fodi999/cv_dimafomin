import { NextRequest, NextResponse } from "next/server";
import { getFridgeAnalysisPrompt, isValidLocale, type Locale } from "@/lib/ai-prompts";
import { getMessageForGoal, getReasonForGoal } from "@/lib/decision-engine-messages";
import { getBackendUrl } from "@/lib/api/backend-url";

const BACKEND_URL = getBackendUrl();

type AIGoal =
  | "cook_now"
  | "expiring_soon"
  | "save_money"
  | "quick_meal";

// 🔥 DECISION ENGINE - Правила вибору рецептів (НЕ AI!)
// AI = помощник, НЕ decision-maker. Використовуємо deterministic rules.
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's language from Accept-Language header
    const acceptLanguage = request.headers.get("Accept-Language") || "pl";
    const userLanguage = isValidLocale(acceptLanguage) ? acceptLanguage : "pl";

    const { goal, preferences } = await request.json();

    if (!goal) {
      return NextResponse.json({ error: "Goal is required" }, { status: 400 });
    }

    console.log("[Decision Engine] Goal:", goal, "| Language:", userLanguage);

    // Використовуємо /recipes/match замість AI
    // Decision engine: правила фільтрації рецептів
    const params = new URLSearchParams();
    
    switch (goal) {
      case "cook_now":
        params.append("availableOnly", "true");
        params.append("sortBy", "matchPercentage");
        break;
      case "expiring_soon":
        params.append("expiringSoon", "true");
        params.append("sortBy", "daysLeft");
        break;
      case "save_money":
        params.append("availableOnly", "true");
        params.append("sortBy", "economyScore");
        break;
      case "quick_meal":
        params.append("maxTime", "30");
        params.append("sortBy", "prepTime");
        break;
    }

    params.append("limit", "10");

    console.log("[Decision Engine] Using /recipes/match with params:", params.toString());

    // ✅ Використовуємо ФРОНТЕНД proxy (не backend напряму!)
    // Це гарантує правильну передачу токену і testUserID
    const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 
                    `http://localhost:${process.env.PORT || 3000}`;
    
    const matchResponse = await fetch(`${baseUrl}/api/recipes/match?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: token, // token вже має "Bearer "
        "Content-Type": "application/json",
      },
    });

    if (!matchResponse.ok) {
      const errorText = await matchResponse.text();
      console.error("[Decision Engine] Backend error:", errorText);
      return NextResponse.json(
        { error: "Recipe matching failed", details: errorText },
        { status: matchResponse.status }
      );
    }

    const data = await matchResponse.json();
    
    // Додаємо контекстне пояснення для КОЖНОГО рецепта з правильною мовою
    const recipesWithContext = (data.recipes || data.data?.recipes || []).map((recipe: any) => ({
      ...recipe,
      reason: getReasonForGoal(goal, recipe, userLanguage),
      contextMessage: getMessageForGoal(goal, userLanguage)
    }));
    
    // Форматуємо відповідь як AI response
    const aiFormattedResponse = {
      success: true,
      goal,
      recipes: recipesWithContext,
      message: getMessageForGoal(goal, userLanguage),
      usedDecisionEngine: true, // маркер що це НЕ AI, а rules
      language: userLanguage // передаємо мову назад для перевірки
    };

    return NextResponse.json(aiFormattedResponse);
  } catch (err) {
    console.error("[Decision Engine] Fatal error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
