import { NextRequest, NextResponse } from 'next/server';

// ====== Helper: Deduct tokens from user balance ======
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, amount, reason } = body;

    if (!userId || !amount || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api';
    
    const response = await fetch(`${apiUrl}/wallet/spend`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        amount,
        reason,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || error.error || 'Failed to deduct tokens' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      data: {
        newBalance: data.data?.balance || data.balance || 0,
        transactionId: data.data?.transactionId || data.transactionId,
      },
    });
  } catch (error: any) {
    console.error('[Deduct Tokens] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
