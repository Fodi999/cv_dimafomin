/**
 * CHALLENGES SYSTEM - Types and Interfaces
 * 
 * Challenge = Interactive knowledge quiz with token rewards
 * - For guests (no registration required)
 * - AI-powered answer validation
 * - Anti-abuse protection
 * 
 * @see docs/active/CHALLENGES_MODEL.md
 */

// ========================
// ENUMS & CONSTANTS
// ========================

export type ChallengeCategory = "japanese" | "baking" | "italian" | "other";
export type Language = "ru" | "en" | "pl" | "uk";
export type ChallengeStatus = "draft" | "published" | "archived";
export type ProgressionMode = "random" | "linear";
export type Level = 1 | 2 | 3 | 4 | 5;
export type ValidationMethod = "exact" | "ai";
export type AIThreshold = "strict" | "normal" | "lenient";
export type AnswerType = "text" | "short" | "number";

export const CHALLENGE_CATEGORIES: { value: ChallengeCategory; label: string }[] = [
  { value: "japanese", label: "Японська кухня" },
  { value: "baking", label: "Випічка" },
  { value: "italian", label: "Італійська кухня" },
  { value: "other", label: "Інше" },
];

export const CHALLENGE_LANGUAGES: { value: Language; label: string }[] = [
  { value: "ru", label: "RU - Русский" },
  { value: "en", label: "EN - English" },
  { value: "pl", label: "PL - Polski" },
  { value: "uk", label: "UK - Українська" },
];

export const DIFFICULTY_LEVELS: { value: Level; label: string; reward: number }[] = [
  { value: 1, label: "Рівень 1 — Базовий", reward: 5 },
  { value: 2, label: "Рівень 2 — Початковий", reward: 10 },
  { value: 3, label: "Рівень 3 — Середній", reward: 20 },
  { value: 4, label: "Рівень 4 — Просунутий", reward: 40 },
  { value: 5, label: "Рівень 5 — Шеф-рівень", reward: 100 },
];

// ========================
// MAIN TYPES
// ========================

export interface Challenge {
  id: string;
  title: string;
  description: string; // 1-2 sentences for guests
  category: ChallengeCategory;
  language: Language;
  status: ChallengeStatus;

  // Progression settings
  mode: ProgressionMode;
  levels: Level[]; // Available difficulty levels [1, 2, 3, 4, 5]

  // Rewards per level
  rewardsPerLevel: Record<Level, number>;

  showTokensBeforeAnswer: boolean;

  // Validation settings
  validationMethod: ValidationMethod;
  aiThreshold: AIThreshold;
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
  createdBy: string; // admin_id
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Question {
  id: string;
  challengeId: string;
  text: string; // Question text
  correctAnswer: string; // Reference answer (for AI validation)
  explanation?: string; // Optional explanation shown after answer
  level: Level;
  answerType: AnswerType;
  order: number; // For linear progression

  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface GuestSession {
  sessionId: string; // UUID generated on first visit
  challengeId: string;

  // Progress
  answeredQuestions: string[]; // Question IDs
  correctAnswers: string[]; // Question IDs with correct answers
  incorrectAnswers: string[]; // Question IDs with wrong answers
  currentLevel: Level;

  // Tokens
  earnedTokens: number;

  // Anti-abuse
  attemptsCount: number;

  // Timestamps
  startedAt: string;
  lastActivityAt: string;
  expiresAt: string; // Session expiry (e.g., 24h)
}

export interface AnswerSubmission {
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
    confidence: number; // 0-100
    reasoning: string;
  };

  timestamp: string;
}

// ========================
// FORM DATA (for admin UI)
// ========================

export interface ChallengeFormData {
  // Basic info
  title: string;
  description: string;
  category: ChallengeCategory;
  language: Language;
  status: ChallengeStatus;

  // Progression
  mode: ProgressionMode;
  levels: Level[];

  // Rewards (simplified for form)
  rewards: {
    level1: number;
    level2: number;
    level3: number;
    level4: number;
    level5: number;
  };

  showTokensBeforeAnswer: boolean;

  // Validation
  validationMethod: ValidationMethod;
  aiThreshold: AIThreshold;
  showExplanationAfterAnswer: boolean;

  // Anti-abuse
  limitAttemptsPerSession: boolean;
  maxAttemptsPerSession: number;
  noRepeatAfterCorrect: boolean;
  changeQuestionAfterWrong: boolean;
  trackBySessionId: boolean;
}

export interface QuestionFormData {
  text: string;
  correctAnswer: string;
  explanation?: string;
  level: Level;
  answerType: AnswerType;
}

// ========================
// API RESPONSES
// ========================

export interface ChallengeListResponse {
  success: boolean;
  data: Challenge[];
  meta: {
    total: number;
    page: number;
    perPage: number;
  };
}

export interface ChallengeDetailResponse {
  success: boolean;
  data: Challenge;
}

export interface SessionStartResponse {
  success: boolean;
  data: {
    sessionId: string;
    challengeId: string;
    currentQuestion: Question;
    earnedTokens: number;
    attemptsCount: number;
  };
}

export interface AnswerSubmissionResponse {
  success: boolean;
  data: {
    isCorrect: boolean;
    tokensEarned: number;
    totalEarnedTokens: number;
    explanation?: string;
    nextQuestion?: Question;
    completed: boolean;
    aiValidation?: {
      confidence: number;
      reasoning: string;
    };
  };
}

export interface SessionProgressResponse {
  success: boolean;
  data: GuestSession;
}

// ========================
// HELPER TYPES
// ========================

export interface ChallengeStats {
  totalQuestions: number;
  questionsPerLevel: Record<Level, number>;
  totalPossibleTokens: number;
  averageQuestionDifficulty: number;
}

export interface ValidationResult {
  isCorrect: boolean;
  confidence: number;
  reasoning: string;
  method: "exact" | "ai";
}
