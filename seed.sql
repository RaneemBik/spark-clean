-- Seed data for SparkClean
-- Run after schema.sql. Uses gen_random_uuid() for sample user IDs.
-- IMPORTANT: This SQL populates application tables only. Supabase auth users
-- cannot be safely created by plain SQL in most Supabase projects. To create
-- real sign-in accounts that the dashboard accepts, run the provided seeding
-- script which uses the Supabase Admin API:
--
--   npm run seed
--
-- That script will create auth users, invitations, and mirror rows in
-- `public.profiles` and `public.users`. If you prefer SQL-only, you will
-- still need to create auth users manually in the Supabase UI so they can
-- sign in with passwords.

-- Permissions
INSERT INTO public.permissions (name, description) VALUES
('manage_users', 'Manage users and roles'),
('edit_home', 'Edit Home page'),
('edit_about', 'Edit About page'),
('edit_services', 'Edit Services page'),
('edit_projects', 'Create/update/delete projects'),
('edit_blog', 'Create/update/delete blog posts'),
('edit_news', 'Create/update/delete news items'),
('reply_messages', 'Reply to contact and appointment messages'),
('view_contact_submissions', 'View contact submissions'),
('view_appointments', 'View appointments'),
('view_project_submissions', 'View project submissions'),
('manage_settings', 'Manage settings')
ON CONFLICT (name) DO NOTHING;

-- Roles
INSERT INTO public.roles (name, label) VALUES
('super_admin', 'Super Admin'),
('content_manager', 'Content Manager'),
('communications', 'Communications')
ON CONFLICT (name) DO NOTHING;

-- Role permissions
INSERT INTO public.role_permissions (role_name, permission_name) VALUES
('super_admin','manage_users'),
('super_admin','edit_home'),
('super_admin','edit_about'),
('super_admin','edit_services'),
('super_admin','edit_projects'),
('super_admin','edit_blog'),
('super_admin','edit_news'),
('super_admin','view_contact_submissions'),
('super_admin','view_project_submissions'),
('super_admin','view_appointments'),
('super_admin','reply_messages'),
('super_admin','manage_settings'),
('content_manager','edit_home'),
('content_manager','edit_about'),
('content_manager','edit_services'),
('content_manager','edit_projects'),
('content_manager','edit_blog'),
('content_manager','edit_news'),
('communications','view_contact_submissions'),
('communications','view_appointments'),
('communications','reply_messages')
ON CONFLICT (role_name, permission_name) DO NOTHING;

-- Example admin user profile (auth user should be created through Supabase auth admin API)
-- We seed a profile mirror row so the app can read role quickly without creating an auth user here.
INSERT INTO public.profiles (id, email, name, role)
VALUES (gen_random_uuid(), 'admin@example.com', 'Test Admin', 'super_admin')
ON CONFLICT (id) DO NOTHING;

-- Home content
INSERT INTO public.home_content (id, badge, hero_title, hero_gradient, hero_subtitle, hero_cta, hero_image, why_title, why_subtitle, why_image, why_point1_title, why_point1_desc, why_point2_title, why_point2_desc, why_point3_title, why_point3_desc, meta_title, meta_desc)
VALUES (1, 'Premium Cleaning Services', 'Fresh, Clean &', 'Perfectly Yours.', 'Experience the highest standard of cleanliness with our eco-friendly, meticulous residential and commercial cleaning services.', 'Book a Cleaning', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800', 'The Spark Clean Difference', 'We don\'t just clean; we care for your space.', 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800', 'Trusted & Vetted Staff', 'Every team member undergoes strict background checks and rigorous training.', 'Reliable & Punctual', 'We respect your time. Our teams arrive on schedule and complete work efficiently.', '100% Satisfaction Guarantee', 'Not happy? Let us know within 24 hours and we\'ll re-clean for free.', 'Spark Clean – Premium Cleaning Services', 'Experience the highest standard of cleanliness with our eco-friendly residential and commercial cleaning services.')
ON CONFLICT (id) DO UPDATE SET badge = EXCLUDED.badge;

-- About content
INSERT INTO public.about_content (id, heading, subheading, story_p1, story_p2, story_p3, story_image, values)
VALUES (1, 'About Spark Clean', 'We\'re on a mission to create healthier, happier spaces through meticulous cleaning and exceptional service.', 'Founded in 2018, Spark Clean began with a simple belief: a clean space is the foundation for a clear mind and a healthy life.', 'We noticed a gap in the industry - many services were either affordable but unreliable, or premium but prohibitively expensive.', 'Today, our team of dedicated professionals serves hundreds of homes and businesses, bringing our signature sparkle to every corner we touch.', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800', '[{"icon":"Heart","title":"Care","desc":"We treat every home and office with the utmost respect, as if it were our own."},{"icon":"Target","title":"Excellence","desc":"We don\'t cut corners; we clean them. Perfection is our standard."},{"icon":"Shield","title":"Trust","desc":"Reliability and honesty are the cornerstones of our client relationships."},{"icon":"Users","title":"Community","desc":"We invest in our staff and use eco-friendly products to protect our community."}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET heading = EXCLUDED.heading;

-- Services
INSERT INTO public.services (title, description, price_note, gallery, features, sort_order)
VALUES
('Residential Cleaning','Comprehensive home cleaning tailored to your lifestyle. We handle everything from routine maintenance to seasonal deep cleans.','From $120 / visit','["https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800"]'::jsonb,'["Kitchen & bathroom sanitization","Dusting & vacuuming all rooms","Floor mopping & polishing","Window & mirror cleaning","Trash removal","Eco-friendly products available"]'::jsonb,1),
('Commercial Office Cleaning','Keep your workplace spotless and productive. We offer flexible scheduling - daily, weekly, or monthly - with minimal disruption.','Custom pricing','["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800"]'::jsonb,'["Workstation & desk cleaning","Restroom deep sanitization","Common area maintenance","Trash & recycling management","Floor care & carpet cleaning","After-hours service available"]'::jsonb,2),
('Deep Cleaning','Our most thorough service - perfect for move-ins, move-outs, post-renovation, or when you need a complete reset.','From $280 / session','["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"]'::jsonb,'["Inside oven & refrigerator","Cabinet interiors & shelving","Grout scrubbing & tile polishing","Baseboard & trim detailing","Light fixture cleaning","Behind & under appliances"]'::jsonb,3)
ON CONFLICT (title) DO NOTHING;

-- Projects
INSERT INTO public.projects (slug, title, category, location, client_type, completion_date, image, summary, details, before_after_notes, gallery, published, is_trashed, sort_order)
VALUES
('downtown-office-tower','Downtown Office Tower','Commercial','Downtown, ST','Corporate Office','March 2024','https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800','Full-floor deep clean and ongoing maintenance contract for a 12-story office building.','This project involved a complete deep clean of all 12 floors, including executive suites, open-plan work areas, conference rooms, and restrooms.','Before: High-traffic areas showed significant wear. After: Every surface restored to like-new condition.','["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800"]'::jsonb,true,false,1),
('lakeside-luxury-home','Lakeside Luxury Home','Residential','Lakeside, ST','Private Residence','January 2024','https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800','Post-renovation deep clean for a 6-bedroom lakeside property.','After a major renovation, our team completed a full top-to-bottom clean including fixtures, trims, and specialty floor care.','Before: Construction dust and debris throughout. After: Fully move-in ready with polished surfaces.','["https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800"]'::jsonb,true,false,2),
('riverside-restaurant','Riverside Restaurant','Commercial','Riverside, ST','Food and Beverage','February 2024','https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800','Weekly deep-cleaning contract for a busy waterfront restaurant.','We provide overnight weekly deep cleaning for kitchen and dining areas to maintain hygiene compliance and premium presentation.','Before: Grease buildup in high-use zones. After: Sanitized and compliant prep and service spaces.','["https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"]'::jsonb,true,false,3)
ON CONFLICT (slug) DO NOTHING;

-- Blog posts
INSERT INTO public.blog_posts (slug, title, category, excerpt, content, author, image, gallery, status, is_trashed, published_at)
VALUES
('ultimate-spring-cleaning-guide','The Ultimate Spring Cleaning Guide for 2024','How-To Guides','Spring cleaning doesn\'t have to be overwhelming. Our room-by-room checklist makes it easy to tackle every corner of your home.','Spring is the perfect time to refresh your living space. Start by decluttering each room before you clean. Work from top to bottom in each room, then finish with floors.','Spark Clean Team','https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800','["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800"]'::jsonb,'published',false,now()),
('office-cleaning-checklist-weekly','Weekly Office Cleaning Checklist for Busy Teams','Commercial Cleaning','Use this practical checklist to keep your office consistently clean without disrupting daily operations.','Prioritize high-touch zones, assign weekly task ownership, and schedule deep-cleaning windows after business hours for best results.','Spark Clean Team','https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800','["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800"]'::jsonb,'published',false,now()),
('move-out-cleaning-must-do','Move-Out Cleaning: What Landlords Actually Check','Move-In and Move-Out','Focus on the cleaning details that matter most during inspections and avoid common move-out mistakes.','Pay special attention to kitchen appliances, bathroom grout, baseboards, and wall marks. Document final condition after cleaning.','Spark Clean Team','https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800','["https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"]'::jsonb,'published',false,now())
ON CONFLICT (slug) DO NOTHING;

-- News items
INSERT INTO public.news_items (slug, title, summary, content, image, gallery, status, is_trashed, published_at)
VALUES
('spark-clean-expands-to-riverside','Spark Clean Expands to Riverside - New Location Now Open','We are thrilled to announce the opening of our newest service location in Riverside.','After months of planning, Spark Clean is proud to officially launch our Riverside operations. Our local team is fully trained and ready to serve.','https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800','["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800"]'::jsonb,'published',false,now()),
('new-eco-friendly-service-package','New Eco-Friendly Cleaning Package Launched','Spark Clean now offers a dedicated eco-friendly package using low-impact products and methods.','Our new package is designed for clients who want effective cleaning while reducing environmental impact in homes and offices.','https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800','["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"]'::jsonb,'published',false,now()),
('extended-weekend-bookings-now-open','Weekend Booking Slots Are Now Available','We expanded appointment availability to include more weekend time slots for residential clients.','Due to high demand, our team has opened additional Saturday and Sunday slots in select service areas.','https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800','["https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800"]'::jsonb,'published',false,now())
ON CONFLICT (slug) DO NOTHING;

-- Contact submission example
INSERT INTO public.contact_submissions (first_name, last_name, email, phone, subject, message)
VALUES ('Jane','Doe','jane.doe@example.com','555-0102','Test inquiry','This is a seeded contact message.')
ON CONFLICT DO NOTHING;

-- Project submission example (project_id may be NULL; uses first project slug)
DO $$
DECLARE p_id int;
BEGIN
  SELECT id INTO p_id FROM public.projects WHERE slug = 'downtown-office-tower' LIMIT 1;
  INSERT INTO public.project_submissions (project_id, project_title, name, email, phone, service, message)
  VALUES (p_id, COALESCE((SELECT title FROM public.projects WHERE id = p_id), 'Sample Project'), 'Alice Example', 'alice@example.com', '555-0199', 'Deep Cleaning', 'Interested in a deep clean for a 3-bedroom home.');
END$$;

-- Appointment example (book a slot against first service)
DO $$
DECLARE s_id int;
BEGIN
  SELECT id INTO s_id FROM public.services ORDER BY sort_order LIMIT 1;
  INSERT INTO public.appointments (service_id, name, email, phone, location, appointment_start, appointment_end, status)
  VALUES (s_id, 'Bob Client', 'bob.client@example.com', '555-0177', '123 Main St', now() + interval '2 days', now() + interval '2 days' + interval '1 hour', 'pending');
END$$;

-- Example invitation (token is random)
INSERT INTO public.invitations (email, name, role, token, expires_at)
VALUES ('invitee@example.com', 'Invitee Example', 'content_manager', encode(gen_random_bytes(24), 'hex'), now() + interval '7 days')
ON CONFLICT DO NOTHING;
