/**
 * GET /api/meta/countries
 * Production-ready countries metadata endpoint
 */

import { NextResponse } from 'next/server';
import type { MetaCountry } from '@/lib/meta/types';
import { getBackendUrl } from "@/lib/api/backend-url";
// Mock data - замінити на реальну БД
const COUNTRIES: MetaCountry[] = [
  {
    id: '1',
    code: 'PL',
    name: 'Poland',
    namePL: 'Polska',
    nameRU: 'Польша',
    flag: '🇵🇱',
    recipeCount: 8,
  },
  {
    id: '2',
    code: 'UA',
    name: 'Ukraine',
    namePL: 'Ukraina',
    nameRU: 'Украина',
    flag: '🇺🇦',
    recipeCount: 3,
  },
  {
    id: '3',
    code: 'IT',
    name: 'Italy',
    namePL: 'Włochy',
    nameRU: 'Италия',
    flag: '🇮🇹',
    recipeCount: 5,
  },
  {
    id: '4',
    code: 'JP',
    name: 'Japan',
    namePL: 'Japonia',
    nameRU: 'Япония',
    flag: '🇯🇵',
    recipeCount: 2,
  },
  {
    id: '5',
    code: 'US',
    name: 'United States',
    namePL: 'Stany Zjednoczone',
    nameRU: 'США',
    flag: '🇺🇸',
    recipeCount: 1,
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase();

    let filtered = COUNTRIES;

    // Filter by search query
    if (search) {
      filtered = COUNTRIES.filter(
        (country) =>
          country.name.toLowerCase().includes(search) ||
          country.namePL.toLowerCase().includes(search) ||
          country.code.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({
      countries: filtered,
      total: filtered.length,
    });
  } catch (error) {
    console.error('Error fetching countries:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
