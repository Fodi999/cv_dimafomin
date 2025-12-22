# Sonner Toast Quick Reference

## 📦 Installation
```bash
npx shadcn@latest add sonner
```

## 🚀 Basic Usage

### 1. Import
```typescript
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
```

### 2. Add Toaster to Component
```tsx
export default function MyComponent() {
  return (
    <div>
      {/* Your content */}
      
      <Toaster richColors position="top-center" />
    </div>
  );
}
```

### 3. Show Toast
```typescript
// Simple info toast (auto-closes)
toast.info("Message");

// With description
toast.success("Title", {
  description: "Additional info",
});

// Persistent toast with actions (requiresUserAction scenario)
toast.info("No recipes found", {
  duration: Infinity, // Never auto-close
  description: "💡 Add more ingredients",
  action: {
    label: "Add Products",
    onClick: () => router.push('/fridge'),
  },
  cancel: {
    label: "Close",
    onClick: () => {}, // Just dismiss
  },
});
```

## 🎨 Toast Types

```typescript
toast.success("Success!");
toast.error("Error!");
toast.warning("Warning!");
toast.info("Info!");
toast.loading("Loading...");
```

## ⚙️ Options

```typescript
toast("Message", {
  duration: 5000,           // Auto-close after 5s (default: 4000)
  duration: Infinity,       // Never auto-close
  position: "top-center",   // Position on screen
  description: "Details",   // Secondary text
  icon: <Icon />,          // Custom icon
  action: {                // Primary action button
    label: "Action",
    onClick: () => {},
  },
  cancel: {                // Cancel button
    label: "Cancel",
    onClick: () => {},
  },
});
```

## 🎯 When to Use Sonner vs Existing Toast

### Use Sonner When:
✅ `requiresUserAction = true` from backend  
✅ Need action buttons  
✅ Message must not auto-close  
✅ Modern design preferred  

### Use Existing Toast When:
✅ Simple notifications  
✅ Already using in codebase  
✅ No action buttons needed  

## 📍 Positions
- `top-left`
- `top-center` ← Recommended for important messages
- `top-right`
- `bottom-left`
- `bottom-center`
- `bottom-right`

## 🎨 Toaster Props
```tsx
<Toaster
  richColors        // Enable colored icons
  position="top-center"
  expand={false}    // Don't expand all toasts
  closeButton       // Show close button on all toasts
/>
```

## 🔗 Resources
- [Sonner Documentation](https://sonner.emilkowal.ski/)
- [shadcn/ui Sonner](https://ui.shadcn.com/docs/components/sonner)
