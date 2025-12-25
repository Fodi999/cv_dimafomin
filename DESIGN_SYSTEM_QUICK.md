# 🎨 DESIGN SYSTEM QUICK REFERENCE

**Используй это, когда создаёшь новую страницу или компонент.**

---

## 📦 Import Tokens

```tsx
// Design tokens
import { designSystem, colors, spacing, radius, shadows, animations } from "@/lib/design-system";

// Layout containers
import { Container, Section, Card, Grid, AnimatedContainer } from "@/components/layout/Containers";

// Page layout
import { PageLayout, PageHeader, PageGrid } from "@/components/layout/PageLayout";
```

---

## 🎨 Common Colors

```tsx
// Primary (Green)
className="bg-primary text-primary-foreground"

// Sky (Hero, Main page)
className="bg-sky-500 text-white"

// Cyan (Accent)
className="bg-cyan-500 text-white"

// Purple (AI)
className="bg-purple-500 text-white"

// Emerald (Money, Success)
className="bg-emerald-500 text-white"
```

---

## 📏 Common Spacing

```tsx
// Padding
className="p-4"    // 16px - Normal
className="p-6"    // 24px - Cards (main page)
className="p-8"    // 32px - Large cards

// Margin
className="mb-4"   // 16px
className="mb-6"   // 24px
className="mb-8"   // 32px - Section spacing

// Gap
className="gap-4"  // 16px - Grid items
className="gap-6"  // 24px - Cards (main page)
className="gap-8"  // 32px - Sections
```

---

## 🔲 Common Radius

```tsx
className="rounded-lg"   // 16px - Buttons
className="rounded-xl"   // 20px - Cards (main page)
className="rounded-2xl"  // 24px - Large cards
className="rounded-full" // Pills, badges
```

---

## 📝 Typography Scale

```tsx
// Hero (Main page)
className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold"

// Section heading
className="text-4xl sm:text-5xl font-bold"

// Card heading
className="text-2xl sm:text-3xl font-semibold"

// Body
className="text-base sm:text-lg"

// Small
className="text-sm sm:text-base"
```

---

## ⚡ Quick Animations

```tsx
// Fade up (default)
<AnimatedContainer variant="fadeUp" delay={0}>
  {content}
</AnimatedContainer>

// Stagger list
<motion.div variants={animations.staggerContainer} initial="hidden" animate="visible">
  {items.map((item, i) => (
    <motion.div key={i} variants={animations.staggerItem}>
      <Card />
    </motion.div>
  ))}
</motion.div>

// Hover scale
<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
  Click
</motion.button>
```

---

## 🎨 Quick Gradients

```tsx
// Hero gradient (main page)
className="bg-gradient-to-br from-gray-950 via-sky-950 to-cyan-950"

// Text gradient (headings)
className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-300 to-sky-400"

// Button gradient
className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600"

// Glass card
className="bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20"
```

---

## 📦 Page Template

```tsx
export default function MyPage() {
  return (
    <PageLayout
      title="Page Title | Modern Food Academy"
      description="SEO description"
      background="gradient-sky"
    >
      <PageHeader
        title="Page Title"
        description="Page description"
        icon={<Icon className="w-6 h-6" />}
      />

      <Section spacing="lg">
        <Grid cols={3} gap="lg">
          {items.map(item => (
            <Card key={item.id} variant="default" hover={true}>
              {item.content}
            </Card>
          ))}
        </Grid>
      </Section>
    </PageLayout>
  );
}
```

---

## 📦 Hero Section Template

```tsx
<Section
  id="hero"
  background="dark"
  spacing="xl"
  className="min-h-screen flex items-center justify-center"
>
  <Container size="6xl">
    <AnimatedContainer variant="fadeDown">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/20 border border-sky-400/50">
        <Sparkles className="w-5 h-5 text-sky-300" />
        <span className="text-sm font-semibold text-white">Badge Text</span>
      </div>
    </AnimatedContainer>
    
    <AnimatedContainer variant="fadeUp" delay={0.1}>
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mt-6">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-300 to-sky-400">
          Hero
        </span>
        <br />
        <span className="text-white">Title</span>
      </h1>
    </AnimatedContainer>
    
    <AnimatedContainer variant="fadeUp" delay={0.2}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-8 px-8 py-4 rounded-lg bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold"
      >
        Call to Action
      </motion.button>
    </AnimatedContainer>
  </Container>
</Section>
```

---

## 🚫 Never Use

```tsx
// ❌ Inline styles
style={{ color: '#123456' }}

// ❌ Custom colors
className="bg-[#abcdef]"

// ❌ Custom sizes
className="rounded-[18px]"
className="w-[234px]"

// ❌ Custom shadows
className="shadow-[0_4px_12px...]"
```

---

## ✅ Always Use

```tsx
// ✅ Design tokens
import { colors, spacing } from "@/lib/design-system";

// ✅ Shared components
import { Container, Section, Card } from "@/components/layout/Containers";

// ✅ Tailwind classes (matching tokens)
className="bg-sky-500 rounded-xl p-6 shadow-lg"

// ✅ Animations from system
variants={animations.fadeUp}
```

---

**Full docs:** `/DESIGN_SYSTEM.md`  
**Tokens:** `/lib/design-system.ts`  
**Containers:** `/components/layout/Containers.tsx`  
**Reference:** `/app/page.tsx` (Main page)
