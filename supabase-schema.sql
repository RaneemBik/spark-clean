-- ============================================================
-- SparkClean DB — Full Schema
-- Run this entire file in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  name        text not null,
  role        text not null default 'content_manager'
                check (role in ('super_admin','content_manager')),
  avatar      text,
  created_at  timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    coalesce(new.raw_user_meta_data->>'role', 'content_manager')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- HOME CONTENT
-- ============================================================
create table public.home_content (
  id              int primary key default 1,
  badge           text default 'Premium Cleaning Services',
  hero_title      text default 'Fresh, Clean &',
  hero_gradient   text default 'Perfectly Yours.',
  hero_subtitle   text default 'Experience the highest standard of cleanliness with our eco-friendly, meticulous residential and commercial cleaning services.',
  hero_cta        text default 'Book a Cleaning',
  hero_image      text default 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
  why_title       text default 'The Spark Clean Difference',
  why_subtitle    text default 'We don''t just clean; we care for your space.',
  why_image       text default 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800',
  why_point1_title text default 'Trusted & Vetted Staff',
  why_point1_desc  text default 'Every team member undergoes strict background checks and rigorous training.',
  why_point2_title text default 'Reliable & Punctual',
  why_point2_desc  text default 'We respect your time. Our teams arrive on schedule and complete work efficiently.',
  why_point3_title text default '100% Satisfaction Guarantee',
  why_point3_desc  text default 'Not happy? Let us know within 24 hours and we''ll re-clean for free.',
  meta_title      text default 'Spark Clean – Premium Cleaning Services',
  meta_desc       text default 'Experience the highest standard of cleanliness with our eco-friendly residential and commercial cleaning services.',
  updated_at      timestamptz default now(),
  constraint single_row check (id = 1)
);
insert into public.home_content (id) values (1) on conflict do nothing;

-- ============================================================
-- ABOUT CONTENT
-- ============================================================
create table public.about_content (
  id          int primary key default 1,
  heading     text default 'About Spark Clean',
  subheading  text default 'We''re on a mission to create healthier, happier spaces through meticulous cleaning and exceptional service.',
  story_p1    text default 'Founded in 2018, Spark Clean began with a simple belief: a clean space is the foundation for a clear mind and a healthy life.',
  story_p2    text default 'We noticed a gap in the industry — many services were either affordable but unreliable, or premium but prohibitively expensive.',
  story_p3    text default 'Today, our team of dedicated professionals serves hundreds of homes and businesses, bringing our signature sparkle to every corner we touch.',
  story_image text default 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
  values      jsonb default '[
    {"icon":"💚","title":"Care","desc":"We treat every home and office with the utmost respect, as if it were our own."},
    {"icon":"🎯","title":"Excellence","desc":"We don''t cut corners; we clean them. Perfection is our standard."},
    {"icon":"🛡️","title":"Trust","desc":"Reliability and honesty are the cornerstones of our client relationships."},
    {"icon":"🤝","title":"Community","desc":"We invest in our staff and use eco-friendly products to protect our community."}
  ]'::jsonb,
  updated_at  timestamptz default now(),
  constraint single_row check (id = 1)
);
insert into public.about_content (id) values (1) on conflict do nothing;

-- ============================================================
-- SERVICES
-- ============================================================
create table public.services (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  description  text not null,
  price_note   text default '',
  features     jsonb default '[]'::jsonb,
  sort_order   int default 0,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

insert into public.services (title, description, price_note, features, sort_order) values
('Residential Cleaning',
 'Comprehensive home cleaning tailored to your lifestyle. We handle everything from routine maintenance to seasonal deep cleans.',
 'From $120 / visit',
 '["Kitchen & bathroom sanitization","Dusting & vacuuming all rooms","Floor mopping & polishing","Window & mirror cleaning","Trash removal","Eco-friendly products available"]'::jsonb,
 1),
('Commercial Office Cleaning',
 'Keep your workplace spotless and productive. We offer flexible scheduling — daily, weekly, or monthly — with minimal disruption.',
 'Custom pricing',
 '["Workstation & desk cleaning","Restroom deep sanitization","Common area maintenance","Trash & recycling management","Floor care & carpet cleaning","After-hours service available"]'::jsonb,
 2),
('Deep Cleaning',
 'Our most thorough service — perfect for move-ins, move-outs, post-renovation, or when you need a complete reset.',
 'From $280 / session',
 '["Inside oven & refrigerator","Cabinet interiors & shelving","Grout scrubbing & tile polishing","Baseboard & trim detailing","Light fixture cleaning","Behind & under appliances"]'::jsonb,
 3),
('Move-In / Move-Out',
 'Start fresh or leave a lasting impression. Our move cleaning ensures properties are spotless for the next chapter.',
 'From $200 / session',
 '["Full property top-to-bottom clean","Appliance interior cleaning","Wall spot cleaning","Window sill & track cleaning","Carpet vacuuming & treatment","Garage sweep"]'::jsonb,
 4);

-- ============================================================
-- PROJECTS
-- ============================================================
create table public.projects (
  id                 uuid primary key default uuid_generate_v4(),
  slug               text unique not null,
  title              text not null,
  category           text not null,
  location           text not null,
  client_type        text not null,
  completion_date    text not null,
  image              text not null,
  summary            text not null,
  details            text not null,
  before_after_notes text not null,
  gallery            jsonb default '[]'::jsonb,
  published          boolean default true,
  sort_order         int default 0,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

insert into public.projects (slug,title,category,location,client_type,completion_date,image,summary,details,before_after_notes,gallery,sort_order) values
('downtown-office-tower','Downtown Office Tower','Commercial','Downtown, ST','Corporate Office','March 2024',
 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
 'Full-floor deep clean and ongoing maintenance contract for a 12-story office building.',
 'This project involved a complete deep clean of all 12 floors, including executive suites, open-plan work areas, conference rooms, and restrooms.',
 'Before: High-traffic areas showed significant wear. After: Every surface restored to like-new condition.',
 '["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800"]'::jsonb,
 1),
('lakeside-luxury-home','Lakeside Luxury Home','Residential','Lakeside, ST','Private Residence','January 2024',
 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800',
 'Post-renovation deep clean for a 6-bedroom lakeside property.',
 'Following a 9-month renovation, this stunning 6-bedroom home required a thorough post-construction clean.',
 'Before: Construction dust on every surface. After: Every room move-in ready, floors gleaming.',
 '["https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800"]'::jsonb,
 2),
('riverside-restaurant','Riverside Restaurant','Commercial','Riverside, ST','Food & Beverage','February 2024',
 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
 'Weekly deep cleaning contract for a busy waterfront restaurant.',
 'We provide weekly deep cleaning for this award-winning 120-seat restaurant. Our team works overnight to ensure zero disruption.',
 'Before: Kitchen grease buildup. After: Full health-code compliance, kitchen surfaces degreased and sanitized.',
 '["https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"]'::jsonb,
 3),
('city-centre-apartments','City Centre Apartments','Residential','City Centre, ST','Property Management','April 2024',
 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
 'Move-in/move-out cleaning for a 40-unit apartment complex.',
 'Ongoing move-in/move-out cleaning partnership with a premier property management company.',
 'Before: Units in varying states after tenant departure. After: Every unit brought to hotel-standard cleanliness.',
 '["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800","https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800"]'::jsonb,
 4);

-- ============================================================
-- BLOG POSTS
-- ============================================================
create table public.blog_posts (
  id          uuid primary key default uuid_generate_v4(),
  slug        text unique not null,
  title       text not null,
  category    text not null,
  excerpt     text not null,
  content     text not null,
  author      text not null,
  image       text not null,
  status      text not null default 'published' check (status in ('published','draft')),
  published_at timestamptz default now(),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

insert into public.blog_posts (slug,title,category,excerpt,content,author,image,status) values
('ultimate-spring-cleaning-guide','The Ultimate Spring Cleaning Guide for 2024','How-To Guides',
 'Spring cleaning doesn''t have to be overwhelming. Our room-by-room checklist makes it easy to tackle every corner of your home.',
 'Spring is the perfect time to refresh your living space. Start by decluttering each room before you clean — removing items you no longer need makes the process much faster and more effective. Work from top to bottom in each room, starting with ceiling fans and light fixtures before moving to furniture and finally floors.',
 'Sarah Mitchell','https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800','published'),
('eco-friendly-cleaning-products','10 Eco-Friendly Cleaning Products That Actually Work','Green Cleaning',
 'You don''t have to choose between clean and green. These eco-certified products deliver powerful results without harsh chemicals.',
 'Switching to eco-friendly cleaning products is one of the best decisions you can make for your family and the environment.',
 'James Cooper','https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800','published'),
('office-cleaning-productivity','How a Clean Office Boosts Employee Productivity','Commercial Cleaning',
 'Research shows a direct link between workplace cleanliness and employee focus, morale, and output.',
 'A clean workspace isn''t just about appearances — it directly impacts how your team performs.',
 'Lisa Chen','https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800','published'),
('deep-clean-kitchen-guide','How to Deep Clean Your Kitchen Like a Pro','How-To Guides',
 'Your kitchen works hard every day. Follow our professional deep-clean routine to keep it hygienic and gleaming.',
 'The kitchen is one of the most used — and most neglected — rooms in the home when it comes to deep cleaning.',
 'Sarah Mitchell','https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800','published');

-- ============================================================
-- NEWS ITEMS
-- ============================================================
create table public.news_items (
  id          uuid primary key default uuid_generate_v4(),
  slug        text unique not null,
  title       text not null,
  summary     text not null,
  content     text not null,
  image       text not null,
  status      text not null default 'published' check (status in ('published','draft')),
  published_at timestamptz default now(),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

insert into public.news_items (slug,title,summary,content,image,status) values
('spark-clean-expands-to-riverside','Spark Clean Expands to Riverside — New Location Now Open',
 'We are thrilled to announce the opening of our newest service location in Riverside.',
 'After months of planning, Spark Clean is proud to officially launch our Riverside operations. Our new local team is fully trained, background-checked, and ready to bring the Spark Clean standard to your space.',
 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800','published'),
('eco-certification-announcement','Spark Clean Achieves Green Business Certification',
 'We are proud to announce that Spark Clean has officially received Green Business Certification.',
 'Sustainability has always been at the heart of what we do. This certification validates our ongoing commitment to using biodegradable cleaning products and minimizing our carbon footprint.',
 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800','published'),
('community-clean-up-campaign','Spark Clean Sponsors Local Community Clean-Up Campaign',
 'Giving back to the community we serve. Spark Clean sponsored the Annual Downtown Clean-Up Day.',
 'We believe a clean community starts beyond the front door. This February, our team joined hundreds of local volunteers for the Annual Downtown Clean-Up Day, contributing over 200 volunteer hours.',
 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800','published');

-- ============================================================
-- CONTACT SUBMISSIONS
-- ============================================================
create table public.contact_submissions (
  id          uuid primary key default uuid_generate_v4(),
  first_name  text not null,
  last_name   text not null,
  email       text not null,
  phone       text default '',
  subject     text not null,
  message     text not null,
  status      text not null default 'new' check (status in ('new','read','replied')),
  created_at  timestamptz default now()
);

-- ============================================================
-- PROJECT SUBMISSIONS (interest forms)
-- ============================================================
create table public.project_submissions (
  id              uuid primary key default uuid_generate_v4(),
  project_id      uuid references public.projects(id) on delete cascade,
  project_title   text not null,
  name            text not null,
  email           text not null,
  phone           text default '',
  service         text not null,
  message         text not null,
  status          text not null default 'new' check (status in ('new','read','contacted')),
  created_at      timestamptz default now()
);

-- ============================================================
-- STORAGE BUCKET for images
-- ============================================================
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict do nothing;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Profiles
alter table public.profiles enable row level security;
create policy "Users can view own profile"    on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"  on public.profiles for update using (auth.uid() = id);
create policy "Service role bypass"           on public.profiles using (true);

-- ============================================================
-- USERS (mirror auth.users for role lookup and admin queries)
-- ============================================================
create table public.users (
  id          uuid references auth.users(id) on delete cascade primary key,
  email       text not null unique,
  name        text,
  role        text not null default 'content_manager'
                check (role in ('super_admin','content_manager')),
  created_at  timestamptz default now()
);

-- Auto-create users row on auth user signup
create or replace function public.handle_new_user_to_users()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    coalesce(new.raw_user_meta_data->>'role', 'content_manager')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_to_users on auth.users;
create trigger on_auth_user_created_to_users
  after insert on auth.users
  for each row execute function public.handle_new_user_to_users();

alter table public.users enable row level security;
create policy "Users can view own user"    on public.users for select using (auth.uid() = id);
create policy "Service role bypass users"  on public.users using (true);

-- Home content: public read, authenticated write
alter table public.home_content enable row level security;
create policy "Public can read home"      on public.home_content for select using (true);
create policy "Auth can update home"      on public.home_content for update using (auth.role() = 'authenticated');

-- About content: public read, authenticated write
alter table public.about_content enable row level security;
create policy "Public can read about"     on public.about_content for select using (true);
create policy "Auth can update about"     on public.about_content for update using (auth.role() = 'authenticated');

-- Services: public read, authenticated write
alter table public.services enable row level security;
create policy "Public can read services"  on public.services for select using (true);
create policy "Auth can manage services"  on public.services for all using (auth.role() = 'authenticated');

-- Projects: public read published, authenticated full
alter table public.projects enable row level security;
create policy "Public can read projects"  on public.projects for select using (published = true);
create policy "Auth can manage projects"  on public.projects for all using (auth.role() = 'authenticated');

-- Blog posts: public read published, authenticated full
alter table public.blog_posts enable row level security;
create policy "Public can read blogs"     on public.blog_posts for select using (status = 'published');
create policy "Auth can manage blogs"     on public.blog_posts for all using (auth.role() = 'authenticated');

-- News items: public read published, authenticated full
alter table public.news_items enable row level security;
create policy "Public can read news"      on public.news_items for select using (status = 'published');
create policy "Auth can manage news"      on public.news_items for all using (auth.role() = 'authenticated');

-- Contact submissions: anyone can insert, only auth can read
alter table public.contact_submissions enable row level security;
create policy "Anyone can submit contact" on public.contact_submissions for insert with check (true);
create policy "Auth can read contacts"    on public.contact_submissions for select using (auth.role() = 'authenticated');
create policy "Auth can update contacts"  on public.contact_submissions for update using (auth.role() = 'authenticated');

-- Project submissions: anyone can insert, only auth can read
alter table public.project_submissions enable row level security;
create policy "Anyone can submit project" on public.project_submissions for insert with check (true);
create policy "Auth can read submissions" on public.project_submissions for select using (auth.role() = 'authenticated');
create policy "Auth can update submissions" on public.project_submissions for update using (auth.role() = 'authenticated');

-- Storage: public read, auth write
create policy "Public can view images"    on storage.objects for select using (bucket_id = 'images');
create policy "Auth can upload images"    on storage.objects for insert with check (bucket_id = 'images' and auth.role() = 'authenticated');
create policy "Auth can delete images"    on storage.objects for delete using (bucket_id = 'images' and auth.role() = 'authenticated');
