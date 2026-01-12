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
        { value: 'italian', label: 'Італійська', icon: '🇮🇹' },
        { value: 'japanese', label: 'Японська', icon: '🇯🇵' },
        { value: 'ukrainian', label: 'Українська', icon: '🇺🇦' },
        { value: 'chinese', label: 'Китайська', icon: '🇨🇳' },
        { value: 'french', label: 'Французька', icon: '🇫🇷' },
        { value: 'american', label: 'Американська', icon: '🇺🇸' },
        { value: 'mexican', label: 'Мексиканська', icon: '🇲🇽' },
        { value: 'indian', label: 'Індійська', icon: '🇮🇳' },
        { value: 'thai', label: 'Тайська', icon: '🇹🇭' },
        { value: 'mediterranean', label: 'Середземноморська', icon: '🌊' },
        { value: 'asian', label: 'Азійська', icon: '🥢' },
        { value: 'european', label: 'Європейська', icon: '🌍' }
      ],
      difficulties: [
        { value: 'easy', label: 'Легкий', icon: '🟢' },
        { value: 'medium', label: 'Середній', icon: '🟡' },
        { value: 'hard', label: 'Складний', icon: '🔴' }
      ],
      statuses: [
        { value: 'draft', label: 'Чернетка', icon: '📝' },
        { value: 'published', label: 'Опубліковано', icon: '✅' },
        { value: 'archived', label: 'Архів', icon: '📦' }
      ],
      sortOptions: [
        { value: 'created_at', label: 'За датою створення', icon: '📅' },
        { value: 'title', label: 'За назвою', icon: '🔤' },
        { value: 'cooking_time', label: 'За часом приготування', icon: '⏱️' },
        { value: 'views', label: 'За переглядами', icon: '👁️' }
      ],
      sortOrders: [
        { value: 'desc', label: 'За спаданням', icon: '⬇️' },
        { value: 'asc', label: 'За зростанням', icon: '⬆️' }
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
