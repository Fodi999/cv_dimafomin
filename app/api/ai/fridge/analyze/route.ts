import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app";

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

    const { goal, preferences } = await request.json();

    if (!goal) {
      return NextResponse.json({ error: "Goal is required" }, { status: 400 });
    }

    console.log("[Decision Engine] Goal:", goal);

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
    
    // Додаємо контекстне пояснення для КОЖНОГО рецепта
    const recipesWithContext = (data.recipes || data.data?.recipes || []).map((recipe: any) => ({
      ...recipe,
      reason: getReasonForGoal(goal, recipe),
      contextMessage: getMessageForGoal(goal)
    }));
    
    // Форматуємо відповідь як AI response
    const aiFormattedResponse = {
      success: true,
      goal,
      recipes: recipesWithContext,
      message: getMessageForGoal(goal),
      usedDecisionEngine: true // маркер що це НЕ AI, а rules
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

// Helper: повідомлення для кожної мети
function getMessageForGoal(goal: AIGoal): string {
  const messages = {
    cook_now: "Znalazłem przepisy, które możesz ugotować TERAZ z lodówki!",
    expiring_soon: "Te produkty psują się w ciągu 24h - użyj je jak najszybciej!",
    save_money: "Gotuj z tego co masz - zero dodatkowych zakupów!",
    quick_meal: "Szybkie dania gotowe w 30 minut lub mniej!"
  };
  return messages[goal];
}

// Helper: причина ЧОМУ цей рецепт підходить
function getReasonForGoal(goal: AIGoal, recipe: any): string {
  const hasAllIngredients = recipe.ingredientsMissing?.length === 0;
  const matchPercent = recipe.matchPercentage || 0;
  
  switch (goal) {
    case "cook_now":
      if (hasAllIngredients) {
        return "Masz wszystkie składniki w lodówce";
      }
      return `Masz ${matchPercent}% składników - reszta to podstawowe produkty`;
    
    case "expiring_soon":
      if (recipe.expiryPriority === "critical") {
        return "Zużywa produkty, które psują się dziś!";
      }
      if (recipe.expiryPriority === "warning") {
        return "Zużywa produkty z krótkim terminem";
      }
      return "Najlepsza opcja na wykorzystanie produktów";
    
    case "save_money":
      if (hasAllIngredients) {
        return "Zero dodatkowych zakupów - oszczędzasz 100%";
      }
      const saved = recipe.economy?.savedMoney || 0;
      if (saved > 0) {
        return `Oszczędzasz ${saved.toFixed(2)} PLN używając produktów z lodówki`;
      }
      return "Maksymalne wykorzystanie tego co masz";
    
    case "quick_meal":
      const time = recipe.timeMinutes || recipe.cookingTime || 30;
      return `Gotowe w ${time} minut - proste i szybkie`;
    
    default:
      return "Dopasowane do Twoich produktów";
  }
}
