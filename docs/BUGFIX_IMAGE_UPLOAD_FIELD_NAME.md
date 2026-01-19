# 🐛 Bugfix: Image Upload Field Name Mismatch

**Date:** 2026-01-19  
**Status:** ✅ Fixed  
**Issue:** Backend returned "400 File is required" despite file being sent

---

## Problem

Frontend was sending file under key `"image"`, but backend expects key `"file"`.

### Evidence from logs:

```javascript
📦 [FormData] Contents:
  image: File(...png)
```

Backend response:
```json
{"error":"File is required"}
```

### Root cause:

```go
// Backend code (Go)
file, header, err := r.FormFile("file") // ← expects "file"
```

But frontend was sending:
```javascript
formData.append("image", imageFile); // ❌ Wrong key
```

---

## Solution

Changed **all** FormData appends from `"image"` to `"file"`:

### Files changed:

1. ✅ `components/admin/recipes/CreateRecipeWithAI.tsx`
   ```javascript
   - formData.append("image", imageFile);
   + formData.append("file", imageFile); // ✅ Backend expects "file"
   ```

2. ✅ `components/admin/catalog/recipes/RecipeImageUpload.tsx`
   ```javascript
   - formData.append("image", file);
   + formData.append("file", file); // ✅ Backend expects "file"
   ```

3. ✅ `app/api/admin/recipes/[id]/image/route.ts`
   ```javascript
   - backendFormData.append("image", imageFile);
   + backendFormData.append("file", imageFile); // ✅ Backend expects "file"
   ```

4. ✅ `lib/api/upload.ts`
   ```javascript
   - formData.append("image", file);
   + formData.append("file", file); // ✅ Backend expects "file"
   ```

---

## Additional fixes

### No manual Content-Type header

✅ **Correct** (browser adds `multipart/form-data` with boundary automatically):
```javascript
headers: {
  Authorization: `Bearer ${token}`,
}
```

❌ **Wrong** (breaks multipart parsing):
```javascript
headers: {
  "Content-Type": "multipart/form-data", // ❌ Don't set manually!
  Authorization: `Bearer ${token}`,
}
```

---

## Testing

After fix, logs should show:
```javascript
📦 [FormData] Contents:
  file: File(recipe.png, 123456b)
```

Backend should respond:
```json
{
  "success": true,
  "imageUrl": "https://res.cloudinary.com/...",
  "imagePublicId": "recipes/..."
}
```

---

## Prevention

Created constant for future use:
```javascript
const RECIPE_IMAGE_FIELD = "file";
formData.append(RECIPE_IMAGE_FIELD, imageFile);
```

Consider adding to `lib/constants/api.ts`:
```typescript
export const API_FORM_FIELDS = {
  RECIPE_IMAGE: "file",
  AVATAR: "file",
  // ... other upload fields
} as const;
```

---

## Related

- Backend endpoint: `POST /api/admin/recipes/{id}/image`
- Backend expects: `multipart/form-data` with field `"file"`
- Max size: 5MB
- Allowed types: JPEG, PNG, WEBP
- Cloudinary: Enabled, auto-converts to WebP
