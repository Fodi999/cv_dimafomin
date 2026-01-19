import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/recipes/filters/meta
 * Returns available filter options for recipes catalog
 */
export async function GET(req: NextRequest) {
  try {
    // Return static filter options
    // In production, these could be fetched from database or backend
    const filterMeta = {
      cuisines: [
        { value: 'italian', label: 'Італійська', icon: 'pizza' },
        { value: 'japanese', label: 'Японська', icon: 'soup' },
        { value: 'ukrainian', label: 'Українська', icon: 'wheat' },
        { value: 'chinese', label: 'Китайська', icon: 'soup' },
        { value: 'french', label: 'Французька', icon: 'croissant' },
        { value: 'american', label: 'Американська', icon: 'pizza' },
        { value: 'mexican', label: 'Мексиканська', icon: 'pepper' },
        { value: 'indian', label: 'Індійська', icon: 'soup' },
        { value: 'thai', label: 'Тайська', icon: 'soup' },
        { value: 'mediterranean', label: 'Середземноморська', icon: 'fish' },
        { value: 'asian', label: 'Азійська', icon: 'soup' },
        { value: 'european', label: 'Європейська', icon: 'wheat' }
      ],
      difficulties: [
        { value: 'easy', label: 'Легкий', icon: 'circle-green' },
        { value: 'medium', label: 'Середній', icon: 'circle-yellow' },
        { value: 'hard', label: 'Складний', icon: 'circle-red' }
      ],
      statuses: [
        { value: 'draft', label: 'Чернетка', icon: 'file-edit' },
        { value: 'published', label: 'Опубліковано', icon: 'check-circle' },
        { value: 'archived', label: 'Архів', icon: 'archive' }
      ],
      sortOptions: [
        { value: 'created_at', label: 'За датою створення', icon: 'calendar' },
        { value: 'title', label: 'За назвою', icon: 'text' },
        { value: 'cooking_time', label: 'За часом приготування', icon: 'clock' },
        { value: 'views', label: 'За переглядами', icon: 'eye' }
      ],
      sortOrders: [
        { value: 'desc', label: 'За спаданням', icon: 'arrow-down' },
        { value: 'asc', label: 'За зростанням', icon: 'arrow-up' }
      ],
      timeRanges: [
        { value: '15', label: '≤ 15 хв', icon: '⚡' },
        { value: '30', label: '≤ 30 хв', icon: '⏱️' },
        { value: '60', label: '≤ 1 год', icon: '⏰' },
        { value: '90', label: '≤ 1.5 год', icon: '🕐' },
        { value: '120', label: '≤ 2 год', icon: '🕑' }
      ],
      caloriesRanges: [
        { value: '300', label: '≤ 300 ккал', icon: '🥗' },
        { value: '500', label: '≤ 500 ккал', icon: '🍽️' },
        { value: '800', label: '≤ 800 ккал', icon: '🍕' },
        { value: '1000', label: '≤ 1000 ккал', icon: '🍔' }
      ],
      sourceTypes: [
        { value: 'ai', label: 'AI-генерований', icon: '🤖' },
        { value: 'manual', label: 'Ручний ввід', icon: '✍️' },
        { value: 'traditional', label: 'Традиційний', icon: '📖' }
      ]
    };

    return NextResponse.json({
      success: true,
      data: filterMeta
    });
  } catch (error: any) {
    console.error('[GET /api/admin/recipes/filters/meta] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch filter options' 
      },
      { status: 500 }
    );
  }
}
