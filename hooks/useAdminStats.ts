import { useState, useEffect } from "react";

/**
 * Hook для получения общей статистики админ-панели
 * GET /api/admin/stats
 */

interface AdminStats {
  users: {
    total: number;
    active: number;
    new_today: number;
    blocked: number;
    premium: number;
  };
  recipes: {
    total: number;
    published: number;
    draft: number;
    pending_review: number;
  };
  ingredients?: {
    total: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    total_revenue: number;
  };
  treasury: {
    total_tokens: number;
    tokens_distributed: number;
    tokens_remaining: number;
  };
  ai: {
    requests_today: number;
    success_rate: number;
    avg_response_time: number;
  };
  system: {
    uptime: string;
    server_health: string;
  };
}

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        console.log("[useAdminStats] 🔍 Fetching stats");
        console.log("[useAdminStats] 🔑 Token present:", !!token);
        
        // Fetch main stats
        const response = await fetch("/api/admin/stats", {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("[useAdminStats] ❌ Error response:", errorText);
          throw new Error(`Failed to fetch admin stats: ${response.status}`);
        }

        const responseData = await response.json();
        console.log("[useAdminStats] ✅ Response received:", responseData);

        // Fetch recipes count separately if not included
        let recipesCount = 0;
        let ingredientsCount = 0;
        
        if (!responseData.totalRecipes && !responseData.data?.recipes) {
          try {
            console.log("[useAdminStats] 🔍 Fetching recipes count...");
            // Request WITHOUT limit to get all recipes count
            const recipesResponse = await fetch("/api/admin/recipes", {
              headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json',
              },
            });
            
            if (recipesResponse.ok) {
              const recipesData = await recipesResponse.json();
              
              // DEBUG: Log full response structure
              console.log("[useAdminStats] 🔍 RAW recipes response:", {
                fullData: recipesData,
                hasData: !!recipesData.data,
                hasMeta: !!recipesData.meta,
                hasTotal: !!recipesData.total,
                metaTotal: recipesData.meta?.total,
                dataTotal: recipesData.data?.total,
                topLevelTotal: recipesData.total,
                dataLength: Array.isArray(recipesData.data) ? recipesData.data.length : 'N/A',
                keys: Object.keys(recipesData),
              });
              
              // MORE DEBUG: Log as JSON
              console.log("[useAdminStats] 📄 JSON stringify:", JSON.stringify(recipesData, null, 2));
              
              // Check multiple possible locations for total count
              // FIXED: Add check for success wrapper with data array length
              recipesCount = 
                recipesData.meta?.total || 
                recipesData.total || 
                recipesData.data?.total ||
                (recipesData.success && Array.isArray(recipesData.data) ? recipesData.data.length : 0) ||
                0;
              console.log("[useAdminStats] 📚 Recipes count:", recipesCount);
            }
          } catch (err) {
            console.warn("[useAdminStats] ⚠️ Could not fetch recipes count:", err);
          }

          // Also fetch ingredients count
          try {
            console.log("[useAdminStats] 🔍 Fetching ingredients count...");
            const ingredientsResponse = await fetch("/api/admin/ingredients?limit=1", {
              headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json',
              },
            });
            
            if (ingredientsResponse.ok) {
              const ingredientsData = await ingredientsResponse.json();
              ingredientsCount = ingredientsData.meta?.total || ingredientsData.total || ingredientsData.data?.total || 0;
              console.log("[useAdminStats] 🥕 Ingredients count:", ingredientsCount);
            }
          } catch (err) {
            console.warn("[useAdminStats] ⚠️ Could not fetch ingredients count:", err);
          }
        }
        
        // Normalize response - handle different backend formats
        let normalizedData: AdminStats;

        if (responseData.success && responseData.data) {
          // Mock data format: { success: true, data: {...} }
          console.log("[useAdminStats] 📦 Using mock data format");
          normalizedData = responseData.data;
        } else if (responseData.totalUsers !== undefined && responseData.totalOrders !== undefined) {
          // Simplified backend response: { totalOrders, totalUsers, totalRecipes?, ... }
          console.log("[useAdminStats] 🔄 Converting simplified backend response");
          normalizedData = {
            users: {
              total: responseData.totalUsers || 0,
              active: responseData.activeUsers || 0,
              new_today: responseData.newUsersToday || 0,
              blocked: responseData.blockedUsers || 0,
              premium: responseData.premiumUsers || 0,
            },
            recipes: {
              total: responseData.totalRecipes || recipesCount || 0,
              published: responseData.publishedRecipes || 0,
              draft: responseData.draftRecipes || 0,
              pending_review: responseData.pendingRecipes || 0,
            },
            ingredients: {
              total: responseData.totalIngredients || ingredientsCount || 0,
            },
            orders: {
              total: responseData.totalOrders || 0,
              pending: responseData.pendingOrders || 0,
              completed: responseData.completedOrders || 0,
              total_revenue: responseData.totalRevenue || 0,
            },
            treasury: {
              total_tokens: responseData.totalTokens || 0,
              tokens_distributed: responseData.tokensDistributed || 0,
              tokens_remaining: responseData.tokensRemaining || 0,
            },
            ai: {
              requests_today: responseData.aiRequestsToday || 0,
              success_rate: responseData.aiSuccessRate || 0,
              avg_response_time: responseData.aiAvgResponseTime || 0,
            },
            system: {
              uptime: responseData.uptime || "N/A",
              server_health: responseData.serverHealth || "unknown",
            },
          };
        } else if (responseData.users && responseData.recipes) {
          // Direct full structure (no wrapper)
          console.log("[useAdminStats] 📊 Using direct data format");
          normalizedData = responseData;
        } else {
          console.error("[useAdminStats] ❌ Unknown response format:", responseData);
          throw new Error("Invalid response format - missing required fields");
        }

        console.log("[useAdminStats] ✅ Normalized data:", normalizedData);
        setStats(normalizedData);
      } catch (err) {
        console.error("[useAdminStats] ❌ Error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
  };
}
