# 🎨 UNIFIED STYLE GUIDE

## Мета
Привести всі сторінки до єдиного візуального стилю на основі `/app/academy/create/page.tsx` (найновіша, найчистіша)

## 📐 Єдині стандарти

### 1. Page Wrapper
```tsx
<div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
```

### 2. Sticky Header (з кнопкою назад)
```tsx
<div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
  <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
    <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors">
      <ArrowLeft className="w-5 h-5" />
      <span className="font-medium">Назад</span>
    </button>
    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Page Title</h1>
    <div className="w-20" /> {/* Spacer for centering */}
  </div>
</div>
```

### 3. Main Container
```tsx
<div className="max-w-4xl mx-auto px-4 py-8">
  {/* Content */}
</div>
```

### 4. Typography
- **Page Title**: `text-3xl md:text-4xl font-bold text-gray-900 dark:text-white`
- **Section Title**: `text-2xl font-bold text-gray-900 dark:text-white`
- **Card Title**: `text-lg font-bold text-gray-900 dark:text-white`
- **Label**: `text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2`
- **Body**: `text-gray-700 dark:text-gray-300`
- **Subtitle**: `text-gray-600 dark:text-gray-400`

### 5. Cards
```tsx
// Base card
<div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">

// Gradient card (для AI/special features)
<div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800 p-6">

// Info card
<div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
```

### 6. Buttons
```tsx
// Primary
<button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl">

// Primary Gradient
<button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg">

// Secondary/Outline
<button className="px-4 py-2 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 dark:border-purple-400 dark:text-purple-400 rounded-xl">

// Ghost
<button className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
```

### 7. Inputs
```tsx
<input className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl focus:border-purple-400 dark:focus:border-purple-600 focus:outline-none" />

<textarea className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl focus:border-purple-400 focus:outline-none resize-none" />

<select className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl focus:border-purple-400 focus:outline-none">
```

### 8. Badges/Pills
```tsx
<span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium rounded-full">
<span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium rounded-full">
<span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-sm font-medium rounded-full">
```

### 9. Loading States
```tsx
<div className="flex min-h-screen items-center justify-center">
  <div className="text-center">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto mb-4" />
    <p className="text-gray-600 dark:text-gray-400">Завантаження...</p>
  </div>
</div>
```

### 10. Empty States
```tsx
<div className="text-center py-8 text-gray-400 dark:text-gray-600 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
  <Icon className="w-12 h-12 mx-auto mb-3" />
  <p className="text-sm">Empty state text</p>
</div>
```

### 11. Icon Labels (з іконкою)
```tsx
<label className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
  <Icon className="w-4 h-4 text-purple-600" />
  Label text
</label>
```

### 12. Grid Layouts
```tsx
// 2 columns
<div className="grid grid-cols-2 gap-4">

// 3 columns
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

// Responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
```

## 🎯 Priority Pages to Update

1. ✅ `/academy/create` - Reference implementation (already done)
2. ⏳ `/academy/community` - High traffic
3. ⏳ `/profile` - User facing
4. ⏳ `/fridge` - Core feature
5. ⏳ `/market` - Core feature
6. ⏳ `/recipes` - High traffic
7. ⏳ `/academy/leaderboard`
8. ⏳ `/academy/courses`

## 🚫 What to Avoid

- ❌ Sky colors (`sky-500`, `sky-600`) → Use `purple-600`
- ❌ Random colors (`red-500` for primary button) → Use `purple-600`
- ❌ Inconsistent border radius (`rounded-lg` vs `rounded-xl` vs `rounded-2xl`) → Use `rounded-xl` for buttons/inputs, `rounded-2xl` for cards
- ❌ Different shadow sizes → Use `shadow-sm` for cards, `shadow-lg` for buttons
- ❌ Inconsistent padding → Use `p-4` for small cards, `p-6` for regular cards
- ❌ Mixed spacing → Use `gap-4` or `gap-6` consistently
- ❌ No dark mode support → Always add dark: variants

## 📝 Implementation Checklist

For each page:
- [ ] Update page wrapper to gradient background
- [ ] Add sticky header with back button
- [ ] Standardize container width (`max-w-4xl` or `max-w-7xl`)
- [ ] Update all buttons to purple theme
- [ ] Update all inputs to consistent style
- [ ] Add dark mode variants to all elements
- [ ] Use `rounded-xl` for inputs/buttons, `rounded-2xl` for cards
- [ ] Add proper loading states
- [ ] Add proper empty states
- [ ] Test on mobile (responsive)
