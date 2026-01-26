#!/bin/bash

# 🔐 ChefOS - Create Super Admin Script
# 
# Использование:
#   ./scripts/create-super-admin.sh your-email@example.com

set -e

EMAIL=${1:-""}

if [ -z "$EMAIL" ]; then
  echo "❌ Error: Email is required"
  echo ""
  echo "Usage: ./scripts/create-super-admin.sh your-email@example.com"
  exit 1
fi

echo "🔐 Creating super admin for: $EMAIL"
echo ""
echo "⚠️  NOTE: This script assumes you have direct database access."
echo "    If using Docker/external DB, adjust the connection accordingly."
echo ""

# Detect database type from environment or ask
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL not found in environment"
  echo ""
  echo "Please set DATABASE_URL or run SQL manually:"
  echo ""
  echo "  UPDATE users SET role = 'superadmin' WHERE email = '$EMAIL';"
  echo ""
  exit 1
fi

# PostgreSQL
if [[ $DATABASE_URL == postgres* ]]; then
  echo "✅ Detected PostgreSQL"
  echo ""
  echo "Running SQL:"
  echo "  UPDATE users SET role = 'superadmin' WHERE email = '$EMAIL';"
  echo ""
  
  psql "$DATABASE_URL" -c "UPDATE users SET role = 'superadmin' WHERE email = '$EMAIL';"
  
  echo ""
  echo "✅ Done! User $EMAIL is now a super admin."
  echo ""
  echo "🔐 Login at: https://your-domain.com"
  echo "📂 You will be redirected to: /admin"
  echo ""
fi

# SQLite (development)
if [[ $DATABASE_URL == sqlite* ]]; then
  DB_PATH=$(echo $DATABASE_URL | sed 's/sqlite://')
  echo "✅ Detected SQLite: $DB_PATH"
  echo ""
  echo "Running SQL:"
  echo "  UPDATE users SET role = 'superadmin' WHERE email = '$EMAIL';"
  echo ""
  
  sqlite3 "$DB_PATH" "UPDATE users SET role = 'superadmin' WHERE email = '$EMAIL';"
  
  echo ""
  echo "✅ Done! User $EMAIL is now a super admin."
  echo ""
  echo "🔐 Login at: http://localhost:3000"
  echo "📂 You will be redirected to: /admin"
  echo ""
fi
