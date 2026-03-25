#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const testUserEmail = process.env.TEST_USER_EMAIL || 'test-admin@example.com';
const testUserPassword = process.env.TEST_USER_PASSWORD || 'password123';
const testUserName = process.env.TEST_USER_NAME || 'Test Admin';

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function ensureTestUser() {
  console.log('Ensuring test user exists...');
  try {
    const { data: existing } = await supabase
      .from('users')
      .select('id,email,role')
      .eq('email', testUserEmail)
      .limit(1)
      .maybeSingle();

    if (existing) {
      await supabase.from('users').update({ role: 'super_admin', name: testUserName }).eq('id', existing.id);
      await supabase.from('profiles').upsert({ id: existing.id, name: testUserName, role: 'super_admin' });
      console.log('Test user already present in users table:', existing.email);
      return existing.id;
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email: testUserEmail,
      password: testUserPassword,
      email_confirm: true,
      user_metadata: { name: testUserName, role: 'super_admin' },
    });

    if (error) {
      if (error.message && error.message.includes('already exists')) {
        const { data: existingAfterAuth } = await supabase
          .from('users')
          .select('id,email')
          .eq('email', testUserEmail)
          .limit(1)
          .maybeSingle();

        if (existingAfterAuth?.id) {
          await supabase.from('users').update({ role: 'super_admin', name: testUserName }).eq('id', existingAfterAuth.id);
          await supabase.from('profiles').upsert({ id: existingAfterAuth.id, name: testUserName, role: 'super_admin' });
          console.log('Auth user already existed; ensured role/profile rows are updated.');
          return existingAfterAuth.id;
        }

        console.log('Auth user already exists but users table row was not found.');
        return null;
      }
      throw error;
    }

    if (data?.user?.id) {
      await supabase.from('users').upsert({
        id: data.user.id,
        email: data.user.email,
        name: testUserName,
        role: 'super_admin'
      });
      await supabase.from('profiles').upsert({ id: data.user.id, name: testUserName, role: 'super_admin' });
    }

    console.log('Created auth user:', data.user.email);
    return data.user.id;
  } catch (err) {
    console.error('Error creating test user:', err.message || err);
    process.exit(1);
  }
}

async function insertIfTableEmpty(tableName, row) {
  const { data: existing, error: readError } = await supabase
    .from(tableName)
    .select('id')
    .limit(1);

  if (readError) {
    throw new Error(`Could not read ${tableName}: ${readError.message}`);
  }

  if (Array.isArray(existing) && existing.length > 0) {
    console.log(`Skipping ${tableName}: table already has data.`);
    return;
  }

  const { error: insertError } = await supabase.from(tableName).insert(row);
  if (insertError) {
    throw new Error(`Could not seed ${tableName}: ${insertError.message}`);
  }

  console.log(`Seeded ${tableName}.`);
}

async function seedContent() {
  console.log('Seeding sample content...');

  try {
    await insertIfTableEmpty('contact_submissions', {
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane.doe@example.com',
      phone: '555-0102',
      subject: 'Test inquiry',
      message: 'This is a seeded contact message.'
    });

    await insertIfTableEmpty('project_submissions', {
      project_id: null,
      project_title: 'Sample Project',
      name: 'Alice Example',
      email: 'alice@example.com',
      phone: '555-0199',
      service: 'Deep Cleaning',
      message: 'Interested in a deep clean for a 3-bedroom home.'
    });

    const start = new Date();
    const end = new Date(start.getTime() + 1000 * 60 * 60);
    await insertIfTableEmpty('appointments', {
      name: 'Bob Client',
      email: 'bob.client@example.com',
      phone: '555-0177',
      location: '123 Main St',
      appointment_start: start.toISOString(),
      appointment_end: end.toISOString(),
      status: 'pending'
    });

    console.log('\nSeeding complete.');
    console.log(`Test user credentials (if created): ${testUserEmail} / ${testUserPassword}`);
  } catch (err) {
    console.error('Error seeding content:', err.message || err);
    process.exit(1);
  }
}

async function run() {
  await ensureTestUser();
  await seedContent();
}

run();
