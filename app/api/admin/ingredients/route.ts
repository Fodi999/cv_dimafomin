import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/middleware";
import { proxyToBackend } from "@/lib/api/proxy";

/**
 * GET /api/admin/ingredients
 * Получить список всех ингредиентов с фильтрацией
 * Проксирует запрос к /api/admin/ingredients бэкенда
 */
export async function GET(request: NextRequest) {
  // Check admin access
  const { user, error } = await requireAdmin(request);
  if (error) return error;

  // Proxy to backend with all query params
  return proxyToBackend(request, {
    endpoint: '/api/admin/ingredients',
    method: 'GET'
  });
}

/**
 * POST /api/admin/ingredients
 * Создать новый ингредиент
 * Backend сам определяет category, unit и переводит на все языки через AI
 */
export async function POST(request: NextRequest) {
  // Check admin access
  const { user, error } = await requireAdmin(request);
  if (error) return error;

  // Validate inputName before proxying
  const body = await request.json();
  if (!body.inputName?.trim()) {
    return NextResponse.json(
      { error: 'inputName is required' },
      { status: 400 }
    );
  }

  // Proxy to backend
  return proxyToBackend(request, {
    endpoint: '/api/admin/ingredients',
    method: 'POST',
    body: { inputName: body.inputName.trim() }
  });
}
