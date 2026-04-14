import { createClient, createServiceClient } from '@/lib/supabase/server'
import {
  services as mockServices,
  projects as mockProjects,
  blogPosts as mockBlogPosts,
  newsItems as mockNewsItems,
} from '@/lib/mockData'

const FALLBACK_HOME = {
  id: 1,
  hero_title: 'Fresh, Clean &',
  hero_gradient: 'Perfectly Yours.',
  hero_subtitle:
    'Experience the highest standard of cleanliness with our eco-friendly, meticulous residential and commercial cleaning services.',
  hero_cta: 'Book a Cleaning',
  hero_image:
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
  why_title: 'The Spark Clean Difference',
  why_subtitle: "We don't just clean; we care for your space.",
  why_image:
    'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800',
  why_point1_title: 'Trusted & Vetted Staff',
  why_point1_desc: 'Every team member undergoes strict background checks and rigorous training.',
  why_point2_title: 'Reliable & Punctual',
  why_point2_desc: 'We respect your time. Our teams arrive on schedule and complete work efficiently.',
  why_point3_title: '100% Satisfaction Guarantee',
  why_point3_desc: "Not happy? Let us know within 24 hours and we'll re-clean for free.",
}

const FALLBACK_ABOUT = {
  id: 1,
  heading: 'About Spark Clean',
  subheading:
    "We're on a mission to create healthier, happier spaces through meticulous cleaning and exceptional service.",
  story_p1:
    'Founded in 2018, Spark Clean began with a simple belief: a clean space is the foundation for a clear mind and a healthy life.',
  story_p2:
    'We noticed a gap in the industry - many services were either affordable but unreliable, or premium but prohibitively expensive.',
  story_p3:
    'Today, our team of dedicated professionals serves hundreds of homes and businesses, bringing our signature sparkle to every corner we touch.',
  story_image:
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
  values: [
    {
      icon: 'Heart',
      title: 'Care',
      desc: 'We treat every home and office with the utmost respect, as if it were our own.',
    },
    {
      icon: 'Target',
      title: 'Excellence',
      desc: "We don't cut corners; we clean them. Perfection is our standard.",
    },
    {
      icon: 'Shield',
      title: 'Trust',
      desc: 'Reliability and honesty are the cornerstones of our client relationships.',
    },
    {
      icon: 'Users',
      title: 'Community',
      desc: 'We invest in our staff and use eco-friendly products to protect our community.',
    },
  ],
}

function hasServiceRoleAccess() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

async function withServiceFallback<T>(query: (client: ReturnType<typeof createClient>) => Promise<{ data: T | null; error: { message?: string } | null }>) {
  const anonClient = createClient()
  const first = await query(anonClient)
  const isUsable = Array.isArray(first.data) ? first.data.length > 0 : Boolean(first.data)
  if (!first.error && isUsable) return first.data

  if (!hasServiceRoleAccess()) return first.data

  try {
    const serviceClient = createServiceClient()
    const second = await query(serviceClient as ReturnType<typeof createClient>)
    const secondIsUsable = Array.isArray(second.data) ? second.data.length > 0 : Boolean(second.data)
    if (secondIsUsable || !first.data) return second.data
  } catch {
    // Ignore service fallback errors and return best-known result.
  }

  return first.data
}

function mapMockServices() {
  return mockServices.map((service, index) => ({
    id: index + 1,
    title: service.title,
    description: service.description,
    price_note: service.priceNote,
    features: service.features,
    sort_order: index + 1,
    published: true,
    is_trashed: false,
    gallery: [],
  }))
}

function mapMockProjects() {
  return mockProjects.map((project, index) => ({
    id: index + 1,
    slug: project.slug,
    title: project.title,
    category: project.category,
    location: project.location,
    client_type: project.clientType,
    completion_date: project.completionDate,
    image: project.image,
    summary: project.summary,
    details: project.details,
    before_after_notes: project.beforeAfterNotes,
    gallery: project.gallery,
    published: true,
    is_trashed: false,
    sort_order: index + 1,
  }))
}

function mapMockBlogPosts() {
  return mockBlogPosts.map((post) => ({
    ...post,
    status: 'published',
    is_trashed: false,
    published_at: new Date().toISOString(),
  }))
}

function mapMockNewsItems() {
  return mockNewsItems.map((item) => ({
    ...item,
    status: 'published',
    is_trashed: false,
    published_at: new Date().toISOString(),
  }))
}

// ─── Home ─────────────────────────────────────────────────────────────────────
export async function getHomeContent() {
  try {
    const data = await withServiceFallback((supabase) =>
      supabase.from('home_content').select('*').maybeSingle()
    )
    return data ?? FALLBACK_HOME
  } catch {
    return FALLBACK_HOME
  }
}

// ─── About ────────────────────────────────────────────────────────────────────
export async function getAboutContent() {
  try {
    const data = await withServiceFallback((supabase) =>
      supabase.from('about_content').select('*').maybeSingle()
    )
    return data ?? FALLBACK_ABOUT
  } catch {
    return FALLBACK_ABOUT
  }
}

// ─── Services ─────────────────────────────────────────────────────────────────
export async function getServices(): Promise<any[]> {
  try {
    const data = await withServiceFallback((supabase) =>
      supabase
        .from('services')
        .select('*')
        .eq('published', true)
        .eq('is_trashed', false)
        .order('sort_order')
    )
    return (data ?? []).length > 0 ? (data ?? []) : mapMockServices()
  } catch {
    return mapMockServices()
  }
}

// ─── Projects ─────────────────────────────────────────────────────────────────
export async function getProjects(): Promise<any[]> {
  try {
    const data = await withServiceFallback((supabase) =>
      supabase
        .from('projects')
        .select('*')
        .eq('published', true)
        .eq('is_trashed', false)
        .order('sort_order')
    )
    return (data ?? []).length > 0 ? (data ?? []) : mapMockProjects()
  } catch {
    return mapMockProjects()
  }
}

export async function getProjectBySlug(slug: string): Promise<any | null> {
  try {
    const data = await withServiceFallback((supabase) =>
      supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .eq('is_trashed', false)
        .maybeSingle()
    )
    return data ?? mapMockProjects().find((project) => project.slug === slug) ?? null
  } catch {
    return mapMockProjects().find((project) => project.slug === slug) ?? null
  }
}

// ─── Blog ─────────────────────────────────────────────────────────────────────
export async function getBlogPosts(): Promise<any[]> {
  try {
    const data = await withServiceFallback((supabase) =>
      supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .eq('is_trashed', false)
        .order('published_at', { ascending: false })
    )
    return (data ?? []).length > 0 ? (data ?? []) : mapMockBlogPosts()
  } catch {
    return mapMockBlogPosts()
  }
}

export async function getBlogPostBySlug(slug: string): Promise<any | null> {
  try {
    const data = await withServiceFallback((supabase) =>
      supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .eq('is_trashed', false)
        .maybeSingle()
    )
    return data ?? mapMockBlogPosts().find((post) => post.slug === slug) ?? null
  } catch {
    return mapMockBlogPosts().find((post) => post.slug === slug) ?? null
  }
}

// ─── News ─────────────────────────────────────────────────────────────────────
export async function getNewsItems(): Promise<any[]> {
  try {
    const data = await withServiceFallback((supabase) =>
      supabase
        .from('news_items')
        .select('*')
        .eq('status', 'published')
        .eq('is_trashed', false)
        .order('published_at', { ascending: false })
    )
    return (data ?? []).length > 0 ? (data ?? []) : mapMockNewsItems()
  } catch {
    return mapMockNewsItems()
  }
}

export async function getNewsItemBySlug(slug: string): Promise<any | null> {
  try {
    const data = await withServiceFallback((supabase) =>
      supabase
        .from('news_items')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .eq('is_trashed', false)
        .maybeSingle()
    )
    return data ?? mapMockNewsItems().find((item) => item.slug === slug) ?? null
  } catch {
    return mapMockNewsItems().find((item) => item.slug === slug) ?? null
  }
}
