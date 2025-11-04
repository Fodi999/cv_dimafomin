import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, completedCourses, userProfile } = body;

    // Валидация
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    // Если нет API ключа - возвращаем моковые данные
    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      console.warn('⚠️ OpenAI API key not configured, returning mock recommendations');
      
      return NextResponse.json({
        success: true,
        recommendations: [
          {
            id: 'advanced-sushi-2024',
            title: 'Zaawansowane techniki Sushi - Level Professional',
            description: 'Opanuj zaawansowane techniki krojenia, prezentacji i fusion sushi według japońskich standardów.',
            level: 'Zaawansowany',
            rating: 5,
            reason: 'Na podstawie twojego ukończonego kursu "Podstawy Sushi", polecamy przejście na poziom professional.',
            estimatedDuration: '8 tygodni',
            difficulty: 'advanced' as const,
          },
          {
            id: 'nigiri-mastery-2024',
            title: 'Nigiri Mastery: Sztuka idealnego balansu',
            description: 'Naucz się tworzyć perfekcyjne nigiri z zachowaniem proporcji ryżu i ryby.',
            level: 'Średnio-zaawansowany',
            rating: 5,
            reason: 'Rozwiń swoje umiejętności w specjalistycznej technice nigiri.',
            estimatedDuration: '4 tygodnie',
            difficulty: 'intermediate' as const,
          },
        ],
      });
    }

    // Przygotuj prompt dla OpenAI
    const completedCoursesText = completedCourses?.length > 0
      ? completedCourses.join(', ')
      : 'brak ukończonych kursów';

    const userInfo = userProfile 
      ? `\nInformacje o użytkowniku:\n- Imię: ${userProfile.name}\n- Bio: ${userProfile.bio || 'brak'}\n- Poziom: ${userProfile.level || 'początkujący'}`
      : '';

    const prompt = `Jesteś AI Culinary Mentor specjalizującym się w kuchni japońskiej, szczególnie w sztuce sushi.

Użytkownik ukończył następujące kursy: ${completedCoursesText}
${userInfo}

Zaproponuj 2-3 następne kursy kulinarne, które będą idealnym krokiem w rozwoju użytkownika. 
Skup się na:
- Logicznej progresji umiejętności
- Różnorodności technik (sushi, sashimi, fusion, prezentacja)
- Motywowaniu do dalszego rozwoju

Odpowiedz w formacie JSON:
{
  "recommendations": [
    {
      "title": "Nazwa kursu",
      "description": "Krótki opis (1-2 zdania)",
      "level": "Początkujący/Średnio-zaawansowany/Zaawansowany",
      "reason": "Dlaczego ten kurs jest polecany dla użytkownika",
      "estimatedDuration": "np. 4 tygodnie",
      "difficulty": "beginner/intermediate/advanced"
    }
  ]
}`;

    // Wywołanie OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Jesteś ekspertem kulinarnym specjalizującym się w kuchni japońskiej i sushi. Pomagasz użytkownikom wybierać odpowiednie kursy kulinarne.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', errorData);
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from OpenAI');
    }

    // Parse JSON response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from AI');
    }

    const recommendations = JSON.parse(jsonMatch[0]);

    // Dodaj ID do każdej rekomendacji
    const recommendationsWithIds = recommendations.recommendations.map((rec: any, index: number) => ({
      id: `ai-rec-${Date.now()}-${index}`,
      rating: 5,
      ...rec,
    }));

    console.log('✅ AI recommendations generated:', recommendationsWithIds.length);

    return NextResponse.json({
      success: true,
      recommendations: recommendationsWithIds,
    });

  } catch (error) {
    console.error('❌ Error generating AI recommendations:', error);

    // Fallback to mock data on error
    return NextResponse.json({
      success: true,
      recommendations: [
        {
          id: 'fusion-sushi-basics',
          title: 'Fusion Sushi: Nowoczesne podejście do tradycji',
          description: 'Połącz klasyczne techniki z nowoczesnymi smakami i składnikami.',
          level: 'Średnio-zaawansowany',
          rating: 4.8,
          reason: 'Rozszerz swoją wiedzę o nowoczesne trendy w sushi.',
          estimatedDuration: '6 tygodni',
          difficulty: 'intermediate' as const,
        },
      ],
      note: 'Używamy domyślnych rekomendacji ze względu na błąd API',
    });
  }
}
