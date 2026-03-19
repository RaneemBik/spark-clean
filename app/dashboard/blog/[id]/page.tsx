import { createClient } from '@/lib/supabase/server'
import BlogEditorPage from '@/components/dashboard/pages/BlogEditorPage'
export default async function EditBlogPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: post } = await supabase.from('blog_posts').select('*').eq('id', params.id).single()
  return <BlogEditorPage post={post} />
}
