import { createClient } from '@/lib/supabase/server'
import NewsDashClient from '@/components/dashboard/pages/NewsDashClient'
export default async function NewsDashPage() {
  const supabase = createClient()
  const { data: news } = await supabase.from('news_items').select('*').order('created_at', { ascending: false })
  return <NewsDashClient initialNews={news ?? []} />
}
