'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, ArrowLeft } from 'lucide-react'
import { CTASection } from '@/components/shared/CTASection'
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

export default function NewsDetailsClient({ news }: { news: any }) {
  const fallbackGallery = [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
  ]
  const gallery = Array.from(new Set([
    ...normalizeGallery(news?.gallery),
    typeof news?.image === 'string' ? news.image : '',
    ...fallbackGallery,
  ].filter((img: unknown): img is string => typeof img === 'string' && img.length > 0))).slice(0, 3)

  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <Link href="/news" className="inline-flex items-center text-mint-600 hover:text-mint-700 mb-8 font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to all news
        </Link>
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
          <div className="flex items-center text-mint-600 font-semibold mb-4">
            <Calendar className="w-4 h-4 mr-2" />{new Date(news.published_at).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">{news.title}</h1>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">{news.summary}</p>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}>
          <MediaCarousel images={gallery} altBase={news.title} className="h-[400px] md:h-[500px] rounded-3xl shadow-lg" showThumbs />
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-line leading-relaxed">
          {news.content}
        </div>
      </div>
      <CTASection />
    </div>
  )
}
