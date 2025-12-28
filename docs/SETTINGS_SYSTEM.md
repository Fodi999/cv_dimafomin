# 🎛️ USER SETTINGS SYSTEM

**Status**: ✅ Implemented (Frontend Complete, Backend Pending)  
**Location**: `/profile/settings`  
**Philosophy**: Минимум шума, максимум контроля. Только то, что реально влияет на опыт.

---

## 📋 QUICK START

1. Navigate to Profile → Click "Ustawienia" button
2. Choose section from sidebar (6 sections)
3. Change settings → Auto-saves instantly
4. AI Mentor and Decision Engine will use your preferences

---

## 🎯 WHY THIS IS PROFESSIONAL

| Before (Pet Project) | After (SaaS) |
|---------------------|--------------|
| AI does what it wants | I control what AI does |
| Unclear why this recipe | Because my priority is freshness |
| AI never stops asking | I set the intervention level |
| Same experience for everyone | Adapts to my skill level |

**Result**: Professional control panel for AI personality and behavior.

---

## 📐 UI STRUCTURE

```
/profile/settings
 ├─ 🌍 Podstawowe          (Language, time, units)
 ├─ 👨‍🍳 Kulinarny profil   (Skill, goals, allergies, diet)
 ├─ 🤖 AI & Mentor         (Style, intervention, strictness) ⭐
 ├─ 🍳 Lodówka i plan      (Auto-decisions, priorities)
 ├─ 💰 Budżet              (Mode, currency, limits)
 └─ 🔔 Powiadomienia       (Push/Email/Off per event)
```

---

## 🧠 1. CORE SETTINGS

### Language
- **Options**: Polski 🇵🇱 | English 🇬🇧 | Русский 🇷🇺
- **Impact**: UI, AI responses, hints, errors
- **Change**: Instant, no reload

### Time Format
- 24h (13:00) | 12h (1:00 PM)

### Units
- Metric (g, ml) | Kitchen (łyżki, szklanki)

---

## 👨‍🍳 2. CULINARY PROFILE

### Skill Level

| Level | AI Behavior |
|-------|------------|
| **Początkujący** | Explains basics, simple solutions, more guidance |
| **Średniozaawansowany** | Standard complexity, balanced explanations |
| **Profesjonalny kucharz** | Advanced techniques, deep analysis, minimal hand-holding |

### Goals (Multiple Selection)
- 🍽️ Gotować szybciej
- 💰 Oszczędzać pieniądze
- 🌱 Mniej marnować jedzenie
- 🧠 Uczyć się myślenia kucharza
- 👨‍🍳 Rozwój zawodowy

📌 Rules Engine uses this for recipe recommendations

### Restrictions
- **Allergies**: mleko, orzechy, etc.
- **Excluded**: wieprzowina, alkohol, etc.
- **Diet**: Vegetarian | Vegan | Pescatarian | Keto | Paleo

---

## 🤖 3. AI SETTINGS ⭐ KEY FEATURE

### Mentor Style

#### 🧑‍🏫 Mentor
- Socratic method, asks "Why?"
- Best for learning
- Greeting: "Zastanówmy się razem..."

#### ⚙️ Praktyk
- Direct steps: "Do A, then B"
- Quick to action
- Greeting: "OK, zróbmy to krok po kroku."

#### 📊 Analityk
- Shows numbers: "Costs X, saves Y"
- Deep decomposition
- Greeting: "Przeanalizujmy sytuację dokładnie."

**🎯 Solves**: AI knows WHEN to stop "Interesujące! Rozwiń dalej."

### Intervention Level
- Tylko pytania
- Sugestie
- Sugestie + przykłady

### Strictness (Academy)
- Lenient (70% match) | Moderate (100%) | Strict (130%)

---

## 🍳 4. FRIDGE & PLANNING

### Auto-Decisions
- ✅ Proponuj przepisy z lodówki
- ⚠️ Ostrzegaj przed psuciem
- 💸 Pokazuj tańsze alternatywy

### Priorities (Drag to reorder)
- Priority #1 = 3 points
- Priority #2 = 2 points
- Priority #3 = 1 point

Options: ⏱️ Czas | 💰 Koszt | 🍃 Świeżość

---

## 💰 5. BUDGET

### Modes
- **Passive**: Track silently
- **Active Warnings**: Alerts when exceeded
- **Economy Mode**: Always cheapest options

### Currency: PLN | EUR | USD
### Monthly Limit: Optional cap

---

## 🔔 6. NOTIFICATIONS

| Event | Description | Channels |
|-------|-------------|----------|
| 🚨 Produkty się psują | Expiring items | Push/Email/Off |
| ⏰ Czas na gotowanie | Meal reminders | Push/Email/Off |
| 🎓 Postęp w Akademii | Tasks, achievements | Push/Email/Off |
| 💰 Przekroczony budżet | Budget alerts | Push/Email/Off |

---

## 🔌 INTEGRATION POINTS

### AI Mentor (`app/api/academy/ai/mentor/route.ts`)

```typescript
const settings = await settingsApi.getSettings(token);

// Adjust mentor greeting
const greeting = getMentorGreeting(settings.aiPreferences.mentorStyle);

// Apply strictness multiplier
const multiplier = getStrictnessMultiplier(settings.aiPreferences.strictness);
const threshold = BASE_THRESHOLD * multiplier;

// Check skill level
if (settings.culinaryProfile.skillLevel === "beginner") {
  // More explanations
}
```

### Decision Engine (`app/api/ai/fridge/analyze/route.ts`)

```typescript
const settings = await settingsApi.getSettings(token);

// Filter by goals
const userGoals = settings.culinaryProfile.goals;
if (hasGoal(settings.culinaryProfile, "save_money")) {
  // Prioritize cheap recipes
}

// Sort by priorities
const scores = settings.fridge.priorities.map((p, i) => ({
  metric: p,
  score: getPriorityScore(settings.fridge.priorities, p)
}));
```

---

## 📁 FILE STRUCTURE

### Data Layer

**`lib/settings-types.ts`** (274 lines)
- 7 TypeScript interfaces
- Default values (DEFAULT_SETTINGS)
- Polish labels (SETTINGS_LABELS)
- Helper functions:
  - `getStrictnessMultiplier()`
  - `getPriorityScore()`
  - `hasGoal()`
  - `getMentorGreeting()`

**`lib/api/settings.ts`** (130 lines)
- `getSettings()` - GET /api/settings
- `updateSettings()` - PUT /api/settings
- `updateCoreSettings()` - PATCH /api/settings/core
- `updateCulinaryProfile()` - PATCH /api/settings/culinary-profile
- `updateAIPreferences()` - PATCH /api/settings/ai-preferences
- `updateFridgeSettings()` - PATCH /api/settings/fridge
- `updateBudgetSettings()` - PATCH /api/settings/budget
- `updateNotifications()` - PATCH /api/settings/notifications
- `resetSettings()` - POST /api/settings/reset

### UI Layer

**`app/profile/settings/page.tsx`** (228 lines)
- Sidebar navigation (6 sections)
- Auto-save on every change
- Loading states & error handling
- Responsive grid layout

**`components/profile/settings/*.tsx`**
1. `CoreSettingsSection` - Language buttons, time/unit selects
2. `CulinaryProfileSection` - Skill radio, goals checkboxes, allergies tags
3. `AIPreferencesSection` - Mentor style cards, strictness slider
4. `FridgeSettingsSection` - Auto-decision toggles, priority drag-and-drop
5. `BudgetSettingsSection` - Mode cards, currency buttons, limit input
6. `NotificationSettingsSection` - Channel matrix (4 events × 3 channels)

---

## 🚀 IMPLEMENTATION STATUS

### ✅ Complete
- [x] TypeScript types & constants
- [x] API client (frontend)
- [x] UI components (6 sections)
- [x] Main settings page
- [x] Profile button ("Ustawienia")
- [x] Auto-save functionality
- [x] Responsive design
- [x] Polish translations

### ⏳ Pending
- [ ] Backend Go API endpoints
- [ ] Database schema & migrations
- [ ] AI Mentor integration
- [ ] Decision Engine integration
- [ ] Settings persistence
- [ ] Default settings initialization

---

## 🔮 FUTURE ENHANCEMENTS

### Phase 2
- Settings sync across devices
- Import/Export settings JSON
- Settings presets (Beginner, Pro, Economy)
- Settings history & rollback

### Phase 3
- A/B testing different AI styles
- ML-based settings recommendations
- Community-shared settings profiles
- Analytics: "Users with goal X prefer style Y"

---

## 🚫 WHAT WE AVOIDED

❌ Avatars, banners, social profiles  
❌ Useless "personalization" gimmicks  
❌ "AI creativity level" (unclear)  
❌ Complex technical jargon  
❌ Settings that don't change behavior  
❌ Long single-page forms  
❌ Manual "Save" buttons (auto-save FTW)  

---

## 📊 METRICS

| Metric | Value |
|--------|-------|
| Settings sections | 7 |
| UI components | 6 |
| API endpoints | 9 |
| Type definitions | 274 lines |
| UI code | ~1000 lines |
| Hidden magic | 0 |

---

## 💡 KEY INSIGHTS

1. **Settings are AI control panel** - Not just UI customization, but behavior config
2. **Explicit beats implicit** - Clear cause-effect, no hidden magic
3. **Context shapes intelligence** - AI with user context > generic AI
4. **Professional means controllable** - Users trust what they can configure

---

## 📚 RELATED DOCS

- `docs/ACADEMY_AI_MENTOR_LOGIC.md` - AI Mentor completion criteria
- `docs/API_COVERAGE_REPORT.md` - Backend API endpoints
- `lib/settings-types.ts` - Complete type definitions

---

**Last Updated**: 2025-12-27  
**Version**: 1.0  
**Author**: Architecture Team
