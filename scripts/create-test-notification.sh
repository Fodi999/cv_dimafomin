#!/bin/bash
# Create test notification manually

echo "🧪 Creating test notification..."

# Get user ID
USER_ID="407582be-59d5-4d21-873b-1a72d31b0d42"

# Get expired item ID (Mleko)
ITEM_ID="d7b5bb9d-3243-47bd-a6c8-ad6d1a0fba30"

# Create notification via SQL
source <(grep DATABASE_URL /Users/dmitrijfomin/Desktop/backend/.env | grep -v UNPOOLED)

psql "$DATABASE_URL" <<EOF
INSERT INTO notifications (
  id, user_id, type, level, title, message, 
  metadata, is_read, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  '$USER_ID',
  'fridge',
  'critical',
  'Produkt przeterminowany',
  'Mleko 3.2% przeterminowało się 24 dni temu. Strata: 6.50 PLN. Sprawdź lodówkę częściej! 🥛',
  jsonb_build_object(
    'itemId', '$ITEM_ID',
    'itemName', 'Mleko 3.2%',
    'daysLeft', -24,
    'lostMoney', 6.50
  ),
  false,
  NOW(),
  NOW()
) RETURNING id, title, message;
EOF

echo ""
echo "✅ Test notification created!"
echo "🔄 Refresh the page to see it!"
