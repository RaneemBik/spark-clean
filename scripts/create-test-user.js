#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const testUserEmail = process.env.TEST_USER_EMAIL;
const testUserPassword = process.env.TEST_USER_PASSWORD;
const testUserName = process.env.TEST_USER_NAME || 'Test Admin';

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

if (!testUserEmail || !testUserPassword) {
  console.error('❌ Missing TEST_USER_EMAIL or TEST_USER_PASSWORD in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function createTestUser() {
  try {
    console.log('📝 Creating test user...');
    
    // Create auth user
    const { data, error } = await supabase.auth.admin.createUser({
      email: testUserEmail,
      password: testUserPassword,
      email_confirm: true,
      user_metadata: { name: testUserName, role: 'super_admin' },
    });

    if (error) {
      if (error.message.includes('already exists')) {
        console.log('⚠️  User already exists in database');
        return;
      }
      throw error;
    }

    console.log('✅ User created:', data.user.email);
    console.log('✅ User ID:', data.user.id);

    // Verify profile was auto-created (trigger should handle this)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profile) {
      console.log('✅ Profile created:', profile);
    } else {
      console.log('⚠️  Profile not auto-created, creating manually...');
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          name: testUserName,
          role: 'super_admin',
        });
      
      if (insertError) throw insertError;
      console.log('✅ Profile created manually');
    }

    console.log('\n🎉 Ready to sign in!');
    console.log(`Email: ${testUserEmail}`);
    console.log('Password: [from TEST_USER_PASSWORD]');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTestUser();
