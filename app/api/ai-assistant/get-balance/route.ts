import { NextRequest, NextResponse } from 'next/server';

// ====== Helper: Get user balance ======
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api';
    
    const response = await fetch(`${apiUrl}/user/tokens`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || error.error || 'Failed to fetch balance' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const balance = data.data?.balance || data.balance || 0;

    return NextResponse.json({
      success: true,
      data: {
        balance,
        earned: data.data?.earned || data.earned || 0,
        spent: data.data?.spent || data.spent || 0,
        available: data.data?.available || data.available || balance,
      },
    });
  } catch (error: any) {
    console.error('[Get Balance] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
