# 🎯 Challenges System (Knowledge Quiz with Tokens)

## 🎯 Core Principle

**Challenge = Interactive knowledge test with token rewards**

### ❌ What it's NOT:
- NOT a course or learning path
- NOT video lectures
- NOT long-form content

### ✅ What it IS:
- Quick knowledge verification
- Token rewards for correct answers
- Guest-friendly (no registration required)
- AI-powered answer validation
- Anti-abuse protection

---

## 📦 Data Model

### 1️⃣ Challenge (Main Entity)

```typescript
type Challenge = {
  id: string;                    // "sushi-basics-001"
  title: string;                 // "Основи суші: від бази до шефа"
  description: string;           // 1-2 sentences for guests
  category: ChallengeCategory;   // "japanese" | "baking" | "italian" | "other"
  language: Language;            // "ru" | "en" | "pl"
  status: ChallengeStatus;       // "draft" | "published" | "archived"
  
  // Progression settings
  mode: ProgressionMode;         // "random" | "linear"
  levels: Level[];               // Available difficulty levels [1, 2, 3, 4, 5]
  
  // Rewards per level
  rewardsPerLevel: {
    1: number;  // e.g., 5 tokens
    2: number;  // e.g., 10 tokens
    3: number;  // e.g., 20 tokens
    4: number;  // e.g., 40 tokens
    5: number;  // e.g., 100 tokens
  };
  
  showTokensBeforeAnswer: boolean;    // Show reward amount
  
  // Validation settings
  validationMethod: ValidationMethod; // "exact" | "ai"
  aiThreshold: AIThreshold;          // "strict" | "normal" | "lenient"
  showExplanationAfterAnswer: boolean;
  
  // Anti-abuse
  antiAbuse: {
    limitAttemptsPerSession: boolean;
    maxAttemptsPerSession?: number;
    noRepeatAfterCorrect: boolean;
    changeQuestionAfterWrong: boolean;
    trackBySessionId: boolean;
  };
  
  // Questions
  questions: Question[];
  totalQuestions: number;
  
  // Metadata
  createdBy: string;             // admin_id
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
};

type ChallengeCategory = "japanese" | "baking" | "italian" | "other";
type Language = "ru" | "en" | "pl";
type ChallengeStatus = "draft" | "published" | "archived";
type ProgressionMode = "random" | "linear";
type Level = 1 | 2 | 3 | 4 | 5;
type ValidationMethod = "exact" | "ai";
type AIThreshold = "strict" | "normal" | "lenient";
```

---

### 2️⃣ Question

```typescript
type Question = {
  id: string;                    // "q-001"
  challengeId: string;           // "sushi-basics-001"
  text: string;                  // Question text
  correctAnswer: string;         // Reference answer (for AI validation)
  explanation?: string;          // Optional explanation shown after answer
  level: Level;                  // 1, 2, 3, 4, 5
  answerType: AnswerType;        // "text" | "short" | "number"
  order: number;                 // For linear progression
  
  // Metadata
  createdAt: string;
  updatedAt: string;
};

type AnswerType = "text" | "short" | "number";
```

---

### 3️⃣ Guest Session (Progress Tracking)

```typescript
type GuestSession = {
  sessionId: string;             // UUID generated on first visit
  challengeId: string;
  
  // Progress
  answeredQuestions: string[];   // Question IDs
  correctAnswers: string[];      // Question IDs with correct answers
  incorrectAnswers: string[];    // Question IDs with wrong answers
  currentLevel: Level;           // Current difficulty level
  
  // Tokens
  earnedTokens: number;          // Total tokens earned
  
  // Anti-abuse
  attemptsCount: number;         // Total attempts in this session
  
  // Timestamps
  startedAt: string;
  lastActivityAt: string;
  expiresAt: string;             // Session expiry (e.g., 24h)
};
```

---

### 4️⃣ Answer Submission

```typescript
type AnswerSubmission = {
  sessionId: string;
  challengeId: string;
  questionId: string;
  userAnswer: string;
  
  // Validation result
  isCorrect: boolean;
  tokensEarned: number;
  explanation?: string;
  
  // AI validation details (if used)
  aiValidation?: {
    method: "exact" | "ai";
    confidence: number;          // 0-100
    reasoning: string;
  };
  
  timestamp: string;
};
```

---

## 🎨 UI Flow

### Admin Flow:

1. **Create Challenge** (`/admin/challenges/create`)
   - Basic info: title, description, category, language
   - Progression settings: mode, levels, rewards
   - Validation settings: method, AI threshold
   - Anti-abuse settings

2. **Add Questions** (same page)
   - Question text
   - Correct answer (reference)
   - Optional explanation
   - Level (1-5)
   - Answer type

3. **Preview** (modal or separate page)
   - See how guests will experience it
   - Test questions and validation

4. **Publish** (button)
   - Change status from "draft" to "published"

---

### Guest Flow:

1. **Challenge List** (`/challenges`)
   - Browse published challenges
   - Filter by category, language
   - See token rewards

2. **Start Challenge** (`/challenges/[id]`)
   - No login required
   - Generate session_id (stored in localStorage)
   - Show current question
   - Show token reward (if enabled)
   - Answer input field
   - Submit button

3. **Answer Validation**
   - Backend validates (exact match or AI)
   - Show result: correct/incorrect
   - Show explanation (if enabled)
   - Award tokens (if correct)
   - Show next question or completion

4. **Completion** (modal or separate screen)
   - Total tokens earned
   - Invite to register to save tokens
   - Share challenge result

---

## 🔒 Anti-Abuse Logic

### Session Tracking:
- Generate unique `session_id` on first visit
- Store in localStorage
- Track all attempts per session

### Rules:
1. **Limit attempts per session**: Max N attempts total
2. **No repeat after correct**: Don't show same question again if answered correctly
3. **Change question after wrong**: Show different question from same level
4. **Session expiry**: 24h or configurable

---

## 🤖 AI Validation

### How it works:
1. User submits answer
2. Backend sends to OpenAI:
   ```
   Question: "Чому лосось смажать шкірою вниз першим?"
   Reference answer: "Щоб шкіра стала хрусткою і захистила м'ясо"
   User answer: "Для хрусткості шкіри"
   
   Is this answer correct? Consider the meaning, not exact wording.
   Threshold: normal
   ```
3. AI responds with: `{ isCorrect: true, confidence: 85, reasoning: "..." }`
4. Award tokens if correct

### Thresholds:
- **Strict**: Almost exact match (90%+ confidence)
- **Normal**: Meaning is correct (70%+ confidence)
- **Lenient**: General understanding (50%+ confidence)

---

## 📂 File Structure

```
app/
├── admin/
│   └── challenges/
│       ├── page.tsx              # List all challenges
│       ├── create/
│       │   └── page.tsx          # Create new challenge
│       └── [id]/
│           ├── page.tsx          # Edit challenge
│           └── edit/
│               └── page.tsx
│
├── challenges/
│   ├── page.tsx                  # Public challenges list (for guests)
│   └── [id]/
│       └── page.tsx              # Challenge player (guest view)
│
└── api/
    ├── admin/
    │   └── challenges/
    │       ├── route.ts          # GET, POST (list, create)
    │       ├── [id]/
    │       │   └── route.ts      # GET, PUT, DELETE (view, update, delete)
    │       └── [id]/
    │           └── questions/
    │               └── route.ts  # POST, PUT, DELETE questions
    │
    └── challenges/
        ├── route.ts              # GET public challenges list
        ├── [id]/
        │   ├── route.ts          # GET challenge details
        │   ├── start/
        │   │   └── route.ts      # POST start session (guest)
        │   ├── answer/
        │   │   └── route.ts      # POST submit answer
        │   └── session/
        │       └── route.ts      # GET session progress

components/
├── admin/
│   └── challenges/
│       ├── ChallengeForm.tsx     # Form for creating/editing
│       ├── QuestionsList.tsx     # List questions in challenge
│       ├── QuestionForm.tsx      # Add/edit question
│       └── ChallengePreview.tsx  # Live preview
│
└── challenges/
    ├── ChallengeCard.tsx         # Challenge preview card
    ├── ChallengePlayer.tsx       # Main player UI
    ├── QuestionDisplay.tsx       # Show question + input
    ├── AnswerFeedback.tsx        # Show result (correct/wrong)
    └── CompletionModal.tsx       # Final result

lib/
├── challenges/
│   ├── challenges-data.ts        # Types and interfaces
│   ├── validation.ts             # Answer validation logic
│   └── ai-validator.ts           # AI validation with OpenAI
│
hooks/
└── useChallenges.ts              # React hook for challenges

i18n/
├── ru/
│   └── challenges.ts
├── en/
│   └── challenges.ts
└── pl/
    └── challenges.ts
```

---

## 🚀 Implementation Phases

### Phase 1: Backend + Data Model ✅
- [ ] Create database schema (challenges, questions, guest_sessions)
- [ ] API routes for CRUD operations
- [ ] AI validation integration

### Phase 2: Admin UI
- [ ] Create challenge form (`/admin/challenges/create`)
- [ ] Questions management UI
- [ ] Preview functionality

### Phase 3: Guest UI
- [ ] Public challenges list (`/challenges`)
- [ ] Challenge player (`/challenges/[id]`)
- [ ] Session tracking (localStorage)

### Phase 4: Anti-Abuse + Polish
- [ ] Implement anti-abuse rules
- [ ] Testing with real users
- [ ] UI polish and animations

---

## 🎯 Success Metrics

- **Engagement**: % of guests who complete challenge
- **Conversion**: % of guests who register after earning tokens
- **Quality**: % of AI validations that are correct
- **Abuse**: % of sessions flagged as suspicious

---

## 📝 Example Challenge: "Основи суші"

```typescript
{
  id: "sushi-basics-001",
  title: "Основи суші: від бази до шефа",
  description: "Перевірте свої знання про приготування суші",
  category: "japanese",
  language: "uk",
  status: "published",
  mode: "random",
  levels: [1, 2, 3, 4, 5],
  rewardsPerLevel: {
    1: 5,
    2: 10,
    3: 20,
    4: 40,
    5: 100
  },
  showTokensBeforeAnswer: true,
  validationMethod: "ai",
  aiThreshold: "normal",
  showExplanationAfterAnswer: true,
  antiAbuse: {
    limitAttemptsPerSession: true,
    maxAttemptsPerSession: 20,
    noRepeatAfterCorrect: true,
    changeQuestionAfterWrong: true,
    trackBySessionId: true
  },
  questions: [
    {
      id: "q-001",
      text: "Чому лосось смажать шкірою вниз першим?",
      correctAnswer: "Щоб шкіра стала хрусткою і захистила м'ясо від пересушування",
      explanation: "Шкіра захищає ніжне м'ясо від прямого жару і додає хрустку текстуру",
      level: 2,
      answerType: "text"
    },
    // ... more questions
  ]
}
```

---

## 🔄 Backend Integration Points

### Go Backend should provide:

```
POST   /api/admin/challenges                    # Create challenge
GET    /api/admin/challenges                    # List all (admin)
GET    /api/admin/challenges/:id                # Get one (admin)
PUT    /api/admin/challenges/:id                # Update challenge
DELETE /api/admin/challenges/:id                # Delete challenge

POST   /api/admin/challenges/:id/questions      # Add question
PUT    /api/admin/challenges/:id/questions/:qid # Update question
DELETE /api/admin/challenges/:id/questions/:qid # Delete question

GET    /api/challenges                          # Public list
GET    /api/challenges/:id                      # Get challenge details (guest)
POST   /api/challenges/:id/start                # Start session (guest)
POST   /api/challenges/:id/answer               # Submit answer (guest)
GET    /api/challenges/:id/session/:session_id  # Get session progress
```

---

## 💡 Future Enhancements

- Leaderboards (top scorers)
- Time limits per question
- Multiplayer challenges (compete with others)
- Challenge categories and tags
- Daily challenges
- Difficulty progression (adaptive)

---

**This is a standalone feature, separate from Academy paths.**
**Focus: Quick engagement + token rewards + guest conversion.**
