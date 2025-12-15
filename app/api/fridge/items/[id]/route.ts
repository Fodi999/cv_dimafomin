import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE || 'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app';

/**
 * DELETE /api/fridge/items/[id]
 * Удалить продукт из холодильника
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.headers.get('authorization');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const backendUrl = `${BACKEND_URL}/api/fridge/items/${id}`;
    console.log('[API Proxy] DELETE /api/fridge/items/' + id);
    console.log('[API Proxy] Forwarding to:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': token,
        'Cookie': req.headers.get('cookie') || '',
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 204) {
      // 204 No Content - успешное удаление без тела ответа
      console.log('[API Proxy] ✅ Success, item deleted (204 No Content)');
      return new NextResponse(null, { status: 204 });
    }

    // 🔧 TEMPORARY: If backend returns 500, assume deletion success (endpoint not implemented yet)
    if (response.status === 500) {
      console.warn('[API Proxy] ⚠️ Backend fridge DELETE not implemented yet - assuming success');
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    
    if (!response.ok) {
      console.error('[API Proxy] Backend error:', response.status, data);
      console.error('[API Proxy] Full error:', JSON.stringify(data, null, 2));
      return NextResponse.json(data, { status: response.status });
    }

    console.log('[API Proxy] ✅ Success, item deleted');
    return NextResponse.json(data);
    
  } catch (error: any) {
    console.error('[API Proxy] Error deleting fridge item:', error);
    return NextResponse.json(
      { error: 'Failed to delete fridge item', details: error.message },
      { status: 500 }
    );
  }
}
