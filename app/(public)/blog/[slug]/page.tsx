import { getBlogPostBySlug, getBlogPosts } from '@/lib/supabase/queries'
import { notFound } from 'next/navigation'
import BlogDetailsClient from '@/components/pages/BlogDetailsClient'

export default async function BlogDetailsPage({ params }: { params: { slug: string } }) {
  const [post, allPosts] = await Promise.all([getBlogPostBySlug(params.slug), getBlogPosts()])
  if (!post) notFound()
  return <BlogDetailsClient post={post} related={allPosts.filter((p: any) => p.slug !== params.slug).slice(0, 2)} />
}
