/**
 * 📝 ПРИМЕР: Правильный Next.js API Route с proxy helper
 * 
 * ✅ Что ЕСТЬ:
 * - Использование единого proxyToBackend()
 * - Нет бизнес-логики
 * - Нет условий по ролям
 * - Нет трансформации данных
 * - Только проксирование
 * 
 * ❌ Что ЗАПРЕЩЕНО:
 * - if (user.role === 'admin') ...
 * - SQL запросы
 * - AI вызовы
 * - Сложная логика
 * - Прямые fetch() к backend (используй proxy!)
 * 
 * @see lib/api/proxy.ts
 */

import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/api/proxy";

/**
 * GET /api/admin/ingredients/suggest?q=томат&limit=10
 * 
 * Autocomplete для ингредиентов
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');
  const limit = searchParams.get('limit') || '10';
  
  // Validation (только базовая, backend сделает полную)
  if (!query || query.length < 2) {
    return Response.json({
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Query must be at least 2 characters'
      }
    }, { status: 400 });
  }
  
  // Просто проксируем на backend
  return proxyToBackend(request, {
    endpoint: `/admin/ingredients/suggest?q=${encodeURIComponent(query)}&limit=${limit}`,
    method: 'GET',
    timeout: 5000 // Short timeout for autocomplete
  });
}

/**
 * POST /api/admin/ingredients/resolve
 * 
 * Resolve ingredient name to canonical form
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  return proxyToBackend(request, {
    endpoint: '/admin/ingredients/resolve',
    method: 'POST',
    body,
    timeout: 10000
  });
}
