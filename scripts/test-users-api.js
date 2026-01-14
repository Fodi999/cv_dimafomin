#!/usr/bin/env node

/**
 * Test script to check users API response structure
 * Usage: node scripts/test-users-api.js
 */

const BACKEND_URL = 'https://yeasty-madelaine-fodi999-671ccdf5.koyeb.app';
const TOKEN = process.env.TOKEN || 'YOUR_TOKEN_HERE';

async function testUsersAPI() {
  console.log('🔍 Testing Users API...\n');
  
  try {
    const url = `${BACKEND_URL}/api/admin/users?page=1&limit=5`;
    console.log('📤 Request:', url);
    console.log('🔑 Token:', TOKEN.substring(0, 20) + '...\n');
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📥 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      return;
    }
    
    const data = await response.json();
    
    console.log('\n✅ Response structure:');
    console.log('├─ Keys:', Object.keys(data));
    console.log('├─ Has "users":', !!data.users);
    console.log('├─ Has "meta":', !!data.meta);
    console.log('├─ Users count:', data.users?.length || 0);
    
    if (data.users && data.users.length > 0) {
      console.log('\n📋 First user sample:');
      const firstUser = data.users[0];
      console.log('├─ id:', firstUser.id);
      console.log('├─ name:', firstUser.name);
      console.log('├─ email:', firstUser.email);
      console.log('├─ role:', firstUser.role);
      console.log('└─ status:', firstUser.status);
    }
    
    if (data.meta) {
      console.log('\n📊 Meta info:');
      console.log('├─ total:', data.meta.total);
      console.log('├─ active_today:', data.meta.active_today);
      console.log('├─ blocked:', data.meta.blocked);
      console.log('└─ premium:', data.meta.premium);
    }
    
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
}

testUsersAPI();
