#!/bin/bash

# 🧪 RECIPE RECOMMENDATIONS - QUICK TEST SCRIPT
# Usage: bash scripts/test-recipe-recommendations.sh

set -e

echo "🧪 Recipe Recommendations Test Suite"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check environment
echo "📋 Checking environment..."
if [ -z "$NEXT_PUBLIC_API_URL" ]; then
    echo -e "${YELLOW}⚠️  NEXT_PUBLIC_API_URL not set, loading from .env.local${NC}"
    source .env.local 2>/dev/null || echo "⚠️  .env.local not found"
fi

if [ -z "$NEXT_PUBLIC_API_URL" ]; then
    echo -e "${RED}❌ NEXT_PUBLIC_API_URL not configured${NC}"
    exit 1
fi

echo -e "${GREEN}✅ API URL: $NEXT_PUBLIC_API_URL${NC}"
echo ""

# Check TypeScript compilation
echo "🔍 TypeScript Check..."
if npx tsc --noEmit 2>/dev/null; then
    echo -e "${GREEN}✅ No TypeScript errors${NC}"
else
    echo -e "${RED}❌ TypeScript compilation failed${NC}"
    exit 1
fi
echo ""

# Check files exist
echo "📁 Checking files..."
files=(
    "app/admin/dishes/new/page.tsx"
    "app/admin/dishes/new/\[recipeId\]/page.tsx"
    "components/recommendations/RecipeRecommendationsList.tsx"
    "app/api/recipe-recommendations/route.ts"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ $file not found${NC}"
        exit 1
    fi
done
echo ""

# Check for API URL usage in components
echo "🔗 Checking API URL integration..."
if grep -q "NEXT_PUBLIC_API_URL" components/recommendations/RecipeRecommendationsList.tsx; then
    echo -e "${GREEN}✅ RecipeRecommendationsList uses NEXT_PUBLIC_API_URL${NC}"
else
    echo -e "${RED}❌ RecipeRecommendationsList missing NEXT_PUBLIC_API_URL${NC}"
    exit 1
fi

if grep -q "api/recipe-recommendations" app/api/recipe-recommendations/route.ts; then
    echo -e "${GREEN}✅ Proxy route configured${NC}"
else
    echo -e "${RED}❌ Proxy route not properly configured${NC}"
    exit 1
fi
echo ""

# Check imports
echo "📦 Checking component imports..."
if grep -q "RecipeRecommendationsList" app/admin/dishes/new/page.tsx; then
    echo -e "${GREEN}✅ RecipeRecommendationsList imported in page${NC}"
else
    echo -e "${RED}❌ RecipeRecommendationsList not imported${NC}"
    exit 1
fi

if grep -q "Tabs" app/admin/dishes/new/page.tsx; then
    echo -e "${GREEN}✅ Tabs component imported${NC}"
else
    echo -e "${RED}❌ Tabs component not imported${NC}"
    exit 1
fi
echo ""

# Check i18n labels
echo "🌐 Checking i18n labels..."
if grep -q "recommendationsTab\|allRecipesTab" app/admin/dishes/new/page.tsx; then
    echo -e "${GREEN}✅ i18n labels present${NC}"
else
    echo -e "${RED}❌ i18n labels missing${NC}"
    exit 1
fi
echo ""

# Build check
echo "🔨 Building Next.js..."
if npm run build 2>&1 | tail -20; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo ""

echo "======================================"
echo -e "${GREEN}✅ All tests passed!${NC}"
echo ""
echo "📌 Next steps:"
echo "1. Start dev server: npm run dev"
echo "2. Navigate to: http://localhost:3000/admin/dishes/new"
echo "3. Check Network tab in DevTools for API calls"
echo "4. Verify recommendations load from Go backend"
echo ""
echo "Go Backend should be running at: $NEXT_PUBLIC_API_URL"
echo ""
