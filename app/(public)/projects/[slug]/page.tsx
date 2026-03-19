import { getProjectBySlug } from '@/lib/supabase/queries'
import { notFound } from 'next/navigation'
import ProjectDetailsClient from '@/components/pages/ProjectDetailsClient'

export default async function ProjectDetailsPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug)
  if (!project) notFound()
  return <ProjectDetailsClient project={project} />
}
