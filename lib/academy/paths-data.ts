/**
 * ACADEMY PATHS DATA MODEL
 * 
 * Akademia = система ścieżek rozwoju (не курси!)
 * - Praktyka, dialog z AI, realne decyzje
 * - Myślenie kucharza, nie kopiowanie przepisów
 * 
 * Based on: docs/active/ACADEMY_MODEL.md (Canonical)
 */

export type ModuleStatus = "locked" | "available" | "in-progress" | "completed";
export type PathStatus = "available" | "in-progress" | "locked" | "completed";
export type ModuleType = "ai-dialog" | "practice" | "reflection";
export type TaskType = "ai-question" | "decision" | "analysis" | "practice" | "reflection";

// Single task within a module
export type ModuleTask = {
  id: string;
  moduleId: string;
  type: TaskType;
  title: string;
  description: string;
  aiPrompt?: string; // For AI to understand its role
  aiQuestions?: string[]; // 2-3 questions AI will ask
  successCriteria?: string; // Logic for success (optional)
  reward: number; // ChefTokens
};

// Module = atomic unit of learning
export type PathModule = {
  id: string;
  pathId: string;
  number: number;
  title: string;
  idea: string; // Core concept (1 sentence)
  intro: string; // Short intro (2-3 paragraphs)
  type: ModuleType; // ai-dialog, practice, reflection
  estimatedTime: number; // Minutes
  tasks: ModuleTask[];
  totalReward: number;
  status: ModuleStatus;
  completedAt?: string;
};

// Path = collection of modules
export type LearningPath = {
  id: string;
  title: string;
  description: string;
  goal: string; // Main learning objective
  order: number; // Display order
  isFree: boolean; // First path is free
  requiredPathId: string | null; // null = available, else locked
  modules: PathModule[];
  totalModules: number;
  totalDuration: string;
  totalReward: number;
  status: PathStatus;
  progress: number; // 0-100
};

// User progress (for backend integration)
export type UserProgress = {
  userId: string;
  pathId: string;
  completedModules: string[];
  completedTasks: string[];
  earnedTokens: number;
  status: "not_started" | "in_progress" | "completed";
  startedAt: string;
  completedAt?: string;
  lastActivityAt: string;
};

/**
 * FIRST PATH: Od zera do świadomego gotowania
 * Goal: Nauczyć myśleć o produkcie, nie tylko gotować po przepisie
 */
export const foundationsPath: LearningPath = {
  id: "foundations",
  title: "Od zera do świadomego gotowania",
  description: "Fundament: produkt, smak, decyzje",
  goal: "Nauczyć myśleć o produkcie, nie tylko gotować po przepisie",
  order: 1,
  isFree: true,
  requiredPathId: null,
  totalModules: 5,
  totalDuration: "~2h",
  totalReward: 50,
  status: "available",
  progress: 0,
  modules: [
    // MODULE 1: Produkt ≠ składnik
    {
      id: "foundations-m1",
      pathId: "foundations",
      number: 1,
      title: "Produkt ≠ składnik",
      idea: "Produkt to jakość, świeżość i potencjał — nie tylko nazwa na liście",
      intro: `Gdy patrzysz na pomidora, widzisz „pomidor" czy widzisz świeżość, aromat, możliwości smaku?

Większość ludzi gotuje ze składnikami. Szef kuchni gotuje z produktami.

W tym module nauczysz się widzieć różnicę — i podejmować lepsze decyzje już na etapie wyboru.`,
      type: "ai-dialog",
      estimatedTime: 20,
      status: "available",
      tasks: [
        {
          id: "foundations-m1-t1",
          moduleId: "foundations-m1",
          type: "ai-question",
          title: "Dialog z AI: Wybór produktu",
          description: "AI zapyta Cię o produkt z Twojej lodówki. Odpowiedz, dlaczego właśnie ten.",
          aiPrompt: "Ask user to pick ONE product from their fridge and explain: Why this one? What makes it interesting? Don't give answers - ask follow-up questions about freshness, aroma, potential.",
          aiQuestions: [
            "Dlaczego wybrałeś ten produkt?",
            "Co jest w nim najważniejsze: smak, aromat czy tekstura?",
            "Jak wykorzystasz jego najlepsze cechy?"
          ],
          reward: 5
        },
        {
          id: "foundations-m1-t2",
          moduleId: "foundations-m1",
          type: "practice",
          title: "Zadanie praktyczne: Świadomy wybór",
          description: "Otwórz lodówkę i wybierz jeden produkt. Odpowiedz AI: dlaczego właśnie ten? Co go wyróżnia?",
          reward: 5
        }
      ],
      totalReward: 10
    },

    // MODULE 2: Smak to decyzja
    {
      id: "foundations-m2",
      pathId: "foundations",
      number: 2,
      title: "Smak to decyzja",
      idea: "Smak to balans, nie lista przypraw",
      intro: `Nie ma „przepisu na smak". Jest intencja.

Chcesz podkreślić świeżość? Kontrast? Głębię aromatu?

Każda decyzja kulinarna zmienia wynik — i ty to kontrolujesz.`,
      type: "ai-dialog",
      estimatedTime: 25,
      status: "locked",
      tasks: [
        {
          id: "foundations-m2-t1",
          moduleId: "foundations-m2",
          type: "ai-question",
          title: "Dialog z AI: Intencja smaku",
          description: "Co chcesz podkreślić: świeżość, głębię czy kontrast? Czego NIE dodasz i dlaczego?",
          aiPrompt: "Ask about flavor intention: fresh/depth/contrast. Ask what they WON'T add and why. Explore their reasoning without giving 'correct' answers.",
          aiQuestions: [
            "Co chcesz podkreślić: świeżość, głębię czy kontrast?",
            "Czego NIE dodasz i dlaczego?",
            "Jak to wpłynie na balans smaku?"
          ],
          reward: 5
        },
        {
          id: "foundations-m2-t2",
          moduleId: "foundations-m2",
          type: "practice",
          title: "Zadanie: Opis dania bez przepisu",
          description: "Opisz jedno danie bez przepisu — tylko intencję smaku. Co chcesz osiągnąć?",
          reward: 5
        }
      ],
      totalReward: 10
    },

    // MODULE 3: Myślenie przed gotowaniem
    {
      id: "foundations-m3",
      pathId: "foundations",
      number: 3,
      title: "Myślenie przed gotowaniem",
      idea: "Planowanie to oszczędność czasu, pieniędzy i produktów",
      intro: `Większość ludzi zaczyna gotować i dopiero wtedy odkrywa, że czegoś brakuje.

Szef kuchni myśli wcześniej.

Nauczysz się planować swój flow tak, aby nic się nie marnowało.`,
      type: "ai-dialog",
      estimatedTime: 20,
      status: "locked",
      tasks: [
        {
          id: "foundations-m3-t1",
          moduleId: "foundations-m3",
          type: "ai-question",
          title: "Dialog z AI: Wybór strategii",
          description: "AI pokaże 2 opcje: szybciej (drożej) vs wolniej (taniej). Wybierz i wyjaśnij dlaczego.",
          aiPrompt: "Present two cooking strategies: faster/expensive vs slower/cheaper. Ask user to choose and explain their priority (time/money/quality). Explore their reasoning.",
          aiQuestions: [
            "Która strategia jest dla Ciebie lepsza i dlaczego?",
            "Co jest teraz ważniejsze: czas czy budżet?",
            "Jak to wpłynie na wybór produktów?"
          ],
          reward: 5
        },
        {
          id: "foundations-m3-t2",
          moduleId: "foundations-m3",
          type: "practice",
          title: "Zadanie: Plan przed akcją",
          description: "Zaplanuj jedno danie: co i kiedy. Co możesz przygotować wcześniej?",
          reward: 5
        }
      ],
      totalReward: 10
    },

    // MODULE 4: Kontrola w trakcie
    {
      id: "foundations-m4",
      pathId: "foundations",
      number: 4,
      title: "Kontrola w trakcie",
      idea: "Degustacja i korekta to podstawa — nie ślepe podążanie za przepisem",
      intro: `Przepis nie wie, jak smakuje TWOJE jedzenie w TWOJEJ kuchni.

Ty musisz to wiedzieć.

Nauczysz się korygować w trakcie procesu — jak prawdziwy kucharz.`,
      type: "ai-dialog",
      estimatedTime: 20,
      status: "locked",
      tasks: [
        {
          id: "foundations-m4-t1",
          moduleId: "foundations-m4",
          type: "ai-question",
          title: "Dialog z AI: Korekta w trakcie",
          description: "Co zmienisz w połowie gotowania, jeśli smak jest za słaby? Za mocny?",
          aiPrompt: "Ask about mid-cooking corrections: What if taste is too weak? Too strong? What would they adjust and why? Don't give solutions - explore their thinking.",
          aiQuestions: [
            "Co zmienisz, jeśli smak jest za słaby?",
            "A jeśli za mocny — jak to zbalansujesz?",
            "Dlaczego to ważne sprawdzać w trakcie?"
          ],
          reward: 5
        },
        {
          id: "foundations-m4-t2",
          moduleId: "foundations-m4",
          type: "practice",
          title: "Zadanie: Degustuj i popraw",
          description: "Podczas gotowania: spróbuj, oceń i zmień coś. Zapisz, co zmieniłeś i dlaczego.",
          reward: 5
        }
      ],
      totalReward: 10
    },

    // MODULE 5: Refleksja kucharza
    {
      id: "foundations-m5",
      pathId: "foundations",
      number: 5,
      title: "Refleksja kucharza",
      idea: "Uczenie się przez analizę — co zadziałało, co nie i dlaczego",
      intro: `To nie jest egzamin. To refleksja.

Każdy szef kuchni analizuje swoje dania — co poszło dobrze, co można poprawić.

Teraz ty zrobisz to samo.`,
      type: "reflection",
      estimatedTime: 15,
      status: "locked",
      tasks: [
        {
          id: "foundations-m5-t1",
          moduleId: "foundations-m5",
          type: "reflection",
          title: "Zadanie końcowe: Analiza doświadczenia",
          description: "Co następnym razem zrobisz inaczej? Co było zbędne? Co Cię zaskoczyło?",
          aiPrompt: "Ask reflective questions: What would you do differently next time? What was unnecessary? What surprised you? Help them learn from experience.",
          aiQuestions: [
            "Co następnym razem zrobisz inaczej?",
            "Co było zbędne?",
            "Co Cię zaskoczyło?"
          ],
          reward: 10
        }
      ],
      totalReward: 10
    }
  ]
};

/**
 * OTHER PATHS (locked, minimal data for now)
 */
export const chefThinkingPath: LearningPath = {
  id: "chef-thinking",
  title: "Myślenie szefa kuchni",
  description: "Kontrola smaku, czasu i kosztów",
  goal: "Opanować decyzje szefa kuchni: priorytet, timing, ekonomia",
  order: 2,
  isFree: false,
  requiredPathId: "foundations",
  totalModules: 6,
  totalDuration: "~3h",
  totalReward: 75,
  status: "locked",
  progress: 0,
  modules: [] // To be designed after path 1 is complete
};

export const foodPairingPath: LearningPath = {
  id: "food-pairing",
  title: "Food Pairing & smak",
  description: "Łączenie potraw i napojów",
  goal: "Zrozumieć chemię smaków i komponować harmonijne zestawy",
  order: 3,
  isFree: false,
  requiredPathId: "chef-thinking",
  totalModules: 4,
  totalDuration: "~2h",
  totalReward: 60,
  status: "locked",
  progress: 0,
  modules: []
};

export const quickCookingPath: LearningPath = {
  id: "quick-cooking",
  title: "Szybka kuchnia na co dzień",
  description: "Decyzje pod presją czasu",
  goal: "Gotować mądrze i szybko bez utraty jakości",
  order: 4,
  isFree: false,
  requiredPathId: "chef-thinking",
  totalModules: 5,
  totalDuration: "~2h",
  totalReward: 65,
  status: "locked",
  progress: 0,
  modules: []
};

/**
 * ALL PATHS COLLECTION
 */
export const allPaths: LearningPath[] = [
  foundationsPath,
  chefThinkingPath,
  foodPairingPath,
  quickCookingPath
];

/**
 * HELPERS
 */
export function getPathById(id: string): LearningPath | undefined {
  return allPaths.find(path => path.id === id);
}

export function getModuleById(pathId: string, moduleId: string): PathModule | undefined {
  const path = getPathById(pathId);
  return path?.modules.find(module => module.id === moduleId);
}
