import { getHomeContent, getServices, getBlogPosts } from '@/lib/supabase/queries'
import HomeClient from '@/components/pages/HomeClient'

export default async function HomePage() {
  const [home, services, blogPosts] = await Promise.all([
    getHomeContent(),
    getServices(),
    getBlogPosts(),
  ])
  return <HomeClient home={home} services={services} blogPosts={blogPosts} />
}
