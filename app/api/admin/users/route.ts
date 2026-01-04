import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, logAdminAction } from "@/lib/api/middleware";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app';

export async function GET(request: NextRequest) {
  // 🔐 Проверка админских прав
  const { user, error } = await requireAdmin(request);
  if (error) return error;

  // Логирование действия
  logAdminAction(user!.sub || user!.email, 'GET_USERS', { 
    timestamp: new Date().toISOString(),
    email: user!.email 
  });

  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    // 🔍 Логирование фильтров
    console.log('[Admin Users API] 🔍 Filters from frontend:', {
      search: searchParams.get('search'),
      status: searchParams.get('status'),
      role: searchParams.get('role'),
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      fullQueryString: queryString,
    });
    
    // Get token from request headers
    const authHeader = request.headers.get('Authorization');
    
    console.log('[Admin Users API] 📡 Proxying to backend:', `${BACKEND_URL}/api/admin/users?${queryString}`);
    
    // 🔄 Proxy request to Go backend
    const backendResponse = await fetch(`${BACKEND_URL}/api/admin/users?${queryString}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader || '',
        'Content-Type': 'application/json',
      },
    });

    console.log('[Admin Users API] 📥 Backend response status:', backendResponse.status);

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error('[Admin Users API] ❌ Backend error:', {
        status: backendResponse.status,
        statusText: backendResponse.statusText,
        body: errorText,
      });
      
      // If backend fails, return mock data as fallback
      console.log('[Admin Users API] ⚠️ Using fallback mock data');
      return getMockUsersResponse(request);
    }

    const data = await backendResponse.json();
    console.log('[Admin Users API] ✅ Backend response received:', {
      usersCount: data.users?.length || 0,
      total: data.meta?.total,
      hasUsers: !!data.users,
      hasMeta: !!data.meta,
    });
    
    // 🔄 Преобразуем поля Go backend (camelCase) в формат фронтенда
    if (data.users && Array.isArray(data.users)) {
      data.users = data.users.map((user: any) => ({
        ...user,
        // 🔥 Маппинг: Go backend использует lastLogin, фронтенд ожидает lastActiveAt
        lastActiveAt: user.lastLogin || user.last_login || user.lastActiveAt,
        joinedAt: user.createdAt || user.created_at || user.joinedAt,
      }));
    }
    
    // ✅ Если backend вернул users, но нет meta - создаём meta из данных
    if (data.users && !data.meta) {
      console.log('[Admin Users API] ⚠️ Backend returned users without meta, creating meta from data');
      
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "20");
      
      data.meta = {
        total: data.users.length,  // или data.total если backend возвращает
        activeToday: 0,  // TODO: backend should provide this
        blocked: 0,      // TODO: backend should provide this
        premium: 0,      // TODO: backend should provide this
        page,
        limit,
        totalPages: Math.ceil(data.users.length / limit),
      };
    }
    
    // Return backend data
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('[Admin Users API] ❌ Error:', error);
    
    // Fallback to mock data on error
    console.log('[Admin Users API] ⚠️ Using fallback mock data due to error');
    return getMockUsersResponse(request);
  }
}

// Fallback mock data function
function getMockUsersResponse(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const mockUsers = [
    {
      id: "usr_1",
      name: "Олександр Коваленко",
      email: "alex.kovalenko@example.com",
      role: "admin",
      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "usr_2",
      name: "Марія Шевченко",
      email: "maria.shevchenko@example.com",
      role: "premium",
      createdAt: "2024-02-20T12:00:00Z",
    },
    {
      id: "usr_3",
      name: "Іван Петренко",
      email: "ivan.petrenko@example.com",
      role: "user",
      createdAt: "2024-03-10T08:00:00Z",
    },
    {
      id: "usr_4",
      name: "Анна Мельник",
      email: "anna.melnyk@example.com",
      role: "premium",
      createdAt: "2024-01-05T14:00:00Z",
    },
    {
      id: "usr_5",
      name: "Дмитро Бойко",
      email: "dmitro.boyko@example.com",
      role: "user",
      createdAt: "2024-04-12T09:00:00Z",
    },
  ];

  return NextResponse.json({
    users: mockUsers,
    meta: {
      total: 5,
      activeToday: 5.1,
      blocked: 1,
      premium: 2,
      page: page,
      limit: limit,
      totalPages: 1,
    },
  });
}
