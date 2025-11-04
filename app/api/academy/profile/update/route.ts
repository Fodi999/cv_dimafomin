import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, bio, location, phone, instagram, telegram, whatsapp, avatar, about } = body;

    // Валидация обязательных полей
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required and cannot be empty' },
        { status: 400 }
      );
    }

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Валидация длины полей
    if (name.length > 100) {
      return NextResponse.json(
        { error: 'Name is too long (max 100 characters)' },
        { status: 400 }
      );
    }

    if (bio && bio.length > 500) {
      return NextResponse.json(
        { error: 'Bio is too long (max 500 characters)' },
        { status: 400 }
      );
    }

    if (about && about.length > 1000) {
      return NextResponse.json(
        { error: 'About section is too long (max 1000 characters)' },
        { status: 400 }
      );
    }

    // Валидация социальных сетей (опционально)
    const validateSocialHandle = (handle: string | undefined, platform: string) => {
      if (!handle) return true;
      const trimmed = handle.trim();
      if (trimmed.length === 0) return true;
      if (trimmed.length > 50) {
        throw new Error(`${platform} handle is too long (max 50 characters)`);
      }
      return true;
    };

    validateSocialHandle(instagram, 'Instagram');
    validateSocialHandle(telegram, 'Telegram');
    validateSocialHandle(whatsapp, 'WhatsApp');

    // Валидация телефона (опционально)
    if (phone && phone.length > 20) {
      return NextResponse.json(
        { error: 'Phone number is too long (max 20 characters)' },
        { status: 400 }
      );
    }

    // Здесь должна быть реальная логика сохранения в базу данных
    // Например, с использованием Prisma, MongoDB, или другой БД
    
    const updatedProfile = {
      id: '1', // В реальности - ID из токена или сессии
      name: name.trim(),
      email: email.trim().toLowerCase(),
      bio: bio?.trim() || '',
      about: about?.trim() || '',
      location: location?.trim() || '',
      phone: phone?.trim() || '',
      instagram: instagram?.trim() || '',
      telegram: telegram?.trim() || '',
      whatsapp: whatsapp?.trim() || '',
      avatar: avatar || '',
      role: 'student',
      updatedAt: new Date().toISOString(),
    };

    console.log('✅ Profile update successful:', {
      id: updatedProfile.id,
      name: updatedProfile.name,
      email: updatedProfile.email,
      hasBio: !!updatedProfile.bio,
      hasAvatar: !!updatedProfile.avatar,
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedProfile,
    });
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
