import { createClient } from '@/lib/supabase/server'

// ─── Home ─────────────────────────────────────────────────────────────────────
export async function getHomeContent() {
  const supabase = createClient()
  const { data } = await supabase.from('home_content').select('*').single()
  return data
}

// ─── About ────────────────────────────────────────────────────────────────────
export async function getAboutContent() {
  const supabase = createClient()
  const { data } = await supabase.from('about_content').select('*').single()
  return data
}

// ─── Services ─────────────────────────────────────────────────────────────────
export async function getServices() {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.from('services').select('*').order('sort_order')
    if (error) return []
    return data ?? []
  } catch {
    return []
  }
}

// ─── Projects ─────────────────────────────────────────────────────────────────
export async function getProjects() {
  const supabase = createClient()
  const { data } = await supabase
    .from('projects').select('*')
    .eq('published', true).order('sort_order')
  return data ?? []
}

export async function getProjectBySlug(slug: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('projects').select('*').eq('slug', slug).single()
  return data
}

// ─── Blog ─────────────────────────────────────────────────────────────────────
export async function getBlogPosts() {
  const supabase = createClient()
  const { data } = await supabase
    .from('blog_posts').select('*')
    .eq('status', 'published').order('published_at', { ascending: false })
  return data ?? []
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('blog_posts').select('*').eq('slug', slug).single()
  return data
}

// ─── News ─────────────────────────────────────────────────────────────────────
export async function getNewsItems() {
  const supabase = createClient()
  const { data } = await supabase
    .from('news_items').select('*')
    .eq('status', 'published').order('published_at', { ascending: false })
  return data ?? []
}

export async function getNewsItemBySlug(slug: string) {
  const supabase = createClient()
  const { data } = await supabase
    .from('news_items').select('*').eq('slug', slug).single()
  return data
}
