import { createClient } from '@/lib/supabase/server'
import SubmissionsDashClient from '@/components/dashboard/pages/SubmissionsDashClient'
export default async function SubmissionsDashPage() {
  const supabase = createClient()
  const { data: submissions } = await supabase.from('project_submissions').select('*').order('created_at', { ascending: false })
  return <SubmissionsDashClient initialSubmissions={submissions ?? []} />
}
