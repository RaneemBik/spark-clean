import { createClient } from '@/lib/supabase/server'
import ProjectEditorPage from '@/components/dashboard/pages/ProjectEditorPage'
export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: project } = await supabase.from('projects').select('*').eq('id', params.id).single()
  return <ProjectEditorPage project={project} />
}
