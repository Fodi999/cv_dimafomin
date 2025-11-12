import { NextRequest, NextResponse } from 'next/server';

// ====== Helper: Add tokens to user balance ======
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
    
    // Note: This assumes backend has an /wallet/earn or /wallet/add endpoint
    // If not, we need to create one on the backend
    const response = await fetch(`${apiUrl}/wallet/earn`, {
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

    // Fallback: if /wallet/earn doesn't exist, try different endpoint
    if (!response.ok && response.status === 404) {
      console.warn('[Add Tokens] /wallet/earn not found, trying alternative endpoint');
      // You may need to update this based on your backend API
      const altResponse = await fetch(`${apiUrl}/user/tokens/add`, {
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

      if (!altResponse.ok) {
        const error = await altResponse.json();
        return NextResponse.json(
          { error: error.message || error.error || 'Failed to add tokens' },
          { status: altResponse.status }
        );
      }

      const data = await altResponse.json();
      return NextResponse.json({
        success: true,
        data: {
          newBalance: data.data?.balance || data.balance || 0,
          transactionId: data.data?.transactionId || data.transactionId,
        },
      });
    }

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || error.error || 'Failed to add tokens' },
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
    console.error('[Add Tokens] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
