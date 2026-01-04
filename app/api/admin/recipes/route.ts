import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api/middleware";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app";

/**
 * GET /api/admin/recipes
 * Получить список всех рецептов (админ)
 * 
 * Query params:
 * - search: string (поиск по названию/описанию)
 * - cuisine: string (фильтр по кухне: italian, japanese, ukrainian, etc.)
 * - difficulty: string (easy, medium, hard)
 * - status: string (draft, published, archived)
 * - page: number (default: 1)
 * - limit: number (default: 50)
 */
export async function GET(request: NextRequest) {
  try {
    // Check admin access
    const { user, error } = await requireAdmin(request);
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const cuisine = searchParams.get('cuisine') || '';
    const difficulty = searchParams.get('difficulty') || '';
    const status = searchParams.get('status') || '';
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '50';

    // Build query string for backend
    const queryParams = new URLSearchParams();
    if (search) queryParams.append('search', search);
    if (cuisine) queryParams.append('cuisine', cuisine);
    if (difficulty) queryParams.append('difficulty', difficulty);
    if (status) queryParams.append('status', status);
    queryParams.append('page', page);
    queryParams.append('limit', limit);

    // Use ADMIN endpoint (GET /api/admin/recipes) for full catalog access
    const url = `${BACKEND_URL}/api/admin/recipes?${queryParams.toString()}`;

    const token = request.headers.get('Authorization')?.replace('Bearer ', '') || '';
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Admin Recipes API] Backend error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to fetch recipes' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Transform response to match expected format
    // Backend structure (from PostgreSQL):
    // {
    //   id, canonicalName, localName, namePl, nameEn, nameRu,
    //   descriptionPl, descriptionEn, descriptionRu,
    //   country, region, category, difficulty,
    //   timeMinutes, servings, steps, stepsPl,
    //   nutritionProfile, source, createdAt, updatedAt
    // }
    // Frontend expects: title, description, cooking_time, ingredients, steps (array of objects)
    
    const backendItems = data.data || data.recipes || [];
    
    // Transform backend fields to frontend format
    const transformedItems = backendItems.map((item: any) => ({
      id: item.id,
      // Title - use localName or canonicalName
      title: item.localName || item.canonicalName || item.namePl || item.nameEn || 'Без назви',
      // Description - use Polish description as default
      description: item.descriptionPl || item.descriptionEn || item.descriptionRu || '',
      // Category/Cuisine
      cuisine: item.category || 'main',
      difficulty: item.difficulty || 'medium',
      status: item.status || 'published',
      // Time - timeMinutes from backend
      cooking_time: item.timeMinutes || 30,
      servings: item.servings || 1,
      portionWeightGrams: item.portionWeightGrams, // вес одной порции
      // Ingredients - transform nested structure
      ingredients: (item.ingredients || []).map((ing: any) => ({
        id: ing.id,
        ingredientId: ing.ingredientId,
        name: ing.ingredient?.name || ing.ingredient?.namePl || ing.ingredientName || 'Unknown',
        namePl: ing.ingredient?.namePl,
        nameEn: ing.ingredient?.nameEn,
        nameRu: ing.ingredient?.nameRu,
        quantity: ing.quantity,
        amount: ing.quantity, // alias
        unit: ing.unit,
        optional: ing.optional || false,
        sortOrder: ing.sortOrder,
        inFridge: ing.inFridge || false,
        fridgeQuantity: ing.fridgeQuantity
      })),
      // Steps - convert string array to object array
      steps: (item.steps || item.stepsPl || []).map((stepText: string, index: number) => ({
        stepNumber: index + 1,
        description: stepText,
        text: stepText
      })),
      views: item.viewsCount || item.views || 0,
      created_at: item.createdAt,
      updated_at: item.updatedAt,
      // Keep ALL original backend fields for viewing/editing
      canonicalName: item.canonicalName,
      localName: item.localName,
      namePl: item.namePl,
      nameEn: item.nameEn,
      nameUk: item.nameUk,
      nameRu: item.nameRu,
      descriptionPl: item.descriptionPl,
      descriptionEn: item.descriptionEn,
      descriptionRu: item.descriptionRu,
      country: item.country,
      region: item.region,
      category: item.category,
      timeMinutes: item.timeMinutes,
      stepsPl: item.stepsPl,
      nutritionProfile: item.nutritionProfile,
      source: item.source,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    }));
    
    const totalCount = data.meta?.total || data.total || data.count || transformedItems.length;
    const currentPage = parseInt(page);
    const pageLimit = parseInt(limit);
    
    return NextResponse.json({
      data: transformedItems,
      meta: {
        total: totalCount,
        page: currentPage,
        limit: pageLimit,
        totalPages: Math.ceil(totalCount / pageLimit),
      },
    });
  } catch (error) {
    console.error('[Admin Recipes API] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch recipes',
        details: (error as Error)?.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/recipes
 * Создать новый рецепт (админ)
 */
export async function POST(request: NextRequest) {
  try {
    // Check admin access
    const { user, error } = await requireAdmin(request);
    if (error) return error;

    const body = await request.json();
    console.log('[Admin Recipes API] Creating recipe:', body);

    // Validate required fields
    if (!body.title || !body.cuisine || !body.difficulty) {
      return NextResponse.json(
        { error: 'Title, cuisine, and difficulty are required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/recipes`, {
      method: 'POST',
      headers: {
        'Authorization': request.headers.get('Authorization') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Admin Recipes API] Backend error:', errorText);
      return NextResponse.json(
        { error: 'Failed to create recipe' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('[Admin Recipes API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
