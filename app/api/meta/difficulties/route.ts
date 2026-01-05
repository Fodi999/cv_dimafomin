/**
 * GET /api/meta/difficulties
 * Production-ready difficulties metadata endpoint
 * Sorted by level field
 */

import { NextResponse } from 'next/server';
import type { MetaDifficulty } from '@/lib/meta/types';

// Mock data - замінити на реальну БД
const DIFFICULTIES: MetaDifficulty[] = [
  {
    id: 'easy',
    code: 'easy',
    name: 'Easy',
    namePL: 'Łatwy',
    nameRU: 'Легкий',
    level: 1,
    icon: '😊',
    color: 'green',
    recipeCount: 5,
  },
  {
    id: 'medium',
    code: 'medium',
    name: 'Medium',
    namePL: 'Średni',
    nameRU: 'Средний',
    level: 2,
    icon: '🤔',
    color: 'yellow',
    recipeCount: 8,
  },
  {
    id: 'hard',
    code: 'hard',
    name: 'Hard',
    namePL: 'Trudny',
    nameRU: 'Сложный',
    level: 3,
    icon: '💪',
    color: 'red',
    recipeCount: 2,
  },
];

export async function GET(request: Request) {
  try {
    // Sort by level
    const sorted = [...DIFFICULTIES].sort((a, b) => a.level - b.level);

    return NextResponse.json({
      difficulties: sorted,
      total: sorted.length,
    });
  } catch (error) {
    console.error('Error fetching difficulties:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
