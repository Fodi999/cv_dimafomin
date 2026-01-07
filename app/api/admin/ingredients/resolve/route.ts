/**
 * Universal ingredient resolution endpoint
 * Handles both existing and new ingredients with AI classification
 * 
 * POST /api/admin/ingredients/resolve
 * Body: { input: string }
 * Response: { status: "created" | "existing", ingredient: {...} }
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8080/api'
  : 'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get input
    const body = await req.json();
    const { input } = body;

    if (!input || typeof input !== 'string' || input.trim().length === 0) {
      return NextResponse.json({ 
        error: 'Invalid input: must be non-empty string' 
      }, { status: 400 });
    }

    // Forward to backend
    const response = await fetch(`${BACKEND_URL}/admin/ingredients/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ input: input.trim() }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Expected response:
    // {
    //   status: "created" | "existing",
    //   ingredient: {
    //     id, name, nameRu, namePl, nameEn,
    //     category, nutritionGroup, unit
    //   }
    // }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Resolve Ingredient] Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}
