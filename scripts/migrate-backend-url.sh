#!/bin/bash

# 🔧 Auto-migrate all API routes to use unified backend URL

echo "🔄 Starting backend URL migration..."
echo ""

FILES=$(grep -r "NEXT_PUBLIC_BACKEND_URL\|NEXT_PUBLIC_API_URL" app/api --include="*.ts" -l)
TOTAL=$(echo "$FILES" | wc -l | tr -d ' ')
CURRENT=0
FIXED=0
SKIPPED=0

for file in $FILES; do
  ((CURRENT++))
  echo "[$CURRENT/$TOTAL] Processing: $file"
  
  # Check what pattern is used
  if grep -q "NEXT_PUBLIC_BACKEND_URL" "$file"; then
    PATTERN="NEXT_PUBLIC_BACKEND_URL"
  elif grep -q "NEXT_PUBLIC_API_URL" "$file"; then
    PATTERN="NEXT_PUBLIC_API_URL"
  else
    echo "  ⏭️  Skipped (no pattern found)"
    ((SKIPPED++))
    continue
  fi
  
  # Check if already has import
  if grep -q "from.*backend-url" "$file"; then
    echo "  ⏭️  Skipped (already migrated)"
    ((SKIPPED++))
    continue
  fi
  
  # Create backup
  cp "$file" "$file.backup"
  
  # Find the import section (last import line)
  LAST_IMPORT_LINE=$(grep -n "^import" "$file" | tail -1 | cut -d: -f1)
  
  if [ -z "$LAST_IMPORT_LINE" ]; then
    echo "  ⚠️  Warning: No imports found, adding at top"
    LAST_IMPORT_LINE=0
  fi
  
  # Add import after last import
  {
    head -n "$LAST_IMPORT_LINE" "$file"
    echo 'import { getBackendUrl } from "@/lib/api/backend-url";'
    tail -n +$((LAST_IMPORT_LINE + 1)) "$file"
  } > "$file.tmp"
  
  # Replace the BACKEND_URL line
  sed -i.bak "s|const.*BACKEND_URL.*process\.env\.NEXT_PUBLIC_$PATTERN.*|const BACKEND_URL = getBackendUrl();|g" "$file.tmp"
  sed -i.bak "s|const.*API_BASE.*process\.env\.NEXT_PUBLIC_$PATTERN.*|const BACKEND_URL = getBackendUrl();|g" "$file.tmp"
  
  # Also replace inline usage if any
  sed -i.bak "s|process\.env\.NEXT_PUBLIC_$PATTERN|getBackendUrl()|g" "$file.tmp"
  
  # Move temp file to original
  mv "$file.tmp" "$file"
  rm -f "$file.tmp.bak" "$file.bak"
  
  echo "  ✅ Fixed: $PATTERN → getBackendUrl()"
  ((FIXED++))
done

echo ""
echo "=================================================="
echo "📊 Migration Results"
echo "=================================================="
echo "Total files: $TOTAL"
echo "✅ Fixed: $FIXED"
echo "⏭️  Skipped: $SKIPPED"
echo ""

# Verify
echo "🔍 Verifying..."
REMAINING=$(grep -r "NEXT_PUBLIC_BACKEND_URL\|NEXT_PUBLIC_API_URL" app/api --include="*.ts" -l 2>/dev/null | wc -l | tr -d ' ')

if [ "$REMAINING" -eq 0 ]; then
  echo "✅ SUCCESS! All files migrated."
  echo ""
  echo "Backups saved as *.backup (remove with: find app/api -name '*.backup' -delete)"
else
  echo "⚠️  WARNING: $REMAINING files still need manual review"
  grep -r "NEXT_PUBLIC_BACKEND_URL\|NEXT_PUBLIC_API_URL" app/api --include="*.ts" -l
fi

echo ""
echo "Next steps:"
echo "1. Review changes: git diff"
echo "2. Test build: npm run build"
echo "3. Remove backups: find app/api -name '*.backup' -delete"
