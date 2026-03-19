import { getNewsItemBySlug } from '@/lib/supabase/queries'
import { notFound } from 'next/navigation'
import NewsDetailsClient from '@/components/pages/NewsDetailsClient'

export default async function NewsDetailsPage({ params }: { params: { slug: string } }) {
  const news = await getNewsItemBySlug(params.slug)
  if (!news) notFound()
  return <NewsDetailsClient news={news} />
}
