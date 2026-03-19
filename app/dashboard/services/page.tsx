import { createClient } from '@/lib/supabase/server'
import ServicesDashClient from '@/components/dashboard/pages/ServicesDashClient'
export default async function ServicesDashPage() {
  const supabase = createClient()
  const { data: services } = await supabase.from('services').select('*').order('sort_order')
  return <ServicesDashClient initialServices={services ?? []} />
}
