import { NextResponse } from "next/server";
import { getBackendUrl } from "@/lib/api/backend-url";
const BACKEND_URL = getBackendUrl();

/**
 * GET /api/stats/public
 * Public statistics for homepage (no auth required)
 */
export async function GET() {
  try {
    // Fetch users count from backend
    let usersCount = 100; // Fallback
    try {
      const usersRes = await fetch(`${BACKEND_URL}/api/admin/users/stats`, {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        usersCount = usersData.total || usersData.totalUsers || usersData.count || 100;
        console.log('[Public Stats] Users count from backend:', usersCount);
      }
    } catch (usersError) {
      console.error('[Public Stats] Error fetching users:', usersError);
    }

    // Fetch ingredients count
    const ingredientsRes = await fetch(`${BACKEND_URL}/api/catalog/ingredients`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    let ingredientsCount = 214; // Fallback
    if (ingredientsRes.ok) {
      const data = await ingredientsRes.json();
      ingredientsCount = Array.isArray(data) ? data.length : data.total || data.count || 214;
    }

    // Fetch recipes count from backend
    let recipesCount = 16; // Fallback based on your admin data
    try {
      const recipesRes = await fetch(`${BACKEND_URL}/api/recipes`, {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (recipesRes.ok) {
        const recipesData = await recipesRes.json();
        // Try to get count from various possible response structures
        recipesCount = recipesData.total || 
                      recipesData.count || 
                      (Array.isArray(recipesData.data) ? recipesData.data.length : 0) ||
                      (Array.isArray(recipesData.recipes) ? recipesData.recipes.length : 0) ||
                      (Array.isArray(recipesData) ? recipesData.length : 16);
        
        console.log('[Public Stats] Recipes count from backend:', recipesCount);
      }
    } catch (recipesError) {
      console.error('[Public Stats] Error fetching recipes:', recipesError);
    }

    return NextResponse.json({
      usersCount,
      recipesCount,
      ingredientsCount,
      aiOnline: true,
    });
  } catch (error) {
    console.error("[Public Stats] Error:", error);
    
    // Return fallback data
    return NextResponse.json({
      usersCount: 100,
      recipesCount: 16,
      ingredientsCount: 214,
      aiOnline: true,
    });
  }
}
