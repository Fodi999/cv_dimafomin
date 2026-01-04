import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/middleware";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app";

/**
 * GET /api/admin/ingredients
 * Получить список всех ингредиентов с фильтрацией
 */
export async function GET(request: NextRequest) {
  try {
    // Check admin access
    const { user, error } = await requireAdmin(request);
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '50';

    // Build query string
    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    if (category && category !== 'all') queryParams.append('category', category);
    queryParams.append('page', page);
    queryParams.append('limit', limit);

    const url = `${BACKEND_URL}/api/admin/ingredients?${queryParams.toString()}`;
    console.log('[Admin Ingredients API] Fetching:', url);

    const response = await fetch(url, {
      headers: {
        'Authorization': request.headers.get('Authorization') || '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Admin Ingredients API] Backend error:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch ingredients' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Admin Ingredients API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/ingredients
 * Создать новый ингредиент
 */
export async function POST(request: NextRequest) {
  try {
    // Check admin access
    const { user, error } = await requireAdmin(request);
    if (error) return error;

    const body = await request.json();
    console.log('[Admin Ingredients API] Creating ingredient:', body);

    // Validate required fields
    if (!body.name || !body.category || !body.unit) {
      return NextResponse.json(
        { error: 'Name, category, and unit are required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/admin/ingredients`, {
      method: 'POST',
      headers: {
        'Authorization': request.headers.get('Authorization') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Admin Ingredients API] Backend error:', errorText);
      return NextResponse.json(
        { error: 'Failed to create ingredient' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('[Admin Ingredients API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
