import { createClient } from '@/lib/supabase/server'
import NewsEditorPage from '@/components/dashboard/pages/NewsEditorPage'
export default async function EditNewsPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: item } = await supabase.from('news_items').select('*').eq('id', params.id).single()
  return <NewsEditorPage item={item} />
}
