# 🎯 Phase 2: Feed/Community Merge

**Time:** 4-5 hours  
**Status:** In Progress  
**Priority:** 🔴 HIGH

---

## 📋 Quick Summary

**Problem:** 2 duplicate pages with 80% overlapping functionality  
**Solution:** Merge into single `/academy/community` with tabs  
**Impact:** -256 lines of code, unified UX, single data flow

---

## 🏗️ Architecture

### Canonical Page
```
✅ KEEP:   /academy/community (canonical)
❌ DELETE: /academy/feed (redirect only)
```

### New Structure
```
/academy/community/
├── page.tsx                    (main page with tabs)
└── components/
    ├── CommunityTabs.tsx      (tab navigation)
    ├── FeedTab.tsx            (recipe posts)
    ├── DiscussionsTab.tsx     (community discussions)
    └── AnnouncementsTab.tsx   (optional: admin announcements)
```

### URL Logic
```
/academy/community              → default (feed tab)
/academy/community?tab=feed     → recipe posts
/academy/community?tab=discussions → community discussions
```

---

## 📝 Implementation Steps

### Step 1: Read Current Pages (30 min)
```bash
# Files to analyze:
✅ app/academy/feed/page.tsx       (256 lines)
✅ app/academy/community/page.tsx  (322 lines)
```

**Goal:** Understand data structures, hooks, components

---

### Step 2: Extract Shared Components (1 hour)

#### 2.1 Create RecipePostCard
```typescript
// components/academy/RecipePostCard.tsx
interface RecipePostCardProps {
  post: RecipePost;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  showAuthor?: boolean;
}
```

**Reused in:**
- Feed tab
- Discussions tab
- Profile page (user posts)

---

#### 2.2 Create CommunityTabs
```typescript
// app/academy/community/components/CommunityTabs.tsx
type CommunityTab = 'feed' | 'discussions';

interface CommunityTabsProps {
  activeTab: CommunityTab;
  onTabChange: (tab: CommunityTab) => void;
}
```

---

#### 2.3 Create FeedTab
```typescript
// app/academy/community/components/FeedTab.tsx
interface FeedTabProps {
  filter: 'all' | 'trending' | 'following';
  searchQuery: string;
}
```

**Features:**
- Recipe posts list
- Filter: All | Trending | Following
- Search bar
- Infinite scroll

---

### Step 3: Refactor Community Page (1.5 hours)

#### 3.1 Update Main Page
```typescript
// app/academy/community/page.tsx
"use client";

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PageLayout from '@/components/layout/PageLayout';
import CommunityTabs from './components/CommunityTabs';
import FeedTab from './components/FeedTab';
import DiscussionsTab from './components/DiscussionsTab';

export default function CommunityPage() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'feed' | 'discussions') || 'feed';
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [filter, setFilter] = useState<'all' | 'trending' | 'following'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <PageLayout
      title="Społeczność"
      description="Odkryj przepisy i dyskusje społeczności"
      showScrollProgress
    >
      <div className="max-w-5xl mx-auto">
        {/* Tabs */}
        <CommunityTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Filter Bar (only for feed) */}
        {activeTab === 'feed' && (
          <FeedFilterBar
            filter={filter}
            onFilterChange={setFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {/* Content */}
        {activeTab === 'feed' ? (
          <FeedTab filter={filter} searchQuery={searchQuery} />
        ) : (
          <DiscussionsTab />
        )}
      </div>
    </PageLayout>
  );
}
```

**Size:** ~150 lines (down from 322)

---

#### 3.2 Shared Data Hook
```typescript
// hooks/useCommunityPosts.ts
export function useCommunityPosts(filter: 'all' | 'trending' | 'following') {
  const [posts, setPosts] = useState<RecipePost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts(filter).then(setPosts).finally(() => setLoading(false));
  }, [filter]);

  return { posts, loading };
}
```

**Reused in:**
- FeedTab
- DiscussionsTab
- Profile (user posts)

---

### Step 4: Create Redirect (15 min)

```typescript
// app/academy/feed/page.tsx
import { redirect } from 'next/navigation';

/**
 * Feed Page Redirect
 * 
 * This page redirects to the unified community page.
 * Decision: Merge feed + community (25.12.2025)
 * 
 * Old: /academy/feed (separate page)
 * New: /academy/community?tab=feed (unified)
 */

export default function FeedRedirect() {
  // Permanent redirect (301) for SEO
  redirect('/academy/community?tab=feed');
}
```

**Impact:** Old URL `/academy/feed` still works

---

### Step 5: Update Navigation (15 min)

```typescript
// components/NavigationBurger.tsx

// BEFORE:
{
  label: "Feed",
  href: "/academy/feed",
  icon: <Rss className="w-5 h-5" />,
}

// AFTER:
{
  label: "Społeczność",
  href: "/academy/community",
  icon: <Users className="w-5 h-5" />,
  description: "Przepisy i dyskusje"
}
```

---

### Step 6: Clean Up (30 min)

#### Delete Duplicate Code:
- [ ] Remove old `/academy/feed/page.tsx` content (keep only redirect)
- [ ] Remove duplicate RecipePostCard implementations
- [ ] Remove duplicate data fetching logic
- [ ] Update all internal links to `/academy/community`

---

## 📊 Before/After Comparison

### Code Metrics:
```
BEFORE:
- /academy/feed:       256 lines
- /academy/community:  322 lines
- Duplicates:          ~200 lines (RecipePostCard, hooks)
Total:                 778 lines

AFTER:
- /academy/community:  150 lines (page)
- CommunityTabs:       80 lines
- FeedTab:             120 lines
- DiscussionsTab:      100 lines
- RecipePostCard:      150 lines (shared)
- useCommunityPosts:   60 lines (shared)
- Feed redirect:       15 lines
Total:                 675 lines

REDUCTION: -103 lines (-13.2%)
```

### Architecture Benefits:
```
✅ Single source of truth
✅ Reusable components
✅ Unified data flow
✅ Better UX (tabs vs separate pages)
✅ Easier maintenance
```

---

## 🧪 Testing Checklist

### Redirects:
- [ ] `/academy/feed` → `/academy/community?tab=feed` (301)
- [ ] No 404 errors
- [ ] Browser history works correctly

### Tabs:
- [ ] Default tab (feed) loads on `/academy/community`
- [ ] Tab parameter works: `?tab=feed`, `?tab=discussions`
- [ ] Tab switching preserves data
- [ ] URL updates on tab change

### Filters (Feed Tab):
- [ ] All filter shows all posts
- [ ] Trending filter shows trending posts
- [ ] Following filter shows followed users' posts
- [ ] Search works correctly

### Components:
- [ ] RecipePostCard renders correctly
- [ ] Like/comment/share actions work
- [ ] Infinite scroll works
- [ ] Loading states work
- [ ] Empty states work

### Navigation:
- [ ] Navigation link updated
- [ ] Active state works on `/academy/community`
- [ ] Mobile navigation works

---

## 🚨 Potential Issues

### Issue 1: Data Fetching
**Problem:** Feed and Community might fetch from different endpoints  
**Solution:** Create unified `academyApi.getPosts(type: 'feed' | 'discussions')`

### Issue 2: Different Post Types
**Problem:** Recipe posts vs discussion posts have different fields  
**Solution:** Use discriminated union types:
```typescript
type Post = RecipePost | DiscussionPost;
```

### Issue 3: Filter Persistence
**Problem:** Filter resets on tab change  
**Solution:** Store filter in URL params:
```
/academy/community?tab=feed&filter=trending
```

---

## 📁 Files to Create

```
✅ app/academy/community/components/CommunityTabs.tsx
✅ app/academy/community/components/FeedTab.tsx
✅ app/academy/community/components/DiscussionsTab.tsx
✅ app/academy/community/components/FeedFilterBar.tsx
✅ components/academy/RecipePostCard.tsx
✅ hooks/useCommunityPosts.ts
```

---

## 📁 Files to Modify

```
✅ app/academy/community/page.tsx        (refactor)
✅ app/academy/feed/page.tsx             (redirect only)
✅ components/NavigationBurger.tsx       (update link)
```

---

## 📁 Files to Delete (Later)

```
⏳ app/academy/feed/page.tsx (после теста redirect)
⏳ Duplicate RecipePostCard implementations
⏳ Duplicate data hooks
```

---

## ⏱ Time Breakdown

```
Step 1: Read current pages           30 min
Step 2: Extract shared components    60 min
Step 3: Refactor community page      90 min
Step 4: Create redirect              15 min
Step 5: Update navigation            15 min
Step 6: Clean up                     30 min
Testing & validation                 60 min
-------------------------------------------
TOTAL:                              300 min (5 hours)
```

---

## 🎯 Success Criteria

After Phase 2:

✅ **Single community page** with tabs  
✅ **Zero duplicate code** (RecipePostCard, hooks)  
✅ **Unified UX** (consistent design)  
✅ **Working redirect** (/academy/feed → /academy/community)  
✅ **All tests passing**  
✅ **TypeScript errors: 0**  
✅ **Build: SUCCESS**  

---

## 🚀 Next Steps After Phase 2

1. **Phase 3:** Academy create refactor (6-8 hours)
2. **Phase 4:** Apply design system to remaining pages
3. **Phase 5:** Documentation update

---

**Ready to start?** 🔥

**Current Status:** ⏳ Awaiting approval to begin Step 1
