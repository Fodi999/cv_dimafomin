# Fridge API Integration - Frontend Ready ✅

## Status: Frontend Implementation Complete

Frontend полностью готов для интеграции с backend fridge API. Все компоненты созданы и протестированы с mock данными.

---

## 🔧 API Endpoints Required

### 1. Search Ingredients (Autocomplete)
```
GET /api/catalog/ingredients/search?query={text}
Authorization: Bearer {token}
Cookie: session_cookie

Response 200:
{
  "data": {
    "count": 3,
    "items": [
      {
        "id": "uuid-123",
        "name": "Mleko",
        "unit": "ml",
        "category": "dairy",
        "defaultShelfLifeDays": 7
      },
      {
        "id": "uuid-456",
        "name": "Mleko kokosowe",
        "unit": "ml",
        "category": "dairy_alternatives",
        "defaultShelfLifeDays": 30
      }
    ]
  }
}

Response 401/403: Authentication failed
Response 500: Server error
```

**Frontend behavior:**
- Debounce: 300ms
- Min query length: 2 characters
- Shows dropdown with name, category, unit
- Keyboard navigation (ArrowUp/Down, Enter, Escape)

---

### 2. Get User's Fridge Items
```
GET /api/fridge/items
Authorization: Bearer {token}
Cookie: session_cookie

Response 200:
{
  "items": [
    {
      "id": "uuid-789",
      "ingredient": {
        "name": "Mleko",
        "category": "dairy"
      },
      "quantity": 1000,
      "unit": "ml",
      "expiresAt": "2025-12-21T12:00:00Z",
      "daysLeft": 7,
      "status": "ok"  // "ok" | "warning" | "critical" | "expired"
    }
  ]
}

Response 401/403: Authentication failed
Response 404: Empty fridge -> return { "items": [] }
```

**Status calculation (backend должен вычислять):**
- `ok` (green): daysLeft >= 3
- `warning` (orange): daysLeft = 1-2
- `critical` (red): daysLeft = 0
- `expired` (gray): daysLeft < 0

**Frontend behavior:**
- Auto-loads on page mount
- Sorts by urgency: expired → critical → warning → ok
- Shows empty state if items = []

---

### 3. Add Item to Fridge
```
POST /api/fridge/items
Authorization: Bearer {token}
Cookie: session_cookie
Content-Type: application/json

Request:
{
  "ingredientId": "uuid-123",
  "quantity": 1000,
  "unit": "ml"
}

Response 201:
{
  "id": "uuid-789",
  "ingredient": {
    "name": "Mleko",
    "category": "dairy"
  },
  "quantity": 1000,
  "unit": "ml",
  "expiresAt": "2025-12-21T12:00:00Z",
  "daysLeft": 7,
  "status": "ok"
}

Response 400: Validation error (missing fields, invalid quantity)
Response 401/403: Authentication failed
Response 404: Ingredient not found
```

**Validation rules:**
- `ingredientId`: required, must exist in catalog
- `quantity`: required, must be > 0
- `unit`: required, string

**Frontend behavior:**
- Validates quantity > 0 before sending
- Auto-fills unit from selected ingredient
- Shows success toast: "✅ Produkt dodany do lodówki!"
- Immediately adds item to UI (optimistic update)

---

### 4. Delete Item from Fridge
```
DELETE /api/fridge/items/{id}
Authorization: Bearer {token}
Cookie: session_cookie

Response 204: No Content (success)
Response 404: Item not found
Response 401/403: Authentication failed
```

**Frontend behavior:**
- Shows confirmation (implicit via immediate UI update)
- Removes from UI immediately (optimistic update)
- Shows success toast: "✅ Produkt usunięty!"
- Animates removal (fade out)

---

## 🔐 Authentication

**Headers Required:**
```
Authorization: Bearer {jwt_token}
Cookie: session_cookie={value}
```

**Current Setup:**
- Frontend sends both Authorization header AND Cookie
- `credentials: 'include'` enabled in all API calls
- Proxy routes forward both headers to backend

**Token Source:**
- localStorage: `token` key
- Set on login via `/api/auth/login`
- Format: JWT string (no "Bearer" prefix in storage)

---

## 📁 Frontend Files Created

### Components:
```
/components/fridge/
├── IngredientAutocomplete.tsx  (183 lines) - Search with keyboard nav
├── FridgeForm.tsx              (168 lines) - Add item form + validation
├── FridgeItem.tsx              (121 lines) - Item card with status colors
└── FridgeList.tsx              (73 lines)  - Sorted list + empty state
```

### API Integration:
```
/lib/api.ts                     - fridgeApi with 4 methods
/lib/types.ts                   - TypeScript interfaces
```

### Proxy Routes:
```
/app/api/fridge/items/route.ts       (GET + POST)
/app/api/fridge/items/[id]/route.ts  (DELETE)
/app/api/catalog/ingredients/search/route.ts (GET)
```

### Main Page:
```
/app/fridge/page.tsx            (157 lines) - Full CRUD interface
```

---

## 🧪 Testing Checklist

### Backend Developer:
- [ ] Implement 4 endpoints above
- [ ] Test with Postman/curl:
  ```bash
  # Get items
  curl -X GET https://your-backend.com/api/fridge/items \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Cookie: session_cookie=YOUR_COOKIE"
  
  # Add item
  curl -X POST https://your-backend.com/api/fridge/items \
    -H "Authorization: Bearer YOUR_TOKEN" \
    -H "Cookie: session_cookie=YOUR_COOKIE" \
    -H "Content-Type: application/json" \
    -d '{"ingredientId":"uuid-123","quantity":1000,"unit":"ml"}'
  ```
- [ ] Verify status calculation logic
- [ ] Test with expired items (daysLeft < 0)
- [ ] Check CORS settings (allow credentials)

### Frontend Developer:
- [ ] Open http://localhost:3000/fridge
- [ ] Check browser console for proxy logs
- [ ] Test autocomplete search
- [ ] Add product and verify status color
- [ ] Delete product and verify removal
- [ ] Check empty state shows when items = []

---

## 🐛 Current Issue (403 Forbidden)

**Error:** Backend returns 403 when accessing `/api/fridge/items`

**Possible Causes:**
1. ❌ Token invalid/expired
2. ❌ Cookie not sent correctly
3. ❌ Backend auth middleware rejecting request
4. ❌ CORS not configured for credentials

**Debug Steps:**
1. Check server logs (terminal with `npm run dev`)
2. Look for lines like:
   ```
   [API Proxy] ========================================
   [API Proxy] GET /api/fridge/items
   [API Proxy] Authorization header received: Bearer eyJhbGc...
   [API Proxy] Backend response status: 403
   ```
3. Verify backend auth middleware accepts both Authorization + Cookie
4. Test with valid token from recent login

**Next Actions:**
1. Reload page at http://localhost:3000/fridge
2. Check browser DevTools → Console for detailed logs
3. Check terminal running `npm run dev` for proxy logs
4. If still 403 → backend needs to implement endpoints or fix auth

---

## 📞 Contact

**Frontend Lead:** Implementation complete ✅  
**Backend Team:** Need to implement 4 endpoints above 🔧

**Questions?**
- Check proxy route logs in terminal
- Review COOKIE_AUTH.md for auth details
- Test with Postman to isolate frontend/backend issues
