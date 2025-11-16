# PurchaseTokenSheet Component

## Overview
`PurchaseTokenSheet` - это боковая панель (side sheet) для покупки ChefTokens. Компонент отображается справа и содержит различные пакеты токенов с разными ценами и скидками.

## Features

### 🎯 Key Features
- **5 Token Packages**: От 50 до 2500 токенов
- **Discount System**: Скидки от 5% до 20% на крупные пакеты
- **Popular Badge**: Отметка "Popular" на самом популярном пакете
- **Price Per Token**: Показывает цену за каждый токен
- **Current Balance Display**: Выводит текущий баланс пользователя
- **Loading State**: Показывает спиннер при покупке
- **Success Animation**: Зелёная галочка при успешной покупке
- **Error Handling**: Отображает ошибки с подробным сообщением
- **Info Section**: Информация о гарантиях и сроках
- **FAQ Section**: Часто задаваемые вопросы

### 📦 Token Packages

| ID | Tokens | Price | Discount | Popular |
|----|----|----|----|---|
| starter | 50 | $4.99 | - | ❌ |
| basic | 150 | $12.99 | 5% | ✅ |
| pro | 400 | $29.99 | 10% | ❌ |
| elite | 1000 | $69.99 | 15% | ❌ |
| mega | 2500 | $149.99 | 20% | ❌ |

## Component Props

```typescript
interface PurchaseTokenSheetProps {
  // Controls visibility
  isOpen: boolean;
  
  // Close handler
  onClose: () => void;
  
  // Purchase handler (called when user selects a package)
  onPurchase?: (packageId: string, tokens: number, price: number) => Promise<void>;
  
  // Current token balance (optional, defaults to 0)
  currentBalance?: number;
}
```

## Usage

### Basic Example
```tsx
import { PurchaseTokenSheet } from "@/components/wallet/PurchaseTokenSheet";
import { useState } from "react";

export function MyComponent() {
  const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);

  const handlePurchase = async (packageId: string, tokens: number, price: number) => {
    console.log(`Purchasing: ${packageId} for $${price} (${tokens} tokens)`);
    // Call API to process payment
    await apiClient.post("/api/wallet/purchase", { packageId, tokens, price });
  };

  return (
    <>
      <button onClick={() => setIsPurchaseOpen(true)}>
        💰 Buy Tokens
      </button>

      <PurchaseTokenSheet
        isOpen={isPurchaseOpen}
        onClose={() => setIsPurchaseOpen(false)}
        currentBalance={5000}
        onPurchase={handlePurchase}
      />
    </>
  );
}
```

### In Profile View
```tsx
// In ProfileView.tsx
const [isPurchaseOpen, setIsPurchaseOpen] = useState(false);

<PurchaseTokenSheet
  isOpen={isPurchaseOpen}
  onClose={() => setIsPurchaseOpen(false)}
  currentBalance={user?.chefTokens || 0}
  onPurchase={async (packageId, tokens, price) => {
    console.log(`Purchasing: ${packageId}`);
    // Implement payment logic
    await processPayment(packageId, tokens, price);
  }}
/>
```

## UI Layout

### Header Section
- Title: "💰 Kup ChefTokens"
- Close button (X icon)
- Sticky background (stays visible when scrolling)

### Current Balance Card
- Shows user's current ChefTokens balance
- Green/cyan gradient styling
- "ChefTokens dostępne" label

### Token Packages Section
- 5 interactive buttons/cards
- Each package shows:
  - Token amount
  - "Popular" badge (for popular package)
  - Description (dla początkujących, itp.)
  - Price in USD
  - Discount badge (if applicable)
  - Price per token
  - Action indicator (arrow or spinner)

### Error State
- Red alert box with icon
- Error title: "Błąd zakupu"
- Detailed error message

### Info Section
- ✓ Tokeny dostępne natychmiast
- ✓ Bezpieczna płatność przez Stripe
- ✓ Tokeny nigdy nie wygasają
- ✓ Zwrot gwarancja w ciągu 24h

### FAQ Section
- "Gdzie są moje tokeny?" - Pojawiają się natychmiast
- "Czy mogę je zwrócić?" - Zwrot w 24h bez pytań
- "Jaki jest maksymalny limit?" - 100,000 max

### Terms Section
- Link to terms of service
- Security notice

## Language Support

Component is fully translated to Polish (PL):
- Headers and labels in Polish
- Info section in Polish
- FAQ in Polish
- Descriptions in Polish

## Styling

### Colors
- Primary gradient: Sky to Cyan
- Background: White (light) / Dark neutral (dark mode)
- Borders: Gray 200 (light) / Gray 800 (dark)
- Success: Green
- Error: Red

### Animations
- **Entry/Exit**: Spring animation (x: 100% → 0%)
- **Backdrop fade**: Smooth opacity transition
- **Package hover**: Scale 1.02, shadow increase
- **Package tap**: Scale 0.98
- **Spinner**: CSS animation on loader
- **Error message**: Fade and slide in

### Responsive
- Fixed right side on desktop
- Max width: 448px (max-w-md)
- Full height scrollable content
- Responsive padding (px-6)

## States

### Idle State
- All packages available to click
- Arrow indicator on hover
- No loading spinner

### Loading State
- Selected package shows loading spinner
- Button disabled (opacity-50)
- Cannot click other packages

### Success State
- Green checkmark appears
- Auto-closes after 2 seconds
- Resets state

### Error State
- Red alert box appears
- Shows error message
- Can retry purchase
- Error persists until user closes or retries

## Animation Details

### Backdrop
```tsx
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
```

### Side Sheet
```tsx
initial={{ x: "100%" }}
animate={{ x: 0 }}
exit={{ x: "100%" }}
transition={{ type: "spring", damping: 30, stiffness: 300 }}
```

### Package Buttons
```tsx
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}
```

### Error Message
```tsx
initial={{ opacity: 0, y: -10 }}
animate={{ opacity: 1, y: 0 }}
```

## Integration with Profile

The component is integrated into the profile view:

1. **ProfileView.tsx**
   - Manages `isPurchaseOpen` state
   - Renders `PurchaseTokenSheet`

2. **OverviewSection.tsx**
   - Receives `onPurchaseTokensOpen` callback
   - Passes to `WalletSummary`

3. **WalletSummary.tsx**
   - "Пополнить баланс" button calls `onPurchaseClick`
   - Opens the purchase sheet

## Payment Integration

To implement real payments, replace the mock handler in ProfileView:

```tsx
onPurchase={async (packageId, tokens, price) => {
  // Call your payment API
  const response = await fetch("/api/wallet/purchase", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ packageId, tokens, price }),
  });
  
  if (!response.ok) {
    throw new Error("Payment failed");
  }
  
  // Update user balance
  await updateUserBalance(tokens);
}}
```

## Accessibility

- Close button disabled during loading
- Semantic HTML structure
- Color contrast meets WCAG standards
- Focus management with modal backdrop
- Keyboard support via close button

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support (responsive layout)

## Dependencies

- `framer-motion`: Animations
- `lucide-react`: Icons (X, Loader2, CheckCircle, AlertCircle)
- `@/contexts/LanguageContext`: Polish translations

## Notes

- Component is fully Polish (PL) language
- Uses Stripe for secure payments (reference in UI)
- 24-hour refund guarantee mentioned
- Maximum balance limit of 100,000 tokens
- Tokens never expire
