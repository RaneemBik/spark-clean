import { getBlogPosts } from '@/lib/supabase/queries'
import BlogClient from '@/components/pages/BlogClient'
export default async function BlogPage() {
  const posts = await getBlogPosts()
  return <BlogClient posts={posts} />
}
