import { createClient } from '@/lib/supabase/server'
import HomeDashClient from '@/components/dashboard/pages/HomeDashClient'
export default async function HomeDashPage() {
  const supabase = createClient()
  const { data: content } = await supabase.from('home_content').select('*').single()
  return <HomeDashClient initialContent={content} />
}
