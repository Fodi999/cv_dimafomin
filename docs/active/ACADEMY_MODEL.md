# 🎓 Academy Data Model (Canonical)

**Last updated:** 2025-12-24

---

## 🎯 Core Principle

Akademia = система świadomego rozwoju przez praktykę i dialog z AI.
**NIE kursy, NIE lekce, NIE wideo.**

---

## 📦 Data Model

### 1️⃣ Ścieżka (Path)

```typescript
type Path = {
  id: string;                    // "foundations", "chef-thinking"
  title: string;                 // "Od zera do świadomego gotowania"
  description: string;           // Krótki opis (1 linia)
  goal: string;                  // Główny cel nauki (1-2 zdania)
  order: number;                 // 1, 2, 3, 4... (kolejność wyświetlania)
  isFree: boolean;               // Czy darmowa (pierwsza = true)
  requiredPathId: string | null; // null = dostępna, inaczej = locked
  totalModules: number;          // Liczba modułów
  totalDuration: string;         // "~2h"
  totalReward: number;           // ChefTokens za całą ścieżkę
  status: PathStatus;            // "available" | "locked" | "in-progress" | "completed"
  progress: number;              // 0-100 (% ukończenia)
}
```

**Example:**
```typescript
{
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
  progress: 0
}
```

---

### 2️⃣ Moduł (Module)

```typescript
type Module = {
  id: string;                    // "foundations-m1"
  pathId: string;                // "foundations"
  number: number;                // 1, 2, 3... (display order)
  title: string;                 // "Produkt ≠ składnik"
  idea: string;                  // Kluczowa idea (1 zdanie)
  intro: string;                 // Kontekst (2-3 akapity, może być multi-line)
  type: ModuleType;              // "ai-dialog" | "practice" | "reflection"
  estimatedTime: number;         // Minuty (15, 20, 30)
  tasks: Task[];                 // Zadania w module
  totalReward: number;           // ChefTokens za moduł
  status: ModuleStatus;          // "locked" | "available" | "in-progress" | "completed"
  completedAt?: string;          // ISO date
}

type ModuleType = 
  | "ai-dialog"    // Głównie dialog z AI
  | "practice"     // Praktyczne zadanie (cooking, wybór)
  | "reflection";  // Refleksja, podsumowanie
```

**Example:**
```typescript
{
  id: "foundations-m1",
  pathId: "foundations",
  number: 1,
  title: "Produkt ≠ składnik",
  idea: "Produkt to jakość, świeżość i potencjał — nie tylko nazwa",
  intro: "Gdy patrzysz na pomidora...\n\nWiększość ludzi...\n\nW tym module...",
  type: "ai-dialog",
  estimatedTime: 20,
  tasks: [...],
  totalReward: 10,
  status: "available"
}
```

---

### 3️⃣ Zadanie (Task)

```typescript
type Task = {
  id: string;                    // "foundations-m1-t1"
  moduleId: string;              // "foundations-m1"
  type: TaskType;                // Typ zadania
  title: string;                 // Krótka nazwa
  description: string;           // Co user ma zrobić
  aiPrompt?: string;             // Dla AI: jak prowadzić dialog
  aiQuestions?: string[];        // 2-3 pytania, które AI zada
  successCriteria?: string;      // Logika sukcesu (opcjonalnie)
  reward: number;                // ChefTokens za zadanie
}

type TaskType = 
  | "ai-question"    // AI zadaje pytanie, user odpowiada
  | "decision"       // User wybiera opcję (A/B/C)
  | "analysis"       // User analizuje i opisuje
  | "practice"       // Praktyczne działanie (ugotuj, zrób foto)
  | "reflection";    // Podsumowanie, co się nauczyłeś
```

**Example:**
```typescript
{
  id: "foundations-m1-t1",
  moduleId: "foundations-m1",
  type: "ai-question",
  title: "Dialog z AI: Wybór produktu",
  description: "AI zapyta Cię o produkt z lodówki. Odpowiedz, dlaczego właśnie ten.",
  aiPrompt: "Ask user to pick ONE product from their fridge and explain: Why this one?",
  aiQuestions: [
    "Dlaczego wybrałeś ten produkt?",
    "Co jest w nim najważniejsze: smak, aromat czy tekstura?",
    "Jak wykorzystasz jego najlepsze cechy?"
  ],
  reward: 5
}
```

---

### 4️⃣ Progress (User Progress)

```typescript
type UserProgress = {
  userId: string;
  pathId: string;
  completedModules: string[];    // ["foundations-m1", "foundations-m2"]
  completedTasks: string[];      // ["foundations-m1-t1", ...]
  earnedTokens: number;          // Suma ChefTokens z tej ścieżki
  status: ProgressStatus;        // "not_started" | "in_progress" | "completed"
  startedAt: string;             // ISO date
  completedAt?: string;          // ISO date (gdy status = completed)
  lastActivityAt: string;        // ISO date
}

type ProgressStatus = 
  | "not_started"
  | "in_progress"
  | "completed";
```

**Example:**
```typescript
{
  userId: "user123",
  pathId: "foundations",
  completedModules: ["foundations-m1"],
  completedTasks: ["foundations-m1-t1", "foundations-m1-t2"],
  earnedTokens: 10,
  status: "in_progress",
  startedAt: "2025-12-24T10:00:00Z",
  lastActivityAt: "2025-12-24T10:30:00Z"
}
```

---

## 🔄 Status Flow

### Path Status
```
not_started → locked (if requiredPathId)
           → available (if no requirement)
           → in_progress (first module started)
           → completed (all modules done)
```

### Module Status
```
locked → available (previous module completed)
       → in_progress (first task started)
       → completed (all tasks done)
```

---

## 🎯 Pierwsza Ścieżka: "Od zera do świadomego gotowania"

### Path Metadata
- **ID:** `foundations`
- **Modules:** 5
- **Duration:** ~2h (20-30 min/module)
- **Reward:** 50 ChefTokens
- **Free:** Yes

### Modules Structure

#### **Moduł 1: Produkt ≠ składnik**
- **Type:** `ai-dialog`
- **Time:** 20 min
- **Idea:** Produkt to jakość, świeżość i potencjał — nie tylko nazwa
- **AI Questions:**
  1. Dlaczego wybrałeś ten produkt?
  2. Co jest w nim najważniejsze: smak, aromat czy tekstura?
  3. Jak wykorzystasz jego najlepsze cechy?
- **Tasks:** 2 (ai-question + practice)
- **Reward:** +10 ChefTokens

#### **Moduł 2: Smak to decyzja**
- **Type:** `ai-dialog`
- **Time:** 20 min
- **Idea:** Smak to balans, nie lista przypraw
- **AI Questions:**
  1. Co chcesz podkreślić: świeżość, głębię czy kontrast?
  2. Czego NIE dodasz i dlaczego?
  3. Jak zmieni się smak, jeśli dodasz X?
- **Tasks:** 2 (ai-question + analysis)
- **Reward:** +10 ChefTokens

#### **Moduł 3: Myślenie przed gotowaniem**
- **Type:** `practice`
- **Time:** 25 min
- **Idea:** Planowanie to oszczędność czasu i pieniędzy
- **AI Questions:**
  1. Wybierz strategię: szybciej (drożej) vs wolniej (taniej)
  2. Co przygotować wcześniej, aby zaoszczędzić czas?
  3. Co można zrobić równolegle?
- **Tasks:** 2 (decision + practice)
- **Reward:** +10 ChefTokens

#### **Moduł 4: Kontrola w trakcie**
- **Type:** `practice`
- **Time:** 25 min
- **Idea:** Degustacja i korekta — nie ślepe podążanie za przepisem
- **AI Questions:**
  1. Spróbuj teraz. Co zmienisz, jeśli smak za słaby?
  2. Co zrobisz, jeśli tekstura nie ta?
  3. Kiedy przestaniesz korygować i uznasz, że gotowe?
- **Tasks:** 2 (ai-question + practice)
- **Reward:** +10 ChefTokens

#### **Moduł 5: Refleksja kucharza**
- **Type:** `reflection`
- **Time:** 20 min
- **Idea:** Uczenie się przez analizę — co zadziałało i dlaczego
- **AI Questions:**
  1. Co następnym razem zrobisz inaczej?
  2. Co było zbędne?
  3. Co Cię zaskoczyło?
- **Tasks:** 1 (reflection)
- **Reward:** +10 ChefTokens

---

## 🤖 AI Mentor Logic

### AI Role
AI = **Sokrates w kuchni**, nie ChatGPT.

### AI Behavior
❌ **NIE robi:**
- Nie daje gotowych odpowiedzi
- Nie pisze długich lekcji
- Nie ocenia "dobrze/źle"

✅ **Robi:**
- Zadaje pytania
- Analizuje decyzje usera
- Prowadzi do wniosków
- Pyta "dlaczego?"

### AI Response Pattern
```
User: "Wybrałem pomidor, bo jest tani"

AI: "Cena jest ważna — ale co z jakością i strukturą? 
     Jak to wpłynie na efekt końcowy?"

User: "Hmm, może powinienem wybrać lepszy..."

AI: "Dobra refleksja! Kiedy warto zapłacić więcej, 
     a kiedy tańszy produkt wystarczy?"
```

### AI API Contract
```typescript
// Request
POST /api/academy/ai/mentor
{
  pathId: "foundations",
  moduleId: "foundations-m1",
  taskId: "foundations-m1-t1",
  userAnswer: "Bo jest świeży i ładnie pachnie",
  conversationHistory: [...]
}

// Response
{
  aiMessage: "Świetnie! Aromat to klucz. Jak go wykorzystasz najefektywniej?",
  feedbackCode: "good_observation",
  nextQuestion: "Co zrobisz, aby ten aromat nie zniknął podczas gotowania?",
  shouldCompleteTask: false,
  progressUpdate: null
}
```

---

## 💰 ChefTokens Logic

### Nagrody
- **Za zadanie:** +5 ChefTokens
- **Za moduł:** +10 ChefTokens (suma zadań)
- **Za ścieżkę:** +50 ChefTokens (suma modułów)
- **Bonus za refleksję:** +5 (opcjonalnie)

### Kiedy przyznawane
- Task completed → instant +5
- Module completed → instant +10 (suma)
- Path completed → instant +50 + bonus animation

### UI Feedback
```
✅ Zadanie ukończone!
   +5 ChefTokens za świadomą decyzję

🎉 Moduł ukończony!
   +10 ChefTokens zdobyte

🏆 Ścieżka ukończona!
   +50 ChefTokens! Możesz je wykorzystać w Market
```

---

## 📱 UX Flow

### User Journey
```
1. /academy
   ↓ Click "Rozpocznij pierwszą ścieżkę"

2. /academy/paths/foundations
   ↓ Click module 1 "Rozpocznij"

3. /academy/paths/foundations/modules/foundations-m1
   ↓ Read intro + key idea
   ↓ AI zadaje pytanie
   ↓ User odpowiada (textarea)
   ↓ AI follow-up
   ↓ Task completed (+5 tokens)
   ↓ Next task / Complete module

4. Back to /academy/paths/foundations
   ↓ Module 1 ✅ completed
   ↓ Module 2 unlocked

5. Repeat...

6. All modules done → Path completed (+50 tokens)
```

### Wizard vs Separate Pages
**Decision:** Separate pages (current implementation) ✅

**Pros:**
- URL-based navigation
- Shareable links
- Browser back/forward works
- Simpler state management

---

## 🚫 What NOT to Do

### ❌ Don't add (yet):
- Druga ścieżka
- Video content
- Long text lectures
- Complex gamification
- Social features
- Certificates
- Badges

### ✅ Focus on:
- **Pierwsza ścieżka working end-to-end**
- AI dialog quality
- User progress tracking
- ChefTokens rewards
- Micro-UX polish

---

## 📊 Success Criteria

Pierwsza ścieżka jest "ready" gdy:

✅ User może:
1. Wybrać ścieżkę
2. Otworzyć moduł
3. Przeczytać intro
4. Rozmawiać z AI (realistic dialog)
5. Ukończyć zadania
6. Otrzymać ChefTokens
7. Zobaczyć progress (real-time)
8. Przejść do następnego modułu
9. Ukończyć całą ścieżkę
10. Zobaczyć podsumowanie (+50 tokens)

---

## 🔄 Next Steps

### Priority 1: Data Model Update
- [ ] Dodać `type` do Module (ai-dialog/practice/reflection)
- [ ] Dodać `estimatedTime` do Module
- [ ] Dodać `aiQuestions[]` do Task
- [ ] Dodać `successCriteria` do Task

### Priority 2: AI Integration
- [ ] Stworzyć `/api/academy/ai/mentor` endpoint
- [ ] Połączyć z OpenAI/Anthropic
- [ ] Implement Socratic method logic
- [ ] Test AI responses quality

### Priority 3: Progress Tracking
- [ ] Stworzyć `/api/academy/progress` endpoints
- [ ] Save user progress to DB
- [ ] Unlock logic (next module)
- [ ] ChefTokens balance update

### Priority 4: UX Polish
- [ ] Better animations
- [ ] Success celebrations
- [ ] Error states
- [ ] Loading states
- [ ] Mobile responsive

---

**Version:** 1.0  
**Status:** Canonical Model  
**Last Review:** 2025-12-24
