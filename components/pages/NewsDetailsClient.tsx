'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar, ArrowLeft } from 'lucide-react'
import { CTASection } from '@/components/shared/CTASection'
import { Button } from '@/components/ui/Button'

export default function NewsDetailsClient({ news }: { news: any }) {
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
        <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-lg">
          <Image src={news.image} alt={news.title} fill className="object-cover" priority />
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
