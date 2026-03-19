import { createClient } from '@/lib/supabase/server'
import ContactDashClient from '@/components/dashboard/pages/ContactDashClient'
export default async function ContactDashPage() {
  const supabase = createClient()
  const { data: submissions } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false })
  return <ContactDashClient initialSubmissions={submissions ?? []} />
}
