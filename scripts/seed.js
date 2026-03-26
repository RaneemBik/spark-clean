const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const testUserEmail = process.env.TEST_USER_EMAIL || 'admin@example.com';
const testUserPassword = process.env.TEST_USER_PASSWORD || 'ChangeMe123!';
const testUserName = process.env.TEST_USER_NAME || 'Test Admin';

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const defaultHomeContent = {
  id: 1,
  badge: 'Premium Cleaning Services',
  hero_title: 'Fresh, Clean &',
  hero_gradient: 'Perfectly Yours.',
  hero_subtitle: 'Experience the highest standard of cleanliness with our eco-friendly, meticulous residential and commercial cleaning services.',
  hero_cta: 'Book a Cleaning',
  hero_image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
  why_title: 'The Spark Clean Difference',
  why_subtitle: "We don't just clean; we care for your space.",
  why_image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800',
  why_point1_title: 'Trusted & Vetted Staff',
  why_point1_desc: 'Every team member undergoes strict background checks and rigorous training.',
  why_point2_title: 'Reliable & Punctual',
  why_point2_desc: 'We respect your time. Our teams arrive on schedule and complete work efficiently.',
  why_point3_title: '100% Satisfaction Guarantee',
  why_point3_desc: "Not happy? Let us know within 24 hours and we'll re-clean for free.",
  meta_title: 'Spark Clean – Premium Cleaning Services',
  meta_desc: 'Experience the highest standard of cleanliness with our eco-friendly residential and commercial cleaning services.'
};

const defaultAboutContent = {
  id: 1,
  heading: 'About Spark Clean',
  subheading: "We're on a mission to create healthier, happier spaces through meticulous cleaning and exceptional service.",
  story_p1: 'Founded in 2018, Spark Clean began with a simple belief: a clean space is the foundation for a clear mind and a healthy life.',
  story_p2: 'We noticed a gap in the industry - many services were either affordable but unreliable, or premium but prohibitively expensive.',
  story_p3: 'Today, our team of dedicated professionals serves hundreds of homes and businesses, bringing our signature sparkle to every corner we touch.',
  story_image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
  values: [
    { icon: 'Heart', title: 'Care', desc: 'We treat every home and office with the utmost respect, as if it were our own.' },
    { icon: 'Target', title: 'Excellence', desc: "We don't cut corners; we clean them. Perfection is our standard." },
    { icon: 'Shield', title: 'Trust', desc: 'Reliability and honesty are the cornerstones of our client relationships.' },
    { icon: 'Users', title: 'Community', desc: 'We invest in our staff and use eco-friendly products to protect our community.' }
  ]
};

const defaultServices = [
  {
    title: 'Residential Cleaning',
    description: 'Comprehensive home cleaning tailored to your lifestyle. We handle everything from routine maintenance to seasonal deep cleans.',
    price_note: 'From $120 / visit',
    gallery: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Kitchen & bathroom sanitization', 'Dusting & vacuuming all rooms', 'Floor mopping & polishing', 'Window & mirror cleaning', 'Trash removal', 'Eco-friendly products available'],
    sort_order: 1
  },
  {
    title: 'Commercial Office Cleaning',
    description: 'Keep your workplace spotless and productive. We offer flexible scheduling - daily, weekly, or monthly - with minimal disruption.',
    price_note: 'Custom pricing',
    gallery: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Workstation & desk cleaning', 'Restroom deep sanitization', 'Common area maintenance', 'Trash & recycling management', 'Floor care & carpet cleaning', 'After-hours service available'],
    sort_order: 2
  },
  {
    title: 'Deep Cleaning',
    description: 'Our most thorough service - perfect for move-ins, move-outs, post-renovation, or when you need a complete reset.',
    price_note: 'From $280 / session',
    gallery: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'
    ],
    features: ['Inside oven & refrigerator', 'Cabinet interiors & shelving', 'Grout scrubbing & tile polishing', 'Baseboard & trim detailing', 'Light fixture cleaning', 'Behind & under appliances'],
    sort_order: 3
  }
];

const defaultProjects = [
  {
    slug: 'downtown-office-tower',
    title: 'Downtown Office Tower',
    category: 'Commercial',
    location: 'Downtown, ST',
    client_type: 'Corporate Office',
    completion_date: 'March 2024',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    summary: 'Full-floor deep clean and ongoing maintenance contract for a 12-story office building.',
    details: 'This project involved a complete deep clean of all 12 floors, including executive suites, open-plan work areas, conference rooms, and restrooms.',
    before_after_notes: 'Before: High-traffic areas showed significant wear. After: Every surface restored to like-new condition.',
    gallery: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800'
    ],
    published: true,
    is_trashed: false,
    sort_order: 1
  },
  {
    slug: 'lakeside-luxury-home',
    title: 'Lakeside Luxury Home',
    category: 'Residential',
    location: 'Lakeside, ST',
    client_type: 'Private Residence',
    completion_date: 'January 2024',
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800',
    summary: 'Post-renovation deep clean for a 6-bedroom lakeside property.',
    details: 'After a major renovation, our team completed a full top-to-bottom clean including fixtures, trims, and specialty floor care.',
    before_after_notes: 'Before: Construction dust and debris throughout. After: Fully move-in ready with polished surfaces.',
    gallery: [
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'
    ],
    published: true,
    is_trashed: false,
    sort_order: 2
  },
  {
    slug: 'riverside-restaurant',
    title: 'Riverside Restaurant',
    category: 'Commercial',
    location: 'Riverside, ST',
    client_type: 'Food and Beverage',
    completion_date: 'February 2024',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
    summary: 'Weekly deep-cleaning contract for a busy waterfront restaurant.',
    details: 'We provide overnight weekly deep cleaning for kitchen and dining areas to maintain hygiene compliance and premium presentation.',
    before_after_notes: 'Before: Grease buildup in high-use zones. After: Sanitized and compliant prep and service spaces.',
    gallery: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'
    ],
    published: true,
    is_trashed: false,
    sort_order: 3
  }
];

const defaultBlogPosts = [
  {
    slug: 'ultimate-spring-cleaning-guide',
    title: 'The Ultimate Spring Cleaning Guide for 2024',
    category: 'How-To Guides',
    excerpt: "Spring cleaning doesn't have to be overwhelming. Our room-by-room checklist makes it easy to tackle every corner of your home.",
    content: 'Spring is the perfect time to refresh your living space. Start by decluttering each room before you clean. Work from top to bottom in each room, then finish with floors.',
    author: 'Spark Clean Team',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'published',
    is_trashed: false,
    published_at: new Date().toISOString()
  },
  {
    slug: 'office-cleaning-checklist-weekly',
    title: 'Weekly Office Cleaning Checklist for Busy Teams',
    category: 'Commercial Cleaning',
    excerpt: 'Use this practical checklist to keep your office consistently clean without disrupting daily operations.',
    content: 'Prioritize high-touch zones, assign weekly task ownership, and schedule deep-cleaning windows after business hours for best results.',
    author: 'Spark Clean Team',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'published',
    is_trashed: false,
    published_at: new Date().toISOString()
  },
  {
    slug: 'move-out-cleaning-must-do',
    title: 'Move-Out Cleaning: What Landlords Actually Check',
    category: 'Move-In and Move-Out',
    excerpt: 'Focus on the cleaning details that matter most during inspections and avoid common move-out mistakes.',
    content: 'Pay special attention to kitchen appliances, bathroom grout, baseboards, and wall marks. Document final condition after cleaning.',
    author: 'Spark Clean Team',
    image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'published',
    is_trashed: false,
    published_at: new Date().toISOString()
  }
];

const defaultNews = [
  {
    slug: 'spark-clean-expands-to-riverside',
    title: 'Spark Clean Expands to Riverside - New Location Now Open',
    summary: 'We are thrilled to announce the opening of our newest service location in Riverside.',
    content: 'After months of planning, Spark Clean is proud to officially launch our Riverside operations. Our local team is fully trained and ready to serve.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'published',
    is_trashed: false,
    published_at: new Date().toISOString()
  },
  {
    slug: 'new-eco-friendly-service-package',
    title: 'New Eco-Friendly Cleaning Package Launched',
    summary: 'Spark Clean now offers a dedicated eco-friendly package using low-impact products and methods.',
    content: 'Our new package is designed for clients who want effective cleaning while reducing environmental impact in homes and offices.',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'published',
    is_trashed: false,
    published_at: new Date().toISOString()
  },
  {
    slug: 'extended-weekend-bookings-now-open',
    title: 'Weekend Booking Slots Are Now Available',
    summary: 'We expanded appointment availability to include more weekend time slots for residential clients.',
    content: 'Due to high demand, our team has opened additional Saturday and Sunday slots in select service areas.',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'
    ],
    status: 'published',
    is_trashed: false,
    published_at: new Date().toISOString()
  }
];

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

async function upsertSingleRow(tableName, row, conflictColumn = 'id') {
  const { error } = await supabase.from(tableName).upsert(row, { onConflict: conflictColumn });
  if (error) {
    throw new Error(`Could not seed ${tableName}: ${error.message}`);
  }
  console.log(`Ensured ${tableName} single row.`);
}

async function ensureTableHasRows(tableName, rows) {
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

  const { error: insertError } = await supabase.from(tableName).insert(rows);
  if (insertError) {
    throw new Error(`Could not seed ${tableName}: ${insertError.message}`);
  }

  console.log(`Seeded ${tableName}.`);
}

async function ensureMinimumVisibleRows(tableName, rows, minimum, visibilityFilter) {
  let countQuery = supabase.from(tableName).select('id', { count: 'exact', head: true });
  for (const [key, value] of Object.entries(visibilityFilter)) {
    countQuery = countQuery.eq(key, value);
  }

  const { count, error: countError } = await countQuery;
  if (countError) {
    throw new Error(`Could not read ${tableName} count: ${countError.message}`);
  }

  let visibleCount = count || 0;
  if (visibleCount >= minimum) {
    console.log(`Skipping ${tableName}: already has at least ${minimum} visible rows.`);
    return;
  }

  const { data: existingRows, error: existingError } = await supabase
    .from(tableName)
    .select('slug');

  if (existingError) {
    throw new Error(`Could not read existing ${tableName} rows: ${existingError.message}`);
  }

  const existingSlugs = new Set((existingRows || []).map((row) => row.slug).filter(Boolean));
  for (const row of rows) {
    if (visibleCount >= minimum) {
      break;
    }
    if (existingSlugs.has(row.slug)) {
      continue;
    }

    const { error: insertError } = await supabase.from(tableName).insert(row);
    if (insertError) {
      throw new Error(`Could not seed ${tableName}: ${insertError.message}`);
    }

    existingSlugs.add(row.slug);
    visibleCount += 1;
  }

  if (visibleCount < minimum) {
    throw new Error(`Could not ensure minimum ${minimum} visible rows in ${tableName}. Add more default rows to seed.js.`);
  }

  console.log(`Ensured at least ${minimum} visible rows in ${tableName}.`);
}

async function seedContent() {
  console.log('Seeding sample content...');

  try {
    await upsertSingleRow('home_content', defaultHomeContent);
    await upsertSingleRow('about_content', defaultAboutContent);

    await ensureTableHasRows('services', defaultServices);
    await ensureMinimumVisibleRows('projects', defaultProjects, 3, { published: true, is_trashed: false });
    await ensureMinimumVisibleRows('blog_posts', defaultBlogPosts, 3, { status: 'published', is_trashed: false });
    await ensureMinimumVisibleRows('news_items', defaultNews, 3, { status: 'published', is_trashed: false });

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
    const msg = err?.message || String(err);
    if (/relation .* does not exist/i.test(msg)) {
      console.error('Error seeding content:', msg);
      console.error('Hint: Run supabase-schema.sql first in your Supabase SQL Editor, then run npm run seed again.');
    } else {
      console.error('Error seeding content:', msg);
    }
    process.exit(1);
  }
}

async function run() {
  await ensureTestUser();
  await seedContent();
}

run();
