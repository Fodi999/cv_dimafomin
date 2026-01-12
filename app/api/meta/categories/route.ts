/**
 * GET /api/meta/categories
 * Production-ready categories metadata endpoint
 * Sorted by order field
 */

import { NextResponse } from 'next/server';
import type { MetaCategory } from '@/lib/meta/types';
import { getBackendUrl } from "@/lib/api/backend-url";
// Mock data - замінити на реальну БД
const CATEGORIES: MetaCategory[] = [
  {
    id: 'main',
    code: 'main-course',
    name: 'Main Course',
    namePL: 'Danie główne',
    nameRU: 'Основное блюдо',
    icon: '🍽️',
    order: 1,
    recipeCount: 8,
  },
  {
    id: 'soup',
    code: 'soup',
    name: 'Soup',
    namePL: 'Zupa',
    nameRU: 'Суп',
    icon: '🍲',
    order: 2,
    recipeCount: 2,
  },
  {
    id: 'salad',
    code: 'salad',
    name: 'Salad',
    namePL: 'Sałatka',
    nameRU: 'Салат',
    icon: '🥗',
    order: 3,
    recipeCount: 1,
  },
  {
    id: 'appetizer',
    code: 'appetizer',
    name: 'Appetizer',
    namePL: 'Przystawka',
    nameRU: 'Закуска',
    icon: '🧆',
    order: 4,
    recipeCount: 3,
  },
  {
    id: 'dessert',
    code: 'dessert',
    name: 'Dessert',
    namePL: 'Deser',
    nameRU: 'Десерт',
    icon: '🍰',
    order: 5,
    recipeCount: 2,
  },
  {
    id: 'breakfast',
    code: 'breakfast',
    name: 'Breakfast',
    namePL: 'Śniadanie',
    nameRU: 'Завтрак',
    icon: '🍳',
    order: 6,
    recipeCount: 1,
  },
];

export async function GET(request: Request) {
  try {
    // Sort by order
    const sorted = [...CATEGORIES].sort((a, b) => a.order - b.order);

    return NextResponse.json({
      categories: sorted,
      total: sorted.length,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
