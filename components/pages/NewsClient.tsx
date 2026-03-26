'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, ArrowRight, Megaphone } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import MediaCarousel from '@/components/shared/MediaCarousel'

function normalizeGallery(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean)
  if (typeof value !== 'string') return []
  const raw = value.trim()
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed.map((v) => String(v).trim()).filter(Boolean)
  } catch {}
  return raw.split(/\r?\n|,/).map((v) => v.trim()).filter(Boolean)
}

export default function NewsClient({ news }: { news: any[] }) {
  const fallbackGallery = [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
  ]

  const getGallery = (item: any) => {
    const images = [
      ...normalizeGallery(item?.gallery),
      typeof item?.image === 'string' ? item.image : '',
      ...fallbackGallery,
    ].filter((img: unknown): img is string => typeof img === 'string' && img.length > 0)
    return Array.from(new Set(images)).slice(0, 3)
  }

  return (
    <div className="bg-white min-h-screen">
      <section className="pt-24 pb-16 bg-mint-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
            <div className="w-16 h-16 bg-mint-200 rounded-full flex items-center justify-center mx-auto mb-6 text-mint-600">
              <Megaphone className="w-8 h-8" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Company <span className="text-mint-600">News</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay up to date with the latest announcements and updates from Spark Clean.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {news.length === 0 ? (
            <p className="text-center text-gray-400 py-20">No news items yet.</p>
          ) : (
            <div className="space-y-12">
              {news.map((item, index) => (
                <motion.div key={item.id} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:index*0.1 }}>
                  <Card hover className="flex flex-col md:flex-row overflow-hidden border border-gray-100">
                    <div className="md:w-2/5 h-64 md:h-auto relative">
                      <div className="p-3 h-full">
                        <MediaCarousel images={getGallery(item)} altBase={item.title} className="h-full min-h-[220px] rounded-xl" showThumbs={false} />
                      </div>
                    </div>
                    <div className="md:w-3/5 p-8 flex flex-col justify-center bg-white">
                      <div className="flex items-center text-sm text-mint-600 font-semibold mb-3">
                        <Calendar className="w-4 h-4 mr-2" />{new Date(item.published_at).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h2>
                      <p className="text-gray-600 mb-6 text-lg">{item.summary}</p>
                      <Link href={`/news/${item.slug}`} className="inline-flex items-center text-mint-600 font-semibold hover:text-mint-700 transition-colors mt-auto">
                        Read Full Story <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
