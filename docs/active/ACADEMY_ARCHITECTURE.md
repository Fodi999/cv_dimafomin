# 🎓 Academy System Architecture

## 🎯 Akademia = System Ścieżek Rozwoju (NIE kursy!)

**Core Principle:**
Akademia to system rozwoju oparty na praktyce, dialogu z AI i realnych decyzjach w kuchni.

### ❌ Co to NIE jest:
- Kursy wideo
- Lekce tekstowe
- "Kopiowanie przepisów"
- Certyfikaty i bejdże

### ✅ Co to JEST:
- Ścieżki myślenia
- Dialog z AI Mentorem
- Praktyczne decyzje
- ChefTokens za postęp

---

## 📦 Struktura Danych

```
LearningPath (Ścieżka)
├── id, title, description
├── goal (cel nauki)
├── totalModules, totalDuration, totalReward
├── status (available/locked/in-progress/completed)
├── progress (0-100%)
│
└── modules[] (Moduły)
    ├── id, number, title
    ├── idea (kluczowa koncepcja)
    ├── intro (wprowadzenie 2-3 akapity)
    ├── status (locked/available/in-progress/completed)
    │
    └── tasks[] (Zadania)
        ├── type (ai-question/practical/reflection)
        ├── title, description
        ├── aiPrompt (dla AI)
        └── reward (ChefTokens)
```

---

## 🛣️ Pierwsza Ścieżka: "Od zera do świadomego gotowania"

**Cel:** Nauczyć myśleć o produkcie, nie tylko gotować po przepisie

### Moduły (5):

1. **Produkt ≠ składnik**
   - Idea: Produkt to jakość, świeżość, potencjał
   - 2 zadania: AI dialog + praktyczne
   - +10 ChefTokens

2. **Smak to decyzja**
   - Idea: Smak to balans, nie lista przypraw
   - 2 zadania: Intencja smaku + opis dania
   - +10 ChefTokens

3. **Myślenie przed gotowaniem**
   - Idea: Planowanie to oszczędność
   - 2 zadania: Wybór strategii + plan
   - +10 ChefTokens

4. **Kontrola w trakcie**
   - Idea: Degustacja i korekta
   - 2 zadania: AI dialog + praktyka
   - +10 ChefTokens

5. **Refleksja kucharza**
   - Idea: Uczenie przez analizę
   - 1 zadanie: Refleksja końcowa
   - +10 ChefTokens

**Total:** 50 ChefTokens

---

## 🗂️ Struktura Plików

```
lib/academy/
└── paths-data.ts          # Wszystkie dane ścieżek i modułów

app/academy/
├── page.tsx               # Lista wszystkich ścieżek (overview)
└── paths/
    └── [id]/
        └── page.tsx       # Detale ścieżki + lista modułów
```

---

## 🎨 UI Flow

### 1. Academy Overview (`/academy`)
- Hero: "Akademia świadomego gotowania"
- How it works (3 karty)
- **Ścieżki rozwoju** (4 karty z progress/locked)
- Value benefits
- AI Mentor preview
- Footer CTA

### 2. Path Detail (`/academy/paths/[id]`)
- Back button
- Path header (tytuł, cel, progress bar, metadata)
- **Lista modułów** (expand)
  - Numer + status icon
  - Kluczowa idea (highlighted)
  - Intro (2-3 akapity)
  - Preview zadań
  - CTA button (rozpocznij/kontynuuj/locked)
- AI Mentor preview (inline)

### 3. Module Detail (TODO - następny krok)
`/academy/paths/[pathId]/modules/[moduleId]`
- AI Mentor inline (chat interface)
- Tasks z ChefTokens
- Progress tracking

---

## 🚀 Roadmap

### ✅ DONE (ETAP 1-3):
- [x] Zdefiniowano model Akademii
- [x] Zaprojektowano pierwszą ścieżkę (5 modułów)
- [x] Utworzono strukturę danych (`paths-data.ts`)
- [x] UI dla overview (`/academy`)
- [x] UI dla detalów ścieżki (`/academy/paths/[id]`)
- [x] Linki między stronami

### 🔜 TODO (następne kroki):
- [ ] Module detail page (AI Mentor inline)
- [ ] Task completion system
- [ ] ChefTokens integration
- [ ] Progress tracking (save to backend)
- [ ] Unlock logic (poprzedni moduł ukończony)

### ⏳ LATER (nie teraz!):
- Druga ścieżka
- Sertyfikaty
- Bejdže/gamification
- Video content

---

## 🧠 AI Mentor Role

**Ważne:** AI nie daje "poprawnych odpowiedzi" — pyta, analizuje, prowokuje myślenie.

Przykładowe prompty w `tasks[].aiPrompt`:
- "Ask user to pick ONE product from their fridge and explain: Why this one?"
- "Ask about flavor intention: fresh/depth/contrast"
- "Present two strategies: faster/expensive vs slower/cheaper. Ask to choose and explain"

AI = Sokratic method w kuchni.

---

## 💾 Data Source

**Single Source of Truth:** `lib/academy/paths-data.ts`

Import:
```typescript
import { allPaths, getPathById, getModuleById } from "@/lib/academy/paths-data";
```

Wszystkie dane ścieżek, modułów i zadań są tutaj.
Backend integration = później (najpierw prototyp).

---

**Status:** ETAP 3 DONE ✅
**Next:** Module detail page z AI Mentor inline
