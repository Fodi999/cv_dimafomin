/**
 * GET /api/meta/cuisines
 * Production-ready cuisines metadata endpoint
 * Supports filtering by countryCode
 */

import { NextResponse } from 'next/server';
import type { MetaCuisine } from '@/lib/meta/types';
import { getBackendUrl } from "@/lib/api/backend-url";
// Mock data - замінити на реальну БД
const CUISINES: MetaCuisine[] = [
  {
    id: 'poland',
    name: 'Polish Cuisine',
    namePL: 'Kuchnia Polska',
    nameRU: 'Польская кухня',
    countryCode: 'PL',
    icon: '🥟',
    recipeCount: 8,
  },
  {
    id: 'ukraine',
    name: 'Ukrainian Cuisine',
    namePL: 'Kuchnia Ukraińska',
    nameRU: 'Украинская кухня',
    countryCode: 'UA',
    icon: '🥔',
    recipeCount: 3,
  },
  {
    id: 'italian',
    name: 'Italian Cuisine',
    namePL: 'Kuchnia Włoska',
    nameRU: 'Итальянская кухня',
    countryCode: 'IT',
    icon: '🍝',
    recipeCount: 5,
  },
  {
    id: 'japanese',
    name: 'Japanese Cuisine',
    namePL: 'Kuchnia Japońska',
    nameRU: 'Японская кухня',
    countryCode: 'JP',
    icon: '🍣',
    recipeCount: 2,
  },
  {
    id: 'american',
    name: 'American Cuisine',
    namePL: 'Kuchnia Amerykańska',
    nameRU: 'Американская кухня',
    countryCode: 'US',
    icon: '🍔',
    recipeCount: 1,
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const countryCode = searchParams.get('countryCode');
    const search = searchParams.get('search')?.toLowerCase();

    let filtered = CUISINES;

    // Filter by country code
    if (countryCode) {
      filtered = filtered.filter((cuisine) => cuisine.countryCode === countryCode);
    }

    // Filter by search query
    if (search) {
      filtered = filtered.filter(
        (cuisine) =>
          cuisine.name.toLowerCase().includes(search) ||
          cuisine.namePL.toLowerCase().includes(search) ||
          cuisine.id.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      cuisines: filtered,
      total: filtered.length,
    });
  } catch (error) {
    console.error('Error fetching cuisines:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
