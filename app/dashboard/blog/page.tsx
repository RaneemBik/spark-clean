import { createClient } from '@/lib/supabase/server'
import BlogDashClient from '@/components/dashboard/pages/BlogDashClient'
export default async function BlogDashPage() {
  const supabase = createClient()
  const { data: posts } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
  return <BlogDashClient initialPosts={posts ?? []} />
}
