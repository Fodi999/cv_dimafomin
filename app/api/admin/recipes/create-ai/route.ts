/**
 * Create recipe with AI generation
 * POST /api/admin/recipes/create-ai
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

    // Get body
    const body = await req.json();
    
    if (!body.title || !body.ingredients || !body.instructions) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, ingredients, instructions' 
      }, { status: 400 });
    }

    // Forward to backend
    const response = await fetch(`${BACKEND_URL}/admin/recipes/create-ai`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Create AI] Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}
