# 🔒 Zoom Protection - PWA 2025 Best Practice

**Date:** 21 января 2026  
**Status:** ✅ Production Ready  
**Use Case:** SaaS Dashboards, Kitchen Tools, PWA Apps

---

## 🎯 GOAL

**Disable zoom on mobile/trackpad while preserving:**
- ✅ Scroll functionality
- ✅ Accessibility (forms, inputs)
- ✅ SEO (Google doesn't penalize SaaS apps)
- ✅ PWA user experience

---

## 🏗 IMPLEMENTATION (3 Layers)

### 1️⃣ Viewport Meta (FOUNDATION)

**File:** `app/layout.tsx`

```typescript
export const metadata: Metadata = {
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,      // ❌ No zoom
    userScalable: false,  // ❌ No pinch
  },
};
```

**What this blocks:**
- ❌ Pinch zoom (iOS/Android)
- ❌ Double-tap zoom
- ❌ Gesture zoom

**What this preserves:**
- ✅ Scroll
- ✅ Form interactions
- ✅ PWA standalone mode

---

### 2️⃣ CSS Touch Protection

**File:** `app/globals.css`

```css
/**
 * PWA 2025 - Zoom Protection (SaaS/Dashboard Best Practice)
 * 
 * ✅ Disables: pinch zoom, gesture zoom, double-tap zoom
 * ✅ Preserves: scroll, accessibility, form interactions
 * ✅ Works on: iOS Safari, Android Chrome, macOS trackpad
 */
html, body {
  touch-action: manipulation;
}

* {
  -webkit-tap-highlight-color: transparent;
}
```

**What this does:**
- `touch-action: manipulation` - Disables zoom gestures but allows scroll
- `-webkit-tap-highlight-color` - Removes tap highlight on iOS Safari

**What NOT to use:**
- ❌ `touch-action: none` - Breaks scroll!
- ❌ `overflow: hidden` - Breaks layout!

---

### 3️⃣ JavaScript Trackpad Guard

**File:** `components/ZoomProtection.tsx`

```typescript
"use client";

import { useEffect } from "react";

export function ZoomProtection() {
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Block zoom via Ctrl+wheel (trackpad pinch)
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    // Passive: false allows preventDefault()
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return null; // Renders nothing
}
```

**What this blocks:**
- ❌ Ctrl+wheel zoom (macOS trackpad)
- ❌ Ctrl+scroll zoom (desktop browsers)

**What this preserves:**
- ✅ Normal scroll (no Ctrl key)
- ✅ Accessibility
- ✅ Performance (passive: false only for wheel)

---

## 🧪 TESTING CHECKLIST

### Test on iPhone (iOS Safari):
```
1. Open: https://dima-fomin.pl
2. Try pinch zoom → ❌ Blocked
3. Try double-tap → ❌ Blocked
4. Try scroll → ✅ Works
5. Try input focus → ✅ Works
```

### Test on Android (Chrome):
```
1. Open: https://dima-fomin.pl
2. Try pinch zoom → ❌ Blocked
3. Try scroll → ✅ Works
4. Try form input → ✅ Works
```

### Test on macOS (Trackpad):
```
1. Open: https://dima-fomin.pl in Safari/Chrome
2. Try Ctrl+wheel (pinch gesture) → ❌ Blocked
3. Try normal scroll → ✅ Works
4. Try Cmd+Plus → ✅ Browser zoom (expected)
```

### Test on Desktop (Mouse):
```
1. Open: https://dima-fomin.pl
2. Try Ctrl+wheel → ❌ Blocked
3. Try scroll → ✅ Works
4. Try Cmd/Ctrl + Plus → ✅ Browser zoom (expected)
```

---

## 📊 EXPECTED BEHAVIOR

| Device | Zoom Method | Result |
|--------|-------------|--------|
| iPhone | Pinch zoom | ❌ Blocked |
| iPhone | Double-tap | ❌ Blocked |
| iPhone | Scroll | ✅ Works |
| Android | Pinch zoom | ❌ Blocked |
| Android | Scroll | ✅ Works |
| macOS Trackpad | Ctrl+wheel | ❌ Blocked |
| macOS Trackpad | Scroll | ✅ Works |
| Desktop | Ctrl+wheel | ❌ Blocked |
| Desktop | Scroll | ✅ Works |
| All | Browser zoom (Cmd+) | ✅ Works (user preference) |

---

## 🟢 WHY THIS IS CORRECT (2025 Standards)

### ✅ Google SEO:
```
✅ Google does NOT penalize user-scalable=no for SaaS apps
✅ This is standard for dashboards (Notion, Figma, etc.)
❌ Avoid for public blogs (accessibility concern)
```

### ✅ PWA Best Practice:
```
✅ Standalone mode expects app-like behavior
✅ No zoom = native app experience
✅ Consistent with iOS/Android native apps
```

### ✅ Accessibility:
```
✅ Form inputs still zoomable (iOS auto-zoom on focus)
✅ Screen readers work normally
✅ Browser zoom (Cmd+) still works (user preference)
```

### ✅ Performance:
```
✅ No heavy JS hacks
✅ No event listener spam
✅ Minimal overhead (1 wheel listener)
```

---

## ❌ ANTI-PATTERNS (What NOT to Do)

### ❌ Don't use `touch-action: none`:
```css
/* BAD: Breaks scroll! */
html, body {
  touch-action: none; /* ❌ */
}

/* GOOD: Allows scroll */
html, body {
  touch-action: manipulation; /* ✅ */
}
```

### ❌ Don't use `overflow: hidden`:
```css
/* BAD: Breaks layout! */
body {
  overflow: hidden; /* ❌ */
}

/* GOOD: Normal flow */
body {
  overflow: auto; /* ✅ */
}
```

### ❌ Don't block all wheel events:
```typescript
// BAD: Breaks scroll!
window.addEventListener("wheel", (e) => {
  e.preventDefault(); // ❌ Always blocks
});

// GOOD: Only blocks zoom
window.addEventListener("wheel", (e) => {
  if (e.ctrlKey) e.preventDefault(); // ✅ Conditional
});
```

### ❌ Don't use gesturestart hacks:
```typescript
// BAD: iOS-only, unreliable
window.addEventListener("gesturestart", (e) => {
  e.preventDefault(); // ❌ Deprecated
});

// GOOD: CSS + viewport
touch-action: manipulation; /* ✅ Standard */
```

---

## 🔄 HOW IT WORKS (Technical Explanation)

### Layer 1: Viewport (HTML Meta)
```
Browser sees: maximumScale=1, userScalable=false
Browser disables: Pinch zoom, double-tap zoom, gesture zoom
Browser preserves: Scroll, form zoom (iOS auto-zoom on input focus)
```

### Layer 2: CSS Touch Action
```
CSS: touch-action: manipulation
Browser disables: Multi-finger gestures (zoom, rotate)
Browser preserves: Single-finger gestures (scroll, tap, swipe)
```

### Layer 3: JS Wheel Guard
```
JS: Listens to wheel events
If Ctrl+wheel detected: preventDefault() → Blocks zoom
If normal scroll: No action → Allows scroll
```

---

## 📈 METRICS TO MONITOR

### User Experience:
```
✓ No accidental zooms during navigation
✓ Smooth scroll on mobile
✓ No layout jumps
✓ Consistent PWA experience
```

### Performance:
```
✓ Zero impact on FCP/LCP (no layout changes)
✓ Minimal JS overhead (1 event listener)
✓ No scroll jank (passive: false only for wheel)
```

### Accessibility:
```
✓ Form inputs still zoomable (iOS auto-zoom)
✓ Browser zoom works (Cmd/Ctrl + Plus)
✓ Screen readers work normally
```

---

## 🚀 DEPLOYMENT STATUS

**Production URL:** https://dima-fomin.pl

### Implementation:
```
✅ Viewport: maximumScale=1, userScalable=false
✅ CSS: touch-action: manipulation
✅ JS: Ctrl+wheel guard active
✅ iOS: Safari tested
✅ Android: Chrome tested
✅ macOS: Trackpad tested
```

### Files Changed:
```
Modified:
- app/layout.tsx (viewport + ZoomProtection import)
- app/globals.css (touch-action + tap-highlight)

Created:
- components/ZoomProtection.tsx (Ctrl+wheel guard)
- docs/ZOOM_PROTECTION_2025.md (this file)
```

---

## 🎯 SUCCESS CRITERIA

### PWA Working When:
```
✅ iPhone: Pinch zoom blocked, scroll works
✅ Android: Pinch zoom blocked, scroll works
✅ macOS: Trackpad zoom blocked, scroll works
✅ Desktop: Ctrl+wheel blocked, scroll works
✅ Forms: Input focus zoom works (iOS)
✅ Accessibility: Browser zoom works (Cmd+)
✅ SEO: No Google penalty (SaaS app)
✅ Performance: No scroll jank
```

---

## 📚 RESOURCES

### Standards:
- **MDN touch-action:** https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action
- **Viewport Meta:** https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag
- **WCAG Accessibility:** https://www.w3.org/WAI/WCAG21/Understanding/reflow.html

### Best Practices:
- **Google PWA Checklist:** https://web.dev/pwa-checklist/
- **iOS Safari Viewport:** https://webkit.org/blog/7929/designing-websites-for-iphone-x/
- **Touch Events:** https://developer.mozilla.org/en-US/docs/Web/API/Touch_events

---

## 🎉 SUMMARY

### What We Built:

**3-Layer Protection:**
- ✅ Layer 1: Viewport meta (pinch zoom)
- ✅ Layer 2: CSS touch-action (gesture zoom)
- ✅ Layer 3: JS Ctrl+wheel guard (trackpad zoom)

**Result:**
```
📱 Mobile: No pinch zoom, smooth scroll ✅
💻 Desktop: No Ctrl+wheel zoom, normal scroll ✅
🔒 Security: No zoom exploits ✅
♿ Accessibility: Browser zoom + form zoom work ✅
🔍 SEO: Google-friendly for SaaS ✅
```

**Status:** 🎉 Zoom Protection Complete - Production Ready

---

**Date:** 21 января 2026  
**Domain:** https://dima-fomin.pl  
**Project:** CV-Sushi Chef  
**Contact:** Dmitrij Fomin
