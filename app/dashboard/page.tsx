import { createClient } from '@/lib/supabase/server'
import DashboardOverviewClient from '@/components/dashboard/pages/OverviewClient'

export default async function DashboardPage() {
  const supabase = createClient()
  const [{ count: newContacts }, { count: newLeads }, { count: totalBlogs }, { count: totalProjects }] = await Promise.all([
    supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('project_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
  ])
  const { data: recentContacts } = await supabase
    .from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(5)

  return (
    <DashboardOverviewClient
      stats={{ newContacts: newContacts ?? 0, newLeads: newLeads ?? 0, totalBlogs: totalBlogs ?? 0, totalProjects: totalProjects ?? 0 }}
      recentContacts={recentContacts ?? []}
    />
  )
}
