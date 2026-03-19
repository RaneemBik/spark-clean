import { getAboutContent } from '@/lib/supabase/queries'
import AboutClient from '@/components/pages/AboutClient'
export default async function AboutPage() {
  const about = await getAboutContent()
  return <AboutClient about={about} />
}
