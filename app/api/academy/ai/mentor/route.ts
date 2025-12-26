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
 * CORE AI LOGIC: Socratic Method with Task-Specific Completion Criteria
 * 
 * Turn 1: Ask first question (explore intention)
 * Turn 2: Dig deeper (ask "why?", "what if?")
 * Turn 3: Challenge assumptions, check completion criteria
 * Turn 4+: Complete task if criteria met, otherwise guide further
 */
async function generateSocraticResponse(
  taskType: MentorRequest["taskType"],
  userAnswer: string,
  turn: number,
  aiPrompt: string,
  aiQuestions: string[],
  history: MentorRequest["conversationHistory"]
): Promise<MentorResponse> {
  const answerLower = userAnswer.toLowerCase();
  const answerLength = userAnswer.trim().split(" ").length;
  const isThoughtful = answerLength >= 10; // At least 10 words

  // ✅ TASK-SPECIFIC COMPLETION CRITERIA
  const criteriaCheck = checkTaskCompletionCriteria(taskType, answerLower, history);
  
  // 🐛 DEBUG: Log criteria check results
  console.log(`\n[AI Mentor Turn ${turn}] Task: ${taskType}`);
  console.log(`[AI Mentor] User answer: "${userAnswer.substring(0, 100)}..."`);
  console.log(`[AI Mentor] History length: ${history.length} messages`);
  console.log(`[AI Mentor] Is thoughtful (≥10 words): ${isThoughtful} (${answerLength} words)`);
  console.log(`[AI Mentor] Criteria completed: ${criteriaCheck.completed}`);
  console.log(`[AI Mentor] Feedback: ${criteriaCheck.feedback || 'none'}`);
  console.log(`[AI Mentor] Hint: ${criteriaCheck.hint || 'none'}\n`);

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
    // ✅ Check if criteria already met (smart student!)
    if (criteriaCheck.completed && isThoughtful) {
      return {
        aiMessage: getFinalFeedback(taskType, userAnswer, criteriaCheck.feedback),
        shouldCompleteTask: true,
        conversationTurn: turn,
        feedbackCode: "excellent",
        progressUpdate: {
          earnedTokens: taskType === "reflection" ? 10 : 5,
          nextAction: "next-task",
        },
      };
    }
    
    // ✅ Give hint about what's missing
    return {
      aiMessage: getDeeperQuestion(taskType, userAnswer, aiQuestions, criteriaCheck.hint),
      shouldCompleteTask: false,
      conversationTurn: 2,
    };
  }

  // TURN 3+: Check criteria or guide to completion
  if (turn >= 3) {
    if (criteriaCheck.completed && isThoughtful) {
      // ✅ User demonstrated understanding of key concepts
      return {
        aiMessage: getFinalFeedback(taskType, userAnswer, criteriaCheck.feedback),
        shouldCompleteTask: true,
        conversationTurn: turn,
        feedbackCode: "excellent",
        progressUpdate: {
          earnedTokens: taskType === "reflection" ? 10 : 5,
          nextAction: "next-task",
        },
      };
    } else {
      // ✅ Guide with specific hint about missing criteria
      return {
        aiMessage: encourageDepth(taskType, criteriaCheck.hint),
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
 * ✅ TASK COMPLETION CRITERIA CHECKER
 * Returns whether task goals are achieved + specific feedback
 */
function checkTaskCompletionCriteria(
  taskType: MentorRequest["taskType"],
  answerLower: string,
  history: MentorRequest["conversationHistory"]
): { completed: boolean; feedback: string; hint: string } {
  // Збираємо ВСЮ історію розмови (не тільки останню відповідь)
  const allUserMessages = history
    .filter(msg => msg.role === "user")
    .map(msg => msg.message.toLowerCase())
    .join(" ");
  
  const fullContext = `${allUserMessages} ${answerLower}`;
  
  // 🐛 DEBUG: Log full context for pattern matching
  console.log(`[Criteria Check] Full context length: ${fullContext.length} chars`);
  console.log(`[Criteria Check] Full context preview: "${fullContext.substring(0, 200)}..."`);

  switch (taskType) {
    case "ai-question":
      // Критерії: розуміння різниці між продуктом і інгредієнтом
      // ✅ Більш гнучкі паттерни для польської мови
      const mentionsProduct = /produkt|produktu|produktem|świeży|świeża|jako produkt|potencjałem/.test(fullContext);
      const mentionsIngredient = /składnik|składnika|surowiec|materiał|jako składnik/.test(fullContext);
      const mentionsQuality = /świeżoś|świeży|świeża|jakość|termin|wygląd|zapach|aromat|kolor|jędrny|dojrzałość/.test(fullContext);
      const showsUnderstanding = /nie tylko.*składnik|więcej niż.*składnik|sam w sobie|potencjał|możliwości|teraz.*zanim/.test(fullContext);
      
      // 🐛 DEBUG: Log pattern matches
      console.log(`[Criteria] mentionsProduct: ${mentionsProduct}`);
      console.log(`[Criteria] mentionsIngredient: ${mentionsIngredient}`);
      console.log(`[Criteria] mentionsQuality: ${mentionsQuality}`);
      console.log(`[Criteria] showsUnderstanding: ${showsUnderstanding}`);
      
      // ✅ Дві умови достатньо: (product + quality) АБО (not just ingredient + understanding)
      if ((mentionsProduct && mentionsQuality) || (mentionsIngredient && showsUnderstanding)) {
        return {
          completed: true,
          feedback: "Dokładnie! Widzisz produkt z jego potencjałem, a nie tylko składnik do listy.",
          hint: ""
        };
      }
      return {
        completed: false,
        feedback: "",
        hint: "Pomyśl o różnicy między 'produktem' (świeży ogórek z charakterem) a 'składnikiem' (ogórek w recepturze)."
      };

    case "decision":
      // Критерії: обґрунтування вибору + розуміння наслідків
      const hasReasoning = /dlatego że|ponieważ|bo|gdyż|przez to/.test(fullContext);
      const mentionsConsequences = /będzie|stanie|wpłynie|sprawi/.test(fullContext);
      
      if (hasReasoning && mentionsConsequences) {
        return {
          completed: true,
          feedback: "Świetna decyzja z jasnym uzasadnieniem!",
          hint: ""
        };
      }
      return {
        completed: false,
        feedback: "",
        hint: "Wyjaśnij DLACZEGO tak zdecydowałeś i CO TO ZMIENI."
      };

    case "analysis":
      // Критерії: помічає деталі + робить висновки
      const noticesDetails = /zauważyłem|widzę|spostrzegam/.test(fullContext);
      const makesConclusions = /więc|zatem|dlatego|to znaczy/.test(fullContext);
      
      if (noticesDetails && makesConclusions) {
        return {
          completed: true,
          feedback: "Doskonała analiza z konkretnymi wnioskami!",
          hint: ""
        };
      }
      return {
        completed: false,
        feedback: "",
        hint: "CO zauważyłeś i CO Z TEGO WYNIKA?"
      };

    case "practice":
      // Критерії: конкретна дія + обґрунтування
      const describesAction = /zrobię|będę|zastosuj/.test(fullContext);
      const explainsWhy = /aby|żeby|w celu|dlatego/.test(fullContext);
      
      if (describesAction && explainsWhy) {
        return {
          completed: true,
          feedback: "Świetnie! Widzę konkretny plan działania.",
          hint: ""
        };
      }
      return {
        completed: false,
        feedback: "",
        hint: "CO DOKŁADNIE zrobisz i PO CO?"
      };

    case "reflection":
      // Критерії: самоаналіз + конкретні висновки + план на майбутнє
      const reflectsOnExperience = /nauczyłem|zrozumiałem|teraz wiem/.test(fullContext);
      const plansFuture = /następnym razem|w przyszłości|będę pamiętał/.test(fullContext);
      
      if (reflectsOnExperience && plansFuture) {
        return {
          completed: true,
          feedback: "Doskonała refleksja! Widzę prawdziwe zrozumienie.",
          hint: ""
        };
      }
      return {
        completed: false,
        feedback: "",
        hint: "CZEGO SIĘ NAUCZYŁEŚ i JAK TO WYKORZYSTASZ?"
      };

    default:
      return {
        completed: false,
        feedback: "",
        hint: "Rozwiń swoją myśl."
      };
  }
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
 * TURN 2: Dig deeper with "why?" and "what if?" + hint if criteria not met
 */
function getDeeperQuestion(
  taskType: MentorRequest["taskType"],
  userAnswer: string,
  predefinedQuestions: string[],
  hint?: string
): string {
  // ✅ If hint provided (criteria not met), guide student
  if (hint) {
    return `Interesująca myśl. ${hint}`;
  }

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
  userAnswer: string,
  specificFeedback?: string
): string {
  // ✅ Use specific feedback from criteria check if provided
  if (specificFeedback) {
    return `${specificFeedback}\nZadanie zaliczone (+5 ChefTokens).\nPrzejdźmy do kolejnego zadania.`;
  }

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
 * Encourage more depth if answer is too short or criteria not met
 */
function encourageDepth(taskType: MentorRequest["taskType"], hint?: string): string {
  // ✅ Use specific hint from criteria check if provided
  if (hint) {
    return `Dobra myśl, ale jeszcze nie wszystko. ${hint}`;
  }

  const prompts = [
    "Rozumiem, ale powiedz więcej — co dokładnie o tym myślisz?",
    "To dobry początek. Teraz rozwiń swoją myśl — dlaczego tak uważasz?",
    "Interesujące! Ale wejdź głębiej — co za tym stoi?",
    "OK, ale co konkretnie Cię do tego skłoniło? Opowiedz więcej.",
  ];

  return prompts[Math.floor(Math.random() * prompts.length)];
}
