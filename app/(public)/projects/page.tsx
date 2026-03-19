import { getProjects } from '@/lib/supabase/queries'
import ProjectsClient from '@/components/pages/ProjectsClient'
export default async function ProjectsPage() {
  const projects = await getProjects()
  return <ProjectsClient projects={projects} />
}
