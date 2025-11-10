#!/bin/bash

# API Configuration
API_BASE="https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app/api"

echo "🔐 Admin Account Setup Script"
echo "=============================="
echo ""

# Step 1: Register admin user
echo "📝 Step 1: Registering admin account..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin_password_123"
  }')

echo "Response: $REGISTER_RESPONSE"
echo ""

# Extract token from register response
ADMIN_TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*"' | head -1 | cut -d'"' -f4)
ADMIN_ID=$(echo "$REGISTER_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

echo "✅ Admin registered!"
echo "Token: ${ADMIN_TOKEN:0:50}..."
echo "ID: $ADMIN_ID"
echo ""

# Step 2: Update admin role (if endpoint exists)
echo "🔄 Step 2: Attempting to set admin role..."
ROLE_RESPONSE=$(curl -s -X PUT "$API_BASE/user/role" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "role": "admin"
  }')

echo "Response: $ROLE_RESPONSE"
echo ""

# Step 3: Test login
echo "🔐 Step 3: Testing admin login..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin_password_123"
  }')

echo "Response: $LOGIN_RESPONSE"
echo ""

# Extract token from login response
LOGIN_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | head -1 | cut -d'"' -f4)

echo "✅ Login successful!"
echo "Login Token: ${LOGIN_TOKEN:0:50}..."
echo ""

# Step 4: Test authenticated request
echo "📊 Step 4: Testing admin access..."
ADMIN_STATS=$(curl -s -X GET "$API_BASE/admin/stats" \
  -H "Authorization: Bearer $LOGIN_TOKEN")

echo "Admin Stats Response:"
echo "$ADMIN_STATS" | jq . 2>/dev/null || echo "$ADMIN_STATS"
echo ""

echo "=============================="
echo "✅ Setup complete!"
echo ""
echo "Admin Credentials:"
echo "  Email: admin@example.com"
echo "  Password: admin_password_123"
echo ""
echo "Test Token: $LOGIN_TOKEN"
