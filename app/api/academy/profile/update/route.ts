import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, bio, location, phone, instagram, telegram, whatsapp, avatar } = body;

    // Здесь должна быть реальная логика сохранения в базу данных
    // Пока возвращаем моковый ответ
    
    // Пример валидации
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Имитация сохранения в БД
    const updatedProfile = {
      id: '1',
      name,
      email,
      bio: bio || '',
      location: location || '',
      phone: phone || '',
      instagram: instagram || '',
      telegram: telegram || '',
      whatsapp: whatsapp || '',
      avatar: avatar || '',
      role: 'student',
      updatedAt: new Date().toISOString(),
    };

    console.log('✅ Profile update request:', updatedProfile);

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
