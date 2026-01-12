#!/bin/bash
FILES=(
  "app/api/admin/recipes/route.ts"
  "app/api/admin/recipes/[id]/route.ts"
  "app/api/admin/users/route.ts"
  "app/api/admin/users/stats/route.ts"
  "app/api/admin/stats/route.ts"
  "app/api/user/recipes/saved/route.ts"
  "app/api/user/recipes/saved/[id]/route.ts"
  "app/api/user/recipes/save/route.ts"
  "app/api/recipes/available/route.ts"
  "app/api/recipes/match/route.ts"
  "app/api/recipes/route.ts"
  "app/api/recipes/recommendations/route.ts"
  "app/api/recipes/[id]/route.ts"
  "app/api/recipes/[id]/add-missing-to-fridge/route.ts"
  "app/api/recipes/[id]/cook/route.ts"
  "app/api/ai/create-recipe-from-fridge/route.ts"
  "app/api/ai/recalculate-recipe-economy/route.ts"
  "app/api/fridge/deduct/route.ts"
  "app/api/fridge/add-missing/route.ts"
  "app/api/stats/public/route.ts"
)

for file in "${FILES[@]}"; do
  perl -i -pe 's/const BACKEND_URL = process\.env\.NEXT_PUBLIC_(BACKEND_URL|API_URL|API_BASE)[^;]*/const BACKEND_URL = getBackendUrl()/g' "$file"
  perl -i -pe 's/const API_BASE = process\.env\.NEXT_PUBLIC_API_BASE[^;]*/const BACKEND_URL = getBackendUrl()/g' "$file"
  
  if ! grep -q "from.*backend-url" "$file"; then
    perl -i -pe 's/(import.*from.*next\/server.*;)/$1\nimport { getBackendUrl } from "@\/lib\/api\/backend-url";/' "$file"
  fi
done

echo "Done!"
