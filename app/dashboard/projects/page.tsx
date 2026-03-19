import { createClient } from '@/lib/supabase/server'
import ProjectsDashClient from '@/components/dashboard/pages/ProjectsDashClient'
export default async function ProjectsDashPage() {
  const supabase = createClient()
  const { data: projects } = await supabase.from('projects').select('*').order('sort_order')
  return <ProjectsDashClient initialProjects={projects ?? []} />
}
