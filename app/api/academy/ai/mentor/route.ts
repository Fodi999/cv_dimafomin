import { NextRequest, NextResponse } from "next/server";

/**
 * AI MENTOR ENDPOINT
 * 
 * Socratic Method Logic:
 * 1. Ask questions, don't give answers
 * 2. Analyze user's reasoning
 * 3. Lead to conclusions through exploration
 * 4. Encourage critical thinking
 */

interface MentorRequest {
  pathId: string;
  moduleId: string;
  taskId: string;
  taskType: "ai-question" | "decision" | "analysis" | "practice" | "reflection";
  userAnswer: string;
  conversationHistory: Array<{ role: "user" | "ai"; message: string }>;
  aiPrompt: string; // Context from task
  aiQuestions?: string[]; // Predefined questions from task data
}

interface MentorResponse {
  aiMessage: string;
  shouldCompleteTask: boolean;
  conversationTurn: number;
  feedbackCode?: "excellent" | "good" | "needs-reflection";
  progressUpdate?: {
    earnedTokens: number;
    nextAction: "next-task" | "complete-module";
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: MentorRequest = await request.json();

    const {
      pathId,
      moduleId,
      taskId,
      taskType,
      userAnswer,
      conversationHistory,
      aiPrompt,
      aiQuestions = [],
    } = body;

    // Validate input
    if (!userAnswer || userAnswer.trim().length < 3) {
      return NextResponse.json(
        { error: "Odpowiedź musi mieć przynajmniej 3 znaki" },
        { status: 400 }
      );
    }

    const conversationTurn = conversationHistory.length / 2 + 1;

    // SOCRATIC METHOD LOGIC
    const response = await generateSocraticResponse(
      taskType,
      userAnswer,
      conversationTurn,
      aiPrompt,
      aiQuestions,
      conversationHistory
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("AI Mentor error:", error);
    return NextResponse.json(
      { error: "Błąd AI Mentora" },
      { status: 500 }
    );
  }
}

/**
 * CORE AI LOGIC: Socratic Method
 * 
 * Turn 1: Ask first question (explore intention)
 * Turn 2: Dig deeper (ask "why?", "what if?")
 * Turn 3: Challenge assumptions, lead to conclusions
 * Turn 4+: Complete task if reasoning is clear
 */
async function generateSocraticResponse(
  taskType: MentorRequest["taskType"],
  userAnswer: string,
  turn: number,
  aiPrompt: string,
  aiQuestions: string[],
  history: MentorRequest["conversationHistory"]
): Promise<MentorResponse> {
  const answerLength = userAnswer.trim().split(" ").length;
  const isThoughtful = answerLength >= 10; // At least 10 words = thoughtful answer

  // TURN 1: First question - explore intention
  if (turn === 1) {
    return {
      aiMessage: getFirstQuestion(taskType, aiQuestions),
      shouldCompleteTask: false,
      conversationTurn: 1,
    };
  }

  // TURN 2: Dig deeper - why? what if?
  if (turn === 2) {
    return {
      aiMessage: getDeeperQuestion(taskType, userAnswer, aiQuestions),
      shouldCompleteTask: false,
      conversationTurn: 2,
    };
  }

  // TURN 3+: Challenge assumptions or complete
  if (turn >= 3) {
    if (isThoughtful) {
      // User demonstrated clear thinking - complete task
      return {
        aiMessage: getFinalFeedback(taskType, userAnswer),
        shouldCompleteTask: true,
        conversationTurn: turn,
        feedbackCode: "excellent",
        progressUpdate: {
          earnedTokens: taskType === "reflection" ? 10 : 5,
          nextAction: "next-task",
        },
      };
    } else {
      // Encourage more depth
      return {
        aiMessage: encourageDepth(taskType),
        shouldCompleteTask: false,
        conversationTurn: turn,
      };
    }
  }

  // Fallback
  return {
    aiMessage: "Interesujące! Rozwiń swoją myśl dalej.",
    shouldCompleteTask: false,
    conversationTurn: turn,
  };
}

/**
 * TURN 1: Ask first exploratory question
 */
function getFirstQuestion(
  taskType: MentorRequest["taskType"],
  predefinedQuestions: string[]
): string {
  // Use predefined question if available
  if (predefinedQuestions.length > 0) {
    return predefinedQuestions[0];
  }

  // Fallback by task type
  const questions: Record<string, string> = {
    "ai-question": "Co Cię skłoniło do tej odpowiedzi?",
    decision: "Dlaczego ta decyzja jest lepsza od innych opcji?",
    analysis: "Co zauważyłeś jako najważniejsze?",
    practice: "Co było kluczowe w Twoim wyborze?",
    reflection: "Co było najważniejszym doświadczeniem?",
  };

  return questions[taskType] || "Opowiedz więcej o swoim myśleniu.";
}

/**
 * TURN 2: Dig deeper with "why?" and "what if?"
 */
function getDeeperQuestion(
  taskType: MentorRequest["taskType"],
  userAnswer: string,
  predefinedQuestions: string[]
): string {
  // Use second predefined question if available
  if (predefinedQuestions.length > 1) {
    return predefinedQuestions[1];
  }

  const deepQuestions: Record<string, string[]> = {
    "ai-question": [
      "A co by się stało, gdybyś podszedł do tego inaczej?",
      "Dlaczego to ma znaczenie w kontekście całego dania?",
      "Co jeszcze wziąłeś pod uwagę?",
    ],
    decision: [
      "Co by się zmieniło, gdybyś wybrał inaczej?",
      "Jakie były twoje priorytety przy tej decyzji?",
      "Co było kluczowe: czas, koszt czy jakość?",
    ],
    analysis: [
      "Co z tego wynika praktycznego?",
      "Jak wykorzystasz tę wiedzę następnym razem?",
      "Co było zaskakujące w tym procesie?",
    ],
    practice: [
      "Dlaczego akurat taka kolejność działań?",
      "Co mogłoby pójść nie tak?",
      "Jak upewnisz się, że wynik będzie dobry?",
    ],
    reflection: [
      "Co następnym razem zrobisz inaczej?",
      "Czego się nauczyłeś z tego doświadczenia?",
      "Co Cię zaskoczyło?",
    ],
  };

  const options = deepQuestions[taskType] || deepQuestions["ai-question"];
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * FINAL: Affirm clear thinking and complete task
 */
function getFinalFeedback(
  taskType: MentorRequest["taskType"],
  userAnswer: string
): string {
  const feedback: Record<string, string[]> = {
    "ai-question": [
      "Doskonale! Widzę, że myślisz jak szef kuchni — nie tylko wykonujesz, ale rozumiesz 'dlaczego'.",
      "Świetna analiza! To właśnie podejście, które różni dobrego kucharza od świetnego.",
      "Excellent! Twoje rozumowanie pokazuje głębokie zrozumienie tematu.",
    ],
    decision: [
      "Bardzo dobra decyzja! Widzę, że rozważyłeś wszystkie aspekty.",
      "To przemyślany wybór. Twoja argumentacja jest logiczna i praktyczna.",
      "Świetnie! To pokazuje, że myślisz strategicznie, nie impulsywnie.",
    ],
    analysis: [
      "Doskonała analiza! Zauważyłeś kluczowe elementy.",
      "To bardzo dobre spostrzeżenie. Widzę, że analizujesz głęboko.",
      "Excellent! Twoja obserwacja jest trafna i praktyczna.",
    ],
    practice: [
      "Świetne podejście praktyczne! Teraz zastosuj to w działaniu.",
      "Doskonale! Widzę, że planujesz świadomie, nie działasz na oślep.",
      "To pokazuje dojrzałe myślenie kucharza. Brawo!",
    ],
    reflection: [
      "Cenna refleksja! To właśnie przez analizę doświadczeń się rozwijasz.",
      "Doskonale! Uczysz się z własnych decyzji — to klucz do mistrzostwa.",
      "Świetna samoświadomość. To najbardziej wartościowa umiejętność kucharza.",
    ],
  };

  const options = feedback[taskType] || feedback["ai-question"];
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Encourage more depth if answer is too short
 */
function encourageDepth(taskType: MentorRequest["taskType"]): string {
  const prompts = [
    "Rozumiem, ale powiedz więcej — co dokładnie o tym myślisz?",
    "To dobry początek. Teraz rozwiń swoją myśl — dlaczego tak uważasz?",
    "Interesujące! Ale wejdź głębiej — co za tym stoi?",
    "OK, ale co konkretnie Cię do tego skłoniło? Opowiedz więcej.",
  ];

  return prompts[Math.floor(Math.random() * prompts.length)];
}
