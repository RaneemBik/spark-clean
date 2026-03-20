import { createClient } from '@/lib/supabase/server'
import { requirePermission } from '@/lib/auth/permissions'
import SubmissionsDashClient from '@/components/dashboard/pages/SubmissionsDashClient'
export default async function SubmissionsDashPage() {
  try {
    await requirePermission('view_project_submissions')
  } catch (e: any) {
    return <div className="p-8">Permission denied</div>
  }

  const supabase = createClient()
  const { data: submissions } = await supabase.from('project_submissions').select('*').order('created_at', { ascending: false })
  return <SubmissionsDashClient initialSubmissions={submissions ?? []} />
}
