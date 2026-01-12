import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, logAdminAction } from "@/lib/api/middleware";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app';

/**
 * GET /api/admin/users/stats
 * Получить статистику пользователей с бэкенда
 * 
 * Response format:
 * {
 *   total: number,
 *   active?: number,
 *   new_today?: number,
 *   new_this_week?: number,
 *   new_this_month?: number,
 *   blocked?: number,
 *   by_role?: {
 *     admin: number,
 *     home_chef: number,
 *     pro_chef: number,
 *     investor: number
 *   }
 * }
 */
export async function GET(request: NextRequest) {
  // 🔐 Проверка админских прав
  const { user, error } = await requireAdmin(request);
  if (error) return error;

  // Логирование действия
  logAdminAction(
    user!.sub || user!.email,
    "GET_USERS_STATS",
    {
      timestamp: new Date().toISOString(),
      adminEmail: user!.email,
    }
  );

  try {
    // Get token from request headers
    const authHeader = request.headers.get('Authorization');
    
    console.log('[Users Stats API] � Fetching ALL users from backend (paginated)...');
    
    // 🔥 Backend ignores limit, so we need to fetch ALL pages
    let allUsers: any[] = [];
    let currentPage = 1;
    const limit = 50; // Fetch 50 per page
    let hasMorePages = true;
    
    while (hasMorePages) {
      const pageUrl = `${BACKEND_URL}/api/admin/users?page=${currentPage}&limit=${limit}`;
      console.log(`[Users Stats API] � Fetching page ${currentPage}...`);
      
      const backendResponse = await fetch(pageUrl, {
        method: 'GET',
        headers: {
          'Authorization': authHeader || '',
          'Content-Type': 'application/json',
        },
      });

      if (!backendResponse.ok) {
        console.error('[Users Stats API] ❌ Backend error:', backendResponse.status);
        
        // Return stats from what we have so far
        if (allUsers.length > 0) {
          break; // Stop fetching, use what we have
        }
        
        // If no users at all, return error
        return NextResponse.json({
          total: 0,
          error: 'Backend unavailable',
        }, { status: 503 });
      }

      const data = await backendResponse.json();
      const pageUsers = data.users || [];
      
      console.log(`[Users Stats API] ✅ Page ${currentPage}: ${pageUsers.length} users`);
      
      allUsers = allUsers.concat(pageUsers);
      
      // Check if there are more pages
      // Backend returns 20 users per page by default, so if we get less than limit, we're done
      if (pageUsers.length < limit) {
        hasMorePages = false;
      } else {
        currentPage++;
      }
      
      // Safety check: don't fetch more than 20 pages (1000 users)
      if (currentPage > 20) {
        console.warn('[Users Stats API] ⚠️ Stopped at 20 pages (safety limit)');
        hasMorePages = false;
      }
    }
    
    console.log(`[Users Stats API] ✅ Total users fetched: ${allUsers.length}`);
    
    // Calculate stats from all collected users
    const users = allUsers;
    const total = users.length;
    
    // Count by role and status
    const roleCount: Record<string, number> = {};
    let blocked = 0;
    let activeToday = 0;
    let premium = 0;
    
    // 🔥 "Сегодня" = с 00:00 текущего дня (DATE_TRUNC('day', NOW()))
    // НЕ "за последние 24 часа" - это важно для стабильности метрик!
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    console.log('[Users Stats API] 📅 Today starts at:', todayStart.toISOString());
    
    users.forEach((user: any) => {
      // Count by role
      const role = user.role || 'home_chef';
      roleCount[role] = (roleCount[role] || 0) + 1;
      
      // Count blocked users (по статусу)
      if (user.status === 'blocked') {
        blocked++;
      }
      
      // Count premium users (по роли)
      if (user.role === 'premium' || user.role === 'pro_chef') {
        premium++;
      }
      
      // Count active today (по lastLogin - Go backend использует camelCase!)
      // 🔥 "Сегодня" = с 00:00, не "за 24 часа"
      const lastLoginField = user.lastLogin || user.last_login || user.last_login_at;
      if (lastLoginField) {
        const lastLogin = new Date(lastLoginField);
        if (lastLogin >= todayStart) {
          activeToday++;
        }
      }
    });
    
    console.log('[Users Stats API] 📊 Final counts:', {
      total,
      activeToday,
      blocked,
      premium,
      todayStartsAt: todayStart.toISOString(),
      definition: 'active_today = users who logged in since 00:00 today (not last 24h)',
      usersWithLastLogin: users.filter((u: any) => u.lastLogin || u.last_login || u.last_login_at).length,
    });
    
    const stats = {
      total,
      active_today: activeToday, // Сколько заходили сегодня
      blocked,                    // Сколько заблокированы
      premium: premium > 0 ? premium : undefined, // Показываем только если есть
      by_role: {
        admin: roleCount['admin'] || 0,
        home_chef: roleCount['home_chef'] || 0,
        pro_chef: roleCount['pro_chef'] || 0,
        investor: roleCount['investor'] || 0,
      }
    };
    
    console.log('[Users Stats API] 📊 Stats calculated:', stats);
    
    return NextResponse.json(stats);
    
  } catch (error) {
    console.error("[Users Stats API] ❌ Error:", error);
    
    return NextResponse.json({
      total: 0,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

