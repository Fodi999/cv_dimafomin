# 🎬 Route-Based Modal (Instagram-Style) - Complete Implementation

## Overview

A fully functional **Instagram-style modal** for viewing recipes using Next.js 16 parallel routes and server/client component patterns. Users can click any recipe card to open a full-screen modal without leaving the page.

---

## 📋 Features

✨ **Modal Features**
- Smooth spring animations (Framer Motion)
- Backdrop blur with semi-transparent overlay
- Click outside to close (backdrop click)
- Spring-based easing for natural feel
- Responsive design (mobile to desktop)

🖼️ **Recipe Display**
- Large hero image with gradient overlay
- Author info and rating badges
- Difficulty level with color coding
- Cooking time, servings, tokens earned
- Full ingredients list (numbered)
- Step-by-step instructions (numbered)
- Star rating system

💬 **Interactive Elements**
- Like button with counter
- Save button for bookmarks
- Comment count display
- Share button
- Navigation arrows (prev/next recipe)
- Smooth transitions between recipes

🔄 **Navigation**
- Previous/Next recipe arrows (if available)
- Back button (close modal)
- Click outside to close
- URL-based navigation (`/recipes/[id]`)

---

## 📁 File Structure

```
app/
├── recipes/
│   ├── layout.tsx                 ← Main layout with parallel routes
│   ├── page.tsx                   ← Recipes grid view
│   └── @modal/                    ← Parallel route (modal slot)
│       ├── layout.tsx             ← Modal wrapper with backdrop
│       ├── default.tsx            ← Empty state (no modal open)
│       └── [id]/
│           └── page.tsx           ← Recipe modal content

components/
├── recipes/
│   ├── RecipeModalContent.tsx     ← Modal content component
│   └── RecipeCard.tsx             ← Recipe card (grid item)
```

---

## 🚀 Quick Start

### 1. Navigate to Recipes Page
```
/recipes
```

### 2. Click Any Recipe Card
Opens `/recipes/1` with modal overlay

### 3. Interact with Modal
- Like/Save recipe
- View ingredients and steps
- Navigate to prev/next recipe with arrows
- Click backdrop or close button to exit

### 4. Modal Closes Gracefully
Returns to `/recipes` page view

---

## 🎨 Component Architecture

### RecipeModalContent
**Purpose**: Displays recipe details in modal format
**Props**:
```typescript
interface RecipeModalContentProps {
  recipe: RecipeModalData;
  onClose?: () => void;
  nextRecipeId?: string;
  prevRecipeId?: string;
}
```

**Features**:
- Two-column layout (image left, details right)
- Responsive (single column on mobile)
- Interactive action buttons
- Navigation arrows

### RecipeCard
**Purpose**: Recipe grid card that links to modal
**Props**:
```typescript
interface RecipeCardProps {
  id: string;
  title: string;
  imageUrl: string;
  author: { name: string; avatar?: string };
  difficulty?: "beginner" | "intermediate" | "advanced";
  likes?: number;
  comments?: number;
  cookingTime?: number;
  category?: string;
}
```

**Features**:
- Hover animation (lift up)
- Author info on hover
- Like/Save/Comment actions
- Difficulty badge with color
- Category badge

### Modal Layout (Parallel Routes)
**Purpose**: Wraps modal content with backdrop and animations
**Features**:
- Backdrop blur effect
- AnimatePresence wrapper
- Spring transition animations
- Click-outside-to-close handler

---

## 🔄 Data Flow

```
/recipes page
    ↓
    Click RecipeCard
    ↓
    Navigate to /recipes/[id]
    ↓
    @modal/[id]/page.tsx loaded
    ↓
    Modal layout renders with backdrop
    ↓
    RecipeModalContent displayed
    ↓
    User clicks close/backdrop
    ↓
    router.back() → /recipes
```

---

## 🎬 Animation Details

### Modal Entrance
```
Initial:  opacity: 0, scale: 0.95, y: 20
Animate:  opacity: 1, scale: 1,    y: 0
Duration: Spring (damping: 25, stiffness: 300)
```

### Backdrop
```
Initial:  opacity: 0
Animate:  opacity: 1
Duration: Instant
```

### Exit Animation
Returns to initial state with same spring timing

---

## 🌐 URL Routing

| URL | Component | View |
|-----|-----------|------|
| `/recipes` | RecipesPage | Grid of recipe cards |
| `/recipes/1` | @modal/[id]/page | Modal with recipe #1 |
| `/recipes/2` | @modal/[id]/page | Modal with recipe #2 |
| Click close | router.back() | Returns to `/recipes` |

---

## 🎨 Responsive Design

### Mobile
- Full-width card layout (1 column)
- Modal takes 95% of viewport with padding
- Single-column modal (image above, details below)
- Bottom action bar visible

### Tablet (md: 768px+)
- 2-column card grid
- Modal with side-by-side layout
- Better spacing

### Desktop (lg: 1024px+)
- 3-column card grid
- Full modal with max-w-5xl
- Optimized spacing and fonts

---

## 🌙 Dark Mode Support

All components have dark mode variants:
- `dark:bg-neutral-900` for backgrounds
- `dark:text-white` for text
- `dark:border-gray-800` for borders
- Color adjustments for all UI elements

---

## 🔌 Integration with API

### Current Setup (Mock Data)
```typescript
const MOCK_RECIPES: Record<string, RecipeModalData> = {
  "1": { /* ... */ },
  "2": { /* ... */ },
};
```

### Replace with Real API
```typescript
export default async function RecipeModal() {
  const params = await params();
  const recipeId = params.id as string;
  
  const response = await fetch(`/api/recipes/${recipeId}`);
  const recipe = await response.json();
  
  return <RecipeModalContent recipe={recipe} />;
}
```

---

## 🎯 Interaction Handlers

### Like Button
```typescript
const handleLike = () => {
  setLiked(!liked);
  setLikes(liked ? likes - 1 : likes + 1);
  // API call: POST /api/recipes/{id}/like
};
```

### Save Button
```typescript
const [saved, setSaved] = useState(false);
// API call: POST /api/recipes/{id}/save
```

### Navigation Arrows
```typescript
onClick={() => router.push(`/recipes/${nextRecipeId}`)}
```

---

## 📊 Data Structure

```typescript
interface RecipeModalData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  
  author: {
    id: string;
    name: string;
    avatar?: string;
    level?: number;
  };
  
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  cookingTime?: number;
  servings?: number;
  ingredients: string[];
  steps: string[];
  
  likes?: number;
  comments?: number;
  category?: string;
  rating?: number;
  tokensEarned?: number;
}
```

---

## 🛠️ Customization

### Change Modal Width
In `@modal/layout.tsx`:
```tsx
<div className="pointer-events-auto max-w-5xl w-full">
```
Change `max-w-5xl` to desired width

### Change Animation Speed
In `@modal/layout.tsx`:
```tsx
transition={{ type: "spring", damping: 25, stiffness: 300 }}
```

### Add More Fields
1. Add to `RecipeModalData` interface
2. Update mock data or API
3. Add display section in `RecipeModalContent`

### Customize Colors
Edit badge colors in `RecipeModalContent`:
```tsx
const getDifficultyColor = (difficulty?: string) => {
  // Modify colors here
};
```

---

## 🎓 Usage Examples

### Basic Integration
```tsx
// Already integrated in /recipes page
<RecipeCard
  id="1"
  title="Sushi Roll"
  imageUrl="..."
  author={{ name: "Dima Fomin" }}
/>
```

### Adding to Other Pages
```tsx
import { RecipeCard } from '@/components/recipes/RecipeCard';

export function MyPage() {
  return (
    <RecipeCard
      id="recipe-1"
      title="My Recipe"
      imageUrl="https://..."
      author={{ name: "Author Name" }}
    />
  );
}
```

### Custom Modal Content
```tsx
import { RecipeModalContent } from '@/components/recipes/RecipeModalContent';

const myRecipe = { /* ... */ };

<RecipeModalContent recipe={myRecipe} />
```

---

## 🔍 Key Implementation Details

### Parallel Routes (`@modal`)
- Next.js 16+ feature for modals without full page navigation
- Layout renders both main content and modal slot
- Modal and main page can be updated independently

### Server Components
- `layout.tsx` files use server rendering
- `page.tsx` files marked with `"use client"` for interactivity

### Framer Motion
- AnimatePresence required for exit animations
- Spring physics for natural motion
- Staggered children for grid animations

### Event Handling
- Click outside handled via backdrop button
- Navigation via router.push (soft navigation)
- Prevents card click propagation with event.preventDefault()

---

## 📝 Testing Checklist

✅ Modal opens when clicking recipe card
✅ Modal closes on backdrop click
✅ Modal closes on close button click
✅ URL updates to `/recipes/[id]` when modal opens
✅ URL returns to `/recipes` when modal closes
✅ Like/Save buttons work and update state
✅ Navigation arrows work (if available)
✅ Smooth animations play
✅ Modal is responsive on mobile
✅ Dark mode colors display correctly
✅ All text is readable
✅ Images load correctly

---

## 🐛 Troubleshooting

### Modal Not Opening
- Check that `@modal` folder structure is correct
- Verify `layout.tsx` in `app/recipes/` exports modal slot
- Check browser console for routing errors

### Animations Not Playing
- Verify Framer Motion is installed: `npm list framer-motion`
- Check that `AnimatePresence` wraps modal content
- Ensure `exit` prop is set on motion components

### Styling Issues
- Verify Tailwind CSS is configured correctly
- Check `dark:` prefixes for dark mode
- Ensure parent elements have correct padding/margin

### Image Not Loading
- Check imageUrl is valid and accessible
- Test URL in browser directly
- Add fallback image or error state

---

## 🚀 Performance Optimization

### Image Optimization
```tsx
// Use Next.js Image component
import Image from 'next/image';

<Image
  src={recipe.imageUrl}
  alt={recipe.title}
  width={800}
  height={600}
  priority
/>
```

### Lazy Loading
```tsx
// Recipes grid can use lazy loading
{recipes.map(recipe => (
  <RecipeCard key={recipe.id} {...recipe} />
))}
```

### Code Splitting
- Parallel routes naturally code-split modal
- Main recipes page loads faster
- Modal loads on demand

---

## 📚 Related Features

- **Profile Edit**: Uses Sliding Sheet (different pattern)
- **Navigation**: Uses NavigationBurger (persistent component)
- **Themes**: Uses CSS Variables and ThemeProvider

---

**Status**: ✅ Production Ready
**Last Updated**: 16 ноября 2025
**Version**: 1.0
