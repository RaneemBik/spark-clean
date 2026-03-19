import { createClient } from '@/lib/supabase/server'
import SettingsDashClient from '@/components/dashboard/pages/SettingsDashClient'
export default async function SettingsDashPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user!.id).single()
  return <SettingsDashClient user={user} profile={profile} />
}
