/**
 * API Middleware для защиты эндпоинтов
 * 
 * Предоставляет функции для:
 * - Проверки JWT токена
 * - Валидации роли пользователя
 * - Защиты admin маршрутов
 */

import { NextRequest, NextResponse } from "next/server";

interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

/**
 * Декодирует JWT токен без проверки подписи
 * В production должна быть реальная проверка через jsonwebtoken или jose
 */
function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    return payload as JWTPayload;
  } catch (error) {
    console.error('[middleware] JWT decode error:', error);
    return null;
  }
}

/**
 * Проверяет валидность JWT токена
 */
function isTokenValid(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload) return false;

  // Проверка срока действия
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) {
    console.warn('[middleware] Token expired');
    return false;
  }

  return true;
}

/**
 * Извлекает токен из заголовка Authorization
 */
function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader) {
    return null;
  }

  // Поддержка формата "Bearer {token}"
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return authHeader;
}

/**
 * Middleware для проверки аутентификации
 * Проверяет наличие и валидность JWT токена
 * 
 * @returns { user, error } - данные пользователя или ошибка
 */
export async function authMiddleware(request: NextRequest): Promise<{
  user: JWTPayload | null;
  error: NextResponse | null;
}> {
  const token = extractToken(request);

  if (!token) {
    return {
      user: null,
      error: NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authorization token is required'
          }
        },
        { status: 401 }
      )
    };
  }

  if (!isTokenValid(token)) {
    return {
      user: null,
      error: NextResponse.json(
        {
          error: {
            code: 'INVALID_TOKEN',
            message: 'Invalid or expired token'
          }
        },
        { status: 401 }
      )
    };
  }

  const user = decodeJWT(token);
  
  // 🐛 Debug: Log JWT payload structure
  console.log('[authMiddleware] JWT payload:', JSON.stringify(user, null, 2));
  
  if (!user) {
    return {
      user: null,
      error: NextResponse.json(
        {
          error: {
            code: 'INVALID_TOKEN',
            message: 'Failed to decode token'
          }
        },
        { status: 401 }
      )
    };
  }

  return { user, error: null };
}

/**
 * Middleware для проверки админских прав
 * Должен вызываться после authMiddleware
 * 
 * @param user - данные пользователя из authMiddleware
 * @returns { error } - ошибка если пользователь не админ
 */
export function adminMiddleware(user: JWTPayload | null): {
  error: NextResponse | null;
} {
  if (!user) {
    return {
      error: NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required'
          }
        },
        { status: 401 }
      )
    };
  }

  // 🔑 Support all role variants: admin, superadmin (camelCase), super_admin (snake_case)
  const allowedRoles = ['admin', 'superadmin', 'super_admin'];
  
  if (!allowedRoles.includes(user.role?.toLowerCase())) {
    console.warn('[adminMiddleware] Access denied for role:', user.role);
    return {
      error: NextResponse.json(
        {
          error: {
            code: 'FORBIDDEN',
            message: 'Admin access required'
          }
        },
        { status: 403 }
      )
    };
  }

  console.log('[adminMiddleware] ✅ Access granted for role:', user.role);
  return { error: null };
}

/**
 * Комбинированная проверка аутентификации + админских прав
 * Удобная обёртка для использования в admin эндпоинтах
 * 
 * @example
 * const { user, error } = await requireAdmin(request);
 * if (error) return error;
 * // user теперь гарантированно админ
 */
export async function requireAdmin(request: NextRequest): Promise<{
  user: JWTPayload | null;
  error: NextResponse | null;
}> {
  // Шаг 1: Проверка аутентификации
  const authResult = await authMiddleware(request);
  if (authResult.error) {
    return authResult;
  }

  // Шаг 2: Проверка админских прав
  const adminResult = adminMiddleware(authResult.user);
  if (adminResult.error) {
    return { user: null, error: adminResult.error };
  }

  return { user: authResult.user, error: null };
}

/**
 * Вспомогательная функция для логирования админских действий
 * В production должна сохранять в БД
 */
export function logAdminAction(
  adminId: string | undefined,
  action: string,
  details: Record<string, any>
): void {
  // Используем email как fallback если нет ID
  const identifier = adminId || details.email || 'unknown';
  
  console.log('[ADMIN ACTION]', {
    adminId: identifier,
    action,
    details,
    timestamp: new Date().toISOString()
  });
  
  // TODO: Сохранить в таблицу admin_activity_log
  // await db.adminActivityLog.create({
  //   admin_id: identifier,
  //   action,
  //   details: JSON.stringify(details),
  //   created_at: new Date()
  // });
}
