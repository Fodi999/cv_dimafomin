#!/bin/bash

# 🔄 ChefOS - Migrate UserContext to SessionContext
# 
# Автоматическая замена импортов во всех компонентах

set -e

echo "🔄 Migrating UserContext → SessionContext"
echo ""

FILES=(
  "app/(user)/fridge/page.tsx"
  "app/(user)/layout.tsx"
  "app/(user)/page.tsx"
  "app/(user)/assistant/page.tsx"
  "app/(user)/profile/page.tsx"
  "app/(user)/profile/[id]/page.tsx"
  "app/admin/profile/page.tsx"
  "components/profile/ProfileEditSheet.tsx"
  "components/NavigationBurger.tsx"
  "components/admin/AdminDashboardHeader.tsx"
  "components/layout/UserNavigation.tsx"
  "components/admin/dashboard/AdminHeader.tsx"
  "components/admin/AdminHeader.tsx"
  "components/layout/AdminNavigation.tsx"
  "components/admin/AdminSidebar.tsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✏️  Updating: $file"
    sed -i '' 's/from "@\/contexts\/UserContext"/from "@\/contexts\/SessionContext"/g' "$file"
  else
    echo "⚠️  Not found: $file"
  fi
done

echo ""
echo "✅ Migration complete!"
echo ""
echo "📝 Note: useUser() still works (alias in SessionContext)"
echo "   You can optionally refactor to useSession() later"
