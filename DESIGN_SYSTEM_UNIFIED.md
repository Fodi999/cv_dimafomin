# 🎨 Unified Design System v3.0 - FINAL

## Синхронизированный UI для Seafood Academy

**Last Updated**: 13 ноября 2025  
**Build Status**: ✅ All Sections Synchronized & Validated  
**Version**: 3.0 - Complete System

---

## � System Overview

Все компоненты платформы приведены в единый стиль с централизованными значениями для:
- 🔘 Кнопок (py-3 px-8 text-base rounded-lg)
- 📐 Отступов (py-24 vertical, px-4 sm:px-6 lg:px-8 horizontal)
- 📏 Max-width контейнеров (max-w-6xl)
- 🎭 Радиусов углов (rounded-lg = 8px)
- 📏 Grid gaps (gap-6 standard, gap-10 spacious)
- 🔤 Типографии (единые размеры и веса)
- 🎨 Выравнивания (text-center для заголовков секций)

---

## 🎯 Container System (UNIFIED)

## 🎯 Container System (UNIFIED)

### Main Container Width
```
Standard max-width: max-w-6xl (1152px)

Structure:
  <section className="py-24 ...">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      {/* Content */}
    </div>
  </section>

Applied to:
  ✅ AcademyHero: max-w-6xl
  ✅ AcademyAbout: max-w-6xl
  ✅ AcademyCourses (Chat): max-w-6xl
  ✅ AcademyCoursesPreview: max-w-6xl
  ✅ AcademyChefTokens: max-w-6xl
  ✅ AcademyFooter: max-w-6xl

All consistently unified on max-w-6xl!
```

### Content Constraint (Text)
```
For descriptions and centered content:
  max-w-2xl (512px) - standard for body text
  
Applied to:
  - Section descriptions
  - Centered paragraphs
  - Hero subtitle
  - Feature descriptions
```

### Special Cases
```
max-w-sm (384px) - Chat message bubbles
max-w-4xl (896px) - Large content blocks (deprecated, use max-w-6xl)
```

### Primary CTA Buttons (Large)
```
Где используется: Hero, Chat Preview, Courses Preview
Стиль: Gradient (sky→cyan) или Color solid
Размеры:
  - Padding: py-3 px-8 (12px vertical, 32px horizontal)
  - Font size: text-base (16px)
  - Icon size: w-5 h-5 (20px)
  - Border radius: rounded-lg (8px)
  - Shadow: shadow-lg → shadow-xl on hover
  - State: active:scale-95
```

**Примеры:**
- Hero: "Начать обучение" (white bg, black text)
- Hero: "Начать диалог" (black bg, white text)
- Chat Preview: "Начать разговор с AI" (gradient sky→cyan)
- Courses Preview: "Смотреть все курсы" (gradient sky→cyan)

### Secondary Buttons (Small - Card level)
```
Где используется: Course cards
Стиль: Subtle (white/10 bg, border)
Размеры:
  - Padding: py-2.5 px-6 (10px vertical, 24px horizontal)
  - Font size: text-sm (14px)
  - Icon size: w-4 h-4 (16px)
  - Border radius: rounded-lg (8px)
```

**Примеры:**
- Course cards: "Подробнее" button

---

## 📏 Spacing System (VERTICAL RHYTHM)

Base unit: 4px (Tailwind default)

### Section Padding
```
All content sections: py-24 (96px vertical)
Max-width container: max-w-6xl or max-w-7xl
Horizontal padding: px-4 sm:px-6 lg:px-8
```

### Margin/Padding Hierarchy
```
Element spacing (margins):
  mb-4   = 16px   (small gap between elements)
  mb-6   = 24px   (standard gap between sections)
  mb-8   = 32px   (medium gap)
  mb-12  = 48px   (large gap between major blocks)
  mb-16  = 64px   (extra large)
  mb-20  = 80px   (between main sections)

Card/Container padding:
  p-4    = 16px   (input fields, small components)
  p-5    = 20px   (course cards content section)
  p-6    = 24px   (feature cards, medium components)
  p-8    = 32px   (large cards, about section)

Button padding:
  py-2.5 = 10px   (small buttons)
  py-3   = 12px   (standard buttons - ALL PRIMARY CTAs)
  py-4   = 16px   (large buttons - DEPRECATED)
```

### Grid Gaps
```
Standard card grid: gap-6 (24px)
Course cards grid:  gap-10 (40px) - Pinterest style requires extra breathing room
Feature cards:      gap-6 (24px)
```

---

## 🔤 Typography System

### Headings - Alignment & Structure
```
ALIGNMENT RULES:
  Hero H1:           text-center (center-aligned, full width)
  Section H2:        text-center (center-aligned, within text-center container)
  Sub H3:            text-center (center-aligned in container with description)
  Card H3/H4:        NO CENTER (left-aligned within card) ← EXCEPTION
  Footer H2:         left-aligned (brand section)

SIZING & WEIGHT:
  Hero H1:           text-6xl lg:text-7xl font-bold leading-tight (56-64px)
  Section H2:        text-4xl sm:text-4xl font-bold leading-tight (36-48px)
  Sub H3:            text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight (24-36px)
  Card H3/H4:        text-lg font-bold (18px) or text-xl font-bold (20px)
  Card H5:           text-base font-bold (16px)
```

### Heading Margins
```
H1 after badge:    mb-6 (24px)
H2 after badge:    mb-6 (24px)
H3 in section:     mb-4 or mb-6 depending on context
H4 in cards:       mb-2 or mb-3 (compact)

Description after heading: should be in mx-auto max-w-2xl for centered layouts
```

### Body Text
```
Base paragraph:    text-base leading-relaxed (16px, relaxed line-height)
Large paragraph:   text-lg leading-relaxed (18px)
Small text:        text-sm leading-relaxed (14px)
Tiny text (meta):  text-xs (12px)

Line heights:
  leading-tight   = 1.25  (for headings)
  leading-snug    = 1.375 (for descriptions)
  leading-relaxed = 1.625 (for body copy)
```

---

## 🎨 Border Radius System

### Standardized
```
All rounded corners: rounded-lg = 8px (except where explicitly different)

Exceptions:
  - None currently (Hero buttons changed to rounded-lg from rounded-xl)
  - Can use rounded-xl (12px) for hero emphasis if needed in future
```

---

## 🛠️ Component-Specific Guidelines

### Section Header (STANDARD PATTERN)
```
Pattern for ALL section headers:
<div className="text-center mb-16">
  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 dark:bg-sky-500/20 border border-sky-200/50 dark:border-sky-800/50 mb-6">
    <Icon className="w-6 h-6 text-sky-600 dark:text-sky-400" />
    <span className="text-sm font-semibold text-sky-600 dark:text-sky-400">SECTION LABEL</span>
  </div>
  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
    Section Heading
  </h2>
  <p className="text-base sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
    Section description/subtitle
  </p>
</div>

Key features:
- Outer div: text-center (centers all content)
- Badge: inline-flex (natural width), mb-6
- H2: mb-6 (always)
- Description: max-w-2xl mx-auto (centers and constrains width)
```

### Card Headers (EXCEPTION - LEFT ALIGNED)
```
NO text-center inside cards!
<h3 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">
  Card Title
</h3>

This is intentional - cards are compact containers
```
```
Layout:
  - min-h-screen with flex centering
  - pt-40 (140px top padding before content)
  - mb-20 (80px bottom margin before stats)
  - mt-20 (80px top margin after buttons)

Buttons:
  - Primary: white bg, black text, white border
  - Secondary: black bg, white text, white border
  - Both: py-3 px-8 rounded-lg
  - Gap between buttons: gap-6 (24px)

Stats cards:
  - p-6 rounded-lg
  - Shadow with hover effect
  - 3-column grid on desktop
```

### Chat Preview
```
Container:
  - max-w-2xl mx-auto
  - bg-white dark:bg-gray-900
  - rounded-lg shadow-lg
  - border border-gray-200 dark:border-gray-800

Header:
  - p-5 with border-bottom
  - Avatar w-12 h-12
  - h3 font-bold text-base

Messages:
  - Space between: gap-3
  - p-4 rounded-lg
  - AI message: gray-100 dark:gray-800
  - User message: sky-500 dark:sky-600

Input:
  - p-4 rounded-lg
  - border border-gray-300 dark:border-gray-700

CTA Button:
  - py-3 px-8 text-base rounded-lg
  - Positioned at: text-center mt-12
```

### Course Cards (Pinterest Style)
```
Grid:
  - md:grid-cols-3 gap-10 (24px * 2 = extra breathing room)
  - Responsive down to single column

Card structure:
  - rounded-lg (not rounded-2xl anymore)
  - shadow-lg hover:shadow-2xl
  - border border-gray-100 dark:border-gray-800

Image section:
  - h-64 (256px)
  - overflow-hidden
  - hover:scale-110 transition-transform duration-500

Content section:
  - p-5 (20px)
  - space-y-4 (16px between elements)

Title: text-xl font-bold
Description: text-sm line-clamp-2
Meta row: flex items-center justify-between text-xs
Progress: h-1.5 (6px)
Button: py-2.5 px-6 text-sm rounded-lg
```

### About Section Cards
```
Grid:
  - sm:grid-cols-3 gap-6 (24px)

Card:
  - p-6 (24px) for feature cards
  - p-8 (32px) for AI Dima Fomin cards
  - rounded-lg
  - bg-white dark:bg-gray-900
  - border border-gray-200 dark:border-gray-700
  - hover:shadow-md transition

Title: text-lg font-bold (18px)
Description: text-base leading-relaxed (16px)
```

---

## ✅ Synchronization Checklist

### Container Max-Width
- [x] Hero: max-w-6xl
- [x] About: max-w-6xl (added py-24 to section)
- [x] Chat Preview: max-w-6xl
- [x] Courses Preview: max-w-6xl (changed from max-w-7xl)
- [x] ChefTokens: max-w-6xl
- [x] Footer: max-w-6xl (changed from max-w-7xl)

### Section Padding (Vertical)
- [x] Hero: min-h-screen pt-40 (special case - full height)
- [x] About: py-24 (added)
- [x] Chat: py-24
- [x] Courses: py-24
- [x] ChefTokens: py-24
- [x] Footer: py-24 section

### Container Padding (Horizontal)
- [x] All: px-4 sm:px-6 lg:px-8

### Section Headers
- [x] Hero H1: text-center
- [x] About H2: text-center (added)
- [x] All section headers: text-center

### Button System
- [x] All primary CTA buttons: py-3 px-8 text-base rounded-lg
- [x] Small card buttons: py-2.5 px-6 text-sm rounded-lg
- [x] Icon sizing: w-5 h-5 (reduced from w-6)

### Vertical Rhythm
- [x] All sections: py-24 (96px)
- [x] Element spacing: mb-6/mb-8/mb-12/mb-16/mb-20
- [x] No py-4, py-12, py-16, py-20 on sections (only py-24)

### Grid Gaps
- [x] Standard cards: gap-6 (24px)
- [x] Spacious (images): gap-10 (40px)
- [x] Feature cards: gap-6

---

## 🎯 Design Tokens Summary

```
BUTTONS:
  Large CTA:      py-3 px-8 text-base rounded-lg
  Small (card):   py-2.5 px-6 text-sm rounded-lg

SPACING:
  Section:        py-24 (96px)
  Large gap:      mb-20 (80px)
  Medium gap:     mb-8 (32px)
  Small gap:      mb-6 (24px)
  Compact:        mb-4 (16px)

TYPOGRAPHY:
  H1:             text-6xl lg:text-7xl font-bold leading-tight
  H2:             text-4xl font-bold leading-tight
  H3:             text-2xl font-bold leading-tight
  Body:           text-base leading-relaxed

BORDERS:
  Radius:         rounded-lg (8px)
  Card border:    border border-gray-200 dark:border-gray-700
  
GRID:
  Standard:       gap-6 (24px)
  Spacious:       gap-10 (40px)
  Tight:          gap-4 (16px)
```

---

## 🚀 Files Modified (Version 3.0 Updates)

### 1. AcademyHero.tsx
   - Button sizing: py-6 → py-3, px-10 → px-8, text-lg → text-base
   - Button radius: rounded-xl → rounded-lg
   - Icon sizing: w-6 → w-5
   - Button gap: gap-4 → gap-6
   - Subtitle margin: mb-4 → mb-6
   - ✅ max-w-6xl confirmed

### 2. AcademyAbout.tsx
   - Added py-24 to section (was missing)
   - Removed py-24 from inner div (moved to section)
   - Added text-center to H2 "О проекте"
   - Added text-center to H3 "Цифровой наставник"
   - Button: py-6 → py-3, px-10 → px-8, rounded-xl → rounded-lg, w-6 → w-5
   - ✅ max-w-6xl confirmed

### 3. AcademyCourses.tsx (Chat Preview)
   - Button: py-6 → py-3, px-10 → px-8, rounded-xl → rounded-lg, w-5 h-5
   - ✅ max-w-6xl confirmed
   - ✅ py-24 confirmed

### 4. AcademyCoursesPreview.tsx
   - Max-width: max-w-7xl → max-w-6xl ✓
   - Button: py-6 → py-3, px-10 → px-8, rounded-xl → rounded-lg, w-6 → w-5
   - ✅ max-w-6xl now unified

### 5. AcademyChefTokens.tsx
   - Button: py-6 → py-3, px-10 → px-8, rounded-xl → rounded-lg, w-6 → w-5
   - ✅ max-w-6xl confirmed
   - ✅ py-24 confirmed

### 6. AcademyFooter.tsx
   - Max-width: max-w-7xl → max-w-6xl ✓
   - Section padding: py-20 → py-24 (for footer internal grid)
   - Footer bottom padding: py-12 → py-8 (with border-top added)
   - ✅ max-w-6xl now unified

---

## 📋 Migration from v2.0 → v3.0

**What Changed:**
1. ✅ Unified max-width: max-w-6xl everywhere
2. ✅ Added py-24 to About section
3. ✅ Standardized all CTA buttons

**What Stayed the Same:**
- ✅ All button styles (py-3 px-8 text-base rounded-lg)
- ✅ All spacing system
- ✅ All typography
- ✅ All grid gaps

**Validation:**
- ✅ Zero compilation errors
- ✅ All sections responsive
- ✅ Dark mode fully supported
- ✅ All animations preserved

## 📱 Responsive Breakpoints

All components maintain consistent spacing across:
- Mobile (default)
- Tablet (sm: 640px)
- Desktop (md: 768px, lg: 1024px)

Grid adjustments:
- Course cards: 1 column mobile → 3 columns desktop
- Feature cards: 2 columns tablet → 3 columns desktop
- 2 column cards: responsive down to 1 column

---

## 🌙 Dark Mode Support

All changes preserve dark mode:
- Colors use `dark:` prefixes
- Shadows use `dark:shadow-xl`
- Borders use `dark:border-gray-700/800`
- Text uses `dark:text-white/gray-200`

---

## ⚡ Performance Notes

- All animations remain lightweight
- Transitions: duration-200 to duration-500
- Hover states: y: -4px or scale: 1.02
- No layout shifts due to consistent spacing

---

## 🎬 Next Steps (Optional Future Enhancements)

- [ ] Create shared button component variants (primary, secondary, small)
- [ ] Extract spacing tokens to CSS custom properties
- [ ] Document hover/active states more explicitly
- [ ] Consider creating Storybook for component documentation
- [ ] Add animation consistency guidelines

