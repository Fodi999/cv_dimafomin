import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, courseId } = body;

    // Валидация
    if (!userId || !courseId) {
      return NextResponse.json(
        { error: 'User ID and Course ID are required' },
        { status: 400 }
      );
    }

    // Здесь должна быть логика:
    // 1. Проверка существования пользователя
    // 2. Проверка существования курса
    // 3. Проверка, не записан ли уже пользователь на этот курс
    // 4. Создание записи enrollment в БД
    // 5. Возможно, списание ChefTokens если курс платный

    // Имитация успешной записи
    const enrollment = {
      id: `enroll-${Date.now()}`,
      userId,
      courseId,
      enrolledAt: new Date().toISOString(),
      progress: 0,
      status: 'active',
    };

    console.log('✅ Course enrollment:', enrollment);

    return NextResponse.json({
      success: true,
      message: 'Successfully enrolled in course',
      data: enrollment,
    });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return NextResponse.json(
      { error: 'Failed to enroll in course' },
      { status: 500 }
    );
  }
}
