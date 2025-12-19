import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app";

export async function POST(request: NextRequest) {
  console.log("🔷 API /api/ai/create-recipe-from-fridge called");
  
  try {
    const authHeader = request.headers.get("Authorization");
    console.log("🔑 Auth header:", authHeader ? "present" : "missing");
    
    if (!authHeader) {
      console.error("❌ No authorization header");
      return NextResponse.json(
        { success: false, error: "Brak tokenu autoryzacji" },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("📦 Request body:", body);
    
    const { language = "pl" } = body;

    // Call backend to create recipe from fridge
    const backendUrl = `${BACKEND_URL}/api/ai/fridge/analyze`;
    console.log("🌐 Calling backend:", backendUrl);
    
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        goal: "today_meals",
        preferences: { time: "normal", budget: "normal" },
        language,
      }),
    });

    console.log("📡 Backend response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Backend error:", errorData);
      return NextResponse.json(
        {
          success: false,
          error: errorData.error || "Błąd podczas tworzenia przepisu",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("📦 Backend response data:", JSON.stringify(data, null, 2));

    // Check if backend returned success: false
    if (!data.success) {
      console.log("⚠️ Backend returned success: false");
      return NextResponse.json({
        success: false,
        data: {
          message: data.data?.message || data.error || "Nie udało się wygenerować przepisu.",
        },
      });
    }

    // Backend can return recipe in two formats:
    // 1. New format: data.recipe (object) - preferred
    // 2. Old format: data.result (JSON string) - fallback
    let recipe;
    
    if (data.data?.recipe) {
      // New format - recipe is already an object
      recipe = data.data.recipe;
      console.log("✅ Using new format (data.recipe):", recipe.name);
    } else if (data.data?.result) {
      // Old format - need to parse JSON string
      const resultString = data.data.result;
      console.log("🔍 Using old format (data.result), parsing...");
      
      try {
        recipe = JSON.parse(resultString);
        console.log("✅ Parsed recipe:", recipe.title || recipe.name);
      } catch (e) {
        console.error("❌ Failed to parse recipe JSON:", e);
        
        // Try to fix truncated JSON by removing incomplete parts and closing structures
        try {
          let fixedString = resultString.trim();
          
          // Remove incomplete property at the end (e.g., "expires_priority without value)
          // This regex removes trailing incomplete key-value pairs
          fixedString = fixedString.replace(/,\s*"[^"]*$/, ''); // Remove incomplete key
          fixedString = fixedString.replace(/,\s*$/, ''); // Remove trailing comma
          
          // Count quotes to see if string is unclosed
          const quoteCount = (fixedString.match(/"/g) || []).length;
          if (quoteCount % 2 !== 0) {
            fixedString += '"'; // Close unclosed string
          }
          
          // Close arrays if needed
          const openBrackets = (fixedString.match(/\[/g) || []).length;
          const closeBrackets = (fixedString.match(/\]/g) || []).length;
          for (let i = 0; i < openBrackets - closeBrackets; i++) {
            fixedString += ']';
          }
          
          // Close object
          const openBraces = (fixedString.match(/\{/g) || []).length;
          const closeBraces = (fixedString.match(/\}/g) || []).length;
          for (let i = 0; i < openBraces - closeBraces; i++) {
            fixedString += '}';
          }
          
          recipe = JSON.parse(fixedString);
          console.log("✅ Fixed and parsed truncated JSON:", recipe.title || recipe.name);
        } catch (fixError) {
          console.error("❌ Could not fix truncated JSON:", fixError);
          return NextResponse.json({
            success: false,
            data: {
              message: "Błąd podczas przetwarzania przepisu.",
            },
          });
        }
      }
    } else {
      console.error("❌ No recipe data in response");
      return NextResponse.json({
        success: false,
        data: {
          message: "Nie udało się wygenerować przepisu. Spróbuj ponownie.",
        },
      });
    }

    console.log("✅ Returning recipe successfully");
    return NextResponse.json({
      success: true,
      data: {
        recipe: {
          title: recipe.title || recipe.name || "Przepis z AI",
          description: recipe.description || "",
          ingredients: recipe.ingredientsUsed || recipe.ingredients_used || [],
          ingredientsMissing: recipe.ingredientsMissing || [],
          steps: recipe.steps || [],
          servings: recipe.portions || 2,
          timeMinutes: recipe.cookingTime || recipe.cooking_time || 30,
          difficulty: recipe.difficulty || "średni",
          imageUrl: recipe.imageUrl || null,
          chefTips: recipe.chefTips || [],
          expiryPriority: recipe.expiryPriority || recipe.expires_priority || null,
          economy: recipe.economy || null,
        },
        usedProducts: (recipe.ingredientsUsed || recipe.ingredients_used || []).map((ing: any) => ({
          name: ing.name,
          usedAmount: ing.quantity,
          unit: ing.unit,
        })),
      },
    });
  } catch (error: any) {
    console.error("Error creating recipe from fridge:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Błąd serwera",
      },
      { status: 500 }
    );
  }
}
