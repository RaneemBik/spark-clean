import { createClient } from '@/lib/supabase/server'
import AboutDashClient from '@/components/dashboard/pages/AboutDashClient'
export default async function AboutDashPage() {
  const supabase = createClient()
  const { data: content } = await supabase.from('about_content').select('*').single()
  return <AboutDashClient initialContent={content} />
}
