import { getNewsItems } from '@/lib/supabase/queries'
import NewsClient from '@/components/pages/NewsClient'
export default async function NewsPage() {
  const news = await getNewsItems()
  return <NewsClient news={news} />
}
