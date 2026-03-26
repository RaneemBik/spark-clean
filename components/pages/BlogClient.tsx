'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { SectionHeading } from '@/components/shared/SectionHeading'
import Pagination from '@/components/ui/Pagination'
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

export default function BlogClient({ posts }: { posts: any[] }) {
  const fallbackGallery = [
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800',
  ]

  const getGallery = (post: any) => {
    const images = [
      ...normalizeGallery(post?.gallery),
      typeof post?.image === 'string' ? post.image : '',
      ...fallbackGallery,
    ].filter((img: unknown): img is string => typeof img === 'string' && img.length > 0)
    return Array.from(new Set(images)).slice(0, 3)
  }

  const featured = posts[0]
  const rest = posts.slice(1)

  if (!featured) return (
    <div className="min-h-screen bg-white pt-24 flex items-center justify-center">
      <p className="text-gray-400">No blog posts yet.</p>
    </div>
  )

  return (
    <div className="bg-white min-h-screen">
      <section className="pt-24 pb-16 bg-mint-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Cleaning <span className="text-mint-600">Tips & Insights</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Expert advice, how-tos, and industry news to help you maintain a spotless environment.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured */}
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="mb-16">
            <Link href={`/blog/${featured.slug}`}>
              <Card hover className="flex flex-col lg:flex-row overflow-hidden border-none shadow-xl">
                <div className="lg:w-1/2 h-64 lg:h-auto relative">
                  <div className="p-3 h-full">
                    <MediaCarousel images={getGallery(featured)} altBase={featured.title} className="h-full min-h-[240px] rounded-xl" showThumbs={false} />
                  </div>
                  <div className="absolute top-4 left-4 bg-mint-500 text-white px-3 py-1 rounded-full text-xs font-bold">Featured</div>
                </div>
                <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-white">
                  <div className="text-mint-600 font-semibold text-sm mb-3">{featured.category}</div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{featured.title}</h2>
                  <p className="text-gray-600 mb-6 text-lg">{featured.excerpt}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-6 gap-4">
                    <span className="flex items-center"><User className="w-4 h-4 mr-1" />{featured.author}</span>
                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{new Date(featured.published_at).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</span>
                  </div>
                  <div className="text-mint-600 font-semibold flex items-center mt-auto">Read Article <ArrowRight className="w-4 h-4 ml-1" /></div>
                </div>
              </Card>
            </Link>
          </motion.div>

          {rest.length > 0 && (
            <>
              <SectionHeading title="Latest Articles" centered={false} className="mb-8" />
              <Pagination items={rest} itemsPerPage={5} renderItem={(post: any, i: number, globalIndex: number) => (
                <motion.div key={post.id} className="mb-8 last:mb-0" initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:(globalIndex % 5) * 0.05 }}>
                  <Link href={`/blog/${post.slug}`} className="block h-full">
                    <Card hover className="h-full flex flex-col">
                      <div className="h-48 relative overflow-hidden">
                        <div className="p-2">
                          <MediaCarousel images={getGallery(post)} altBase={post.title} className="h-44 rounded-xl" showThumbs={false} />
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="text-mint-600 font-semibold text-xs mb-2">{post.category}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
                        <p className="text-gray-600 mb-4 flex-grow line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500 mt-auto pt-4 border-t border-gray-100">
                          <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{new Date(post.published_at).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</span>
                          <span className="text-mint-600 font-medium">Read more</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              )} />
            </>
          )}
        </div>
      </section>
    </div>
  )
}
