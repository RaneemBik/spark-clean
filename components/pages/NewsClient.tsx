'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, ArrowRight, Megaphone } from 'lucide-react'
import { Card } from '@/components/ui/Card'

export default function NewsClient({ news }: { news: any[] }) {
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
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
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
