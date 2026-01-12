#!/bin/bash

# 🔍 Frontend Production Readiness Audit Script
# Проверяет все критические требования к фронтенду

echo "🔍 Starting Frontend Production Readiness Audit..."
echo "=================================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0
PASSED=0

# Helper functions
check_pass() {
  echo -e "${GREEN}✅ PASS${NC}: $1"
  ((PASSED++))
}

check_warn() {
  echo -e "${YELLOW}⚠️  WARN${NC}: $1"
  ((WARNINGS++))
}

check_fail() {
  echo -e "${RED}❌ FAIL${NC}: $1"
  ((ERRORS++))
}

check_info() {
  echo -e "${BLUE}ℹ️  INFO${NC}: $1"
}

echo "📋 Test 1: Environment Variables"
echo "================================"

# Check .env.production exists
if [ -f .env.production ]; then
  check_pass ".env.production exists"
else
  check_fail ".env.production is missing"
fi

# Check .env.local exists
if [ -f .env.local ]; then
  check_pass ".env.local exists"
else
  check_fail ".env.local is missing"
fi

# Check for NEXT_PUBLIC_API_BASE in .env.local
if grep -q "NEXT_PUBLIC_API_BASE" .env.local 2>/dev/null; then
  check_pass "NEXT_PUBLIC_API_BASE found in .env.local"
else
  check_fail "NEXT_PUBLIC_API_BASE not found in .env.local"
fi

# Check for NEXT_PUBLIC_API_BASE in .env.production
if grep -q "NEXT_PUBLIC_API_BASE" .env.production 2>/dev/null; then
  check_pass "NEXT_PUBLIC_API_BASE found in .env.production"
else
  check_fail "NEXT_PUBLIC_API_BASE not found in .env.production"
fi

echo ""
echo "📋 Test 2: API Route Consistency"
echo "================================"

# Count files with inconsistent env vars
INCONSISTENT_COUNT=$(grep -r "NEXT_PUBLIC_BACKEND_URL\|NEXT_PUBLIC_API_URL" app/api --include="*.ts" 2>/dev/null | wc -l | tr -d ' ')
if [ "$INCONSISTENT_COUNT" -eq 0 ]; then
  check_pass "No inconsistent env variables (NEXT_PUBLIC_BACKEND_URL, NEXT_PUBLIC_API_URL)"
else
  check_fail "Found $INCONSISTENT_COUNT files using inconsistent env variables"
  check_info "Run: grep -r 'NEXT_PUBLIC_BACKEND_URL\\|NEXT_PUBLIC_API_URL' app/api --include='*.ts' -l"
fi

echo ""
echo "📋 Test 3: Error Handling"
echo "================================"

# Count files checking HTTP status instead of error.code
HTTP_STATUS_COUNT=$(grep -r "response\.status.*===.*40[13]\|\.status.*===.*40[13]" components lib src --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | tr -d ' ')
if [ "$HTTP_STATUS_COUNT" -eq 0 ]; then
  check_pass "No HTTP status checks (using error.code instead)"
else
  check_fail "Found $HTTP_STATUS_COUNT files checking response.status === 401/403"
  check_info "Should use error.code === 'UNAUTHORIZED' instead"
  check_info "Run: grep -r 'response\.status.*===.*40[13]' components lib src --include='*.tsx' --include='*.ts' -l"
fi

echo ""
echo "📋 Test 4: Proxy Usage"
echo "================================"

# Check if proxy.ts exists
if [ -f lib/api/proxy.ts ]; then
  check_pass "lib/api/proxy.ts exists"
else
  check_fail "lib/api/proxy.ts is missing"
fi

# Count routes using proxyToBackend
PROXY_USAGE_COUNT=$(grep -r "proxyToBackend" app/api --include="*.ts" 2>/dev/null | wc -l | tr -d ' ')
TOTAL_ROUTES=$(find app/api -name "route.ts" -type f 2>/dev/null | wc -l | tr -d ' ')

if [ "$PROXY_USAGE_COUNT" -eq "$TOTAL_ROUTES" ]; then
  check_pass "All $TOTAL_ROUTES routes use proxyToBackend()"
elif [ "$PROXY_USAGE_COUNT" -gt 0 ]; then
  check_warn "$PROXY_USAGE_COUNT/$TOTAL_ROUTES routes migrated to proxyToBackend()"
  check_info "Still need to migrate $((TOTAL_ROUTES - PROXY_USAGE_COUNT)) routes"
else
  check_fail "No routes using proxyToBackend() yet (0/$TOTAL_ROUTES)"
  check_info "See docs/API_ROUTES_MIGRATION.md for migration guide"
fi

echo ""
echo "📋 Test 5: Error Handler"
echo "================================"

# Check if error-handler.ts exists
if [ -f lib/api/error-handler.ts ]; then
  check_pass "lib/api/error-handler.ts exists"
else
  check_fail "lib/api/error-handler.ts is missing"
fi

# Count usage of handleApiError
ERROR_HANDLER_USAGE=$(grep -r "handleApiError" components app --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l | tr -d ' ')
if [ "$ERROR_HANDLER_USAGE" -gt 0 ]; then
  check_pass "handleApiError() is used in $ERROR_HANDLER_USAGE places"
else
  check_warn "handleApiError() not used yet"
  check_info "Should replace manual error handling with handleApiError()"
fi

echo ""
echo "📋 Test 6: Request IDs"
echo "================================"

# Check if X-Request-ID is generated in proxy
if grep -q "X-Request-ID" lib/api/proxy.ts 2>/dev/null; then
  check_pass "X-Request-ID generation found in proxy.ts"
else
  check_fail "X-Request-ID not found in proxy.ts"
fi

echo ""
echo "📋 Test 7: Autocomplete Protection"
echo "================================"

# Check for AbortController in autocomplete components
AUTOCOMPLETE_FILES=$(find components -name "*Autocomplete.tsx" -type f 2>/dev/null)
ABORT_CONTROLLER_COUNT=0

for file in $AUTOCOMPLETE_FILES; do
  if grep -q "AbortController" "$file" 2>/dev/null; then
    check_pass "$(basename $file) has AbortController"
    ((ABORT_CONTROLLER_COUNT++))
  else
    check_warn "$(basename $file) missing AbortController"
  fi
done

if [ "$ABORT_CONTROLLER_COUNT" -eq 0 ] && [ -n "$AUTOCOMPLETE_FILES" ]; then
  check_fail "No autocomplete components have AbortController"
fi

echo ""
echo "📋 Test 8: Documentation"
echo "================================"

# Check for key documentation files
DOC_FILES=(
  "docs/FRONTEND_PRODUCTION_CHECKLIST.md"
  "docs/API_ROUTES_MIGRATION.md"
  "docs/FRONTEND_SETUP_SUMMARY.md"
  "docs/API_STRUCTURE_MAP.md"
)

for doc in "${DOC_FILES[@]}"; do
  if [ -f "$doc" ]; then
    check_pass "$(basename $doc) exists"
  else
    check_warn "$(basename $doc) is missing"
  fi
done

echo ""
echo "📋 Test 9: Build Verification"
echo "================================"

# Try to build (commented out by default, takes time)
# Uncomment to run full build check
# if npm run build > /dev/null 2>&1; then
#   check_pass "npm run build succeeds"
# else
#   check_fail "npm run build fails"
# fi

check_info "Run 'npm run build' manually to verify build succeeds"

echo ""
echo "=================================================="
echo "📊 Audit Results"
echo "=================================================="
echo ""

TOTAL=$((PASSED + WARNINGS + ERRORS))

echo -e "${GREEN}✅ Passed:${NC}   $PASSED/$TOTAL"
echo -e "${YELLOW}⚠️  Warnings:${NC} $WARNINGS/$TOTAL"
echo -e "${RED}❌ Failed:${NC}   $ERRORS/$TOTAL"
echo ""

# Calculate percentage
if [ "$TOTAL" -gt 0 ]; then
  PERCENTAGE=$((PASSED * 100 / TOTAL))
  echo "Overall Score: $PERCENTAGE%"
  echo ""
fi

# Recommendations
if [ "$ERRORS" -gt 0 ]; then
  echo "🚨 CRITICAL ISSUES FOUND"
  echo "========================"
  echo "You have $ERRORS critical issues that must be fixed before production."
  echo ""
  echo "Priority actions:"
  echo "1. Fix environment variables (NEXT_PUBLIC_API_BASE)"
  echo "2. Replace HTTP status checks with error.code"
  echo "3. Migrate routes to use proxyToBackend()"
  echo ""
  echo "See docs/FRONTEND_PRODUCTION_CHECKLIST.md for details"
  exit 1
elif [ "$WARNINGS" -gt 0 ]; then
  echo "⚠️  WARNINGS FOUND"
  echo "=================="
  echo "You have $WARNINGS warnings. System will work but not optimal."
  echo ""
  echo "Recommended actions:"
  echo "1. Complete route migration to proxyToBackend()"
  echo "2. Add AbortController to all autocomplete components"
  echo "3. Use handleApiError() for consistent error handling"
  echo ""
  echo "See docs/API_ROUTES_MIGRATION.md for migration guide"
  exit 0
else
  echo "✅ ALL CHECKS PASSED"
  echo "===================="
  echo "Your frontend is production-ready!"
  echo ""
  echo "Next steps:"
  echo "1. Run 'npm run build' to verify build succeeds"
  echo "2. Test in development: 'npm run dev'"
  echo "3. Deploy to production"
  exit 0
fi
