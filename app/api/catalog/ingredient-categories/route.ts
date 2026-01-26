import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/api/proxy';

/**
 * Ingredient Categories API Route
 * 
 * Публичный endpoint - категории доступны без авторизации
 * Если токен есть, передается в backend для расширенных данных
 */
export async function GET(req: NextRequest) {
  return proxyToBackend(req, {
    endpoint: '/api/catalog/ingredient-categories',
    method: 'GET',
    skipAuth: true // Опциональная авторизация - передаем токен если есть, но не требуем
  });
}
