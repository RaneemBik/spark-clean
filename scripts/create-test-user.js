#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function createTestUser() {
  try {
    console.log('📝 Creating test user...');
    
    // Create auth user
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'raneembikai70@gmail.com',
      password: '12345678',
      email_confirm: true,
      user_metadata: { name: 'Raneem Bikai', role: 'super_admin' },
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
          name: 'Raneem Bikai',
          role: 'super_admin',
        });
      
      if (insertError) throw insertError;
      console.log('✅ Profile created manually');
    }

    console.log('\n🎉 Ready to sign in!');
    console.log('Email: raneembikai70@gmail.com');
    console.log('Password: 12345678');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTestUser();
