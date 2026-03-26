'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowLeft, Facebook, Twitter, Linkedin, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
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

export default function BlogDetailsClient({ post, related }: { post: any; related: any[] }) {
  const fallbackGallery = [
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800',
  ]
  const gallery = Array.from(new Set([
    ...normalizeGallery(post?.gallery),
    typeof post?.image === 'string' ? post.image : '',
    ...fallbackGallery,
  ].filter((img: unknown): img is string => typeof img === 'string' && img.length > 0))).slice(0, 3)

  return (
    <div className="bg-white pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <Link href="/blog" className="inline-flex items-center text-mint-600 hover:text-mint-700 mb-8 font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to all articles
        </Link>
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
          <div className="text-mint-600 font-semibold mb-4">{post.category}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-6 text-gray-500 mb-10 pb-6 border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-mint-100 flex items-center justify-center text-mint-700 font-bold mr-3">
                {post.author.charAt(0)}
              </div>
              <div>
                <div className="font-medium text-gray-900">{post.author}</div>
                <div className="text-sm flex items-center"><Calendar className="w-3 h-3 mr-1" />{new Date(post.published_at).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</div>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <span className="text-sm font-medium hidden sm:inline-block">Share:</span>
              {[Facebook, Twitter, Linkedin].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-mint-100 hover:text-mint-600 transition-colors">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.2 }}>
          <MediaCarousel images={gallery} altBase={post.title} className="h-[400px] md:h-[500px] rounded-3xl shadow-lg" showThumbs />
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg max-w-none text-gray-700">
          <p className="text-xl leading-relaxed mb-8 text-gray-600 font-medium">{post.excerpt}</p>
          <div className="space-y-6 leading-relaxed whitespace-pre-line">{post.content}</div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Need professional help?</h3>
          <Link href="/contact"><Button size="lg">Get a Free Quote</Button></Link>
        </div>
      </div>

      {related.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {related.map((r) => (
              <Link key={r.id} href={`/blog/${r.slug}`}>
                <Card hover className="flex gap-4 p-4">
                  <div className="w-24 h-20 rounded-xl overflow-hidden shrink-0"><img src={r.image} alt={r.title} className="w-full h-full object-cover" /></div>
                  <div>
                    <p className="text-xs text-mint-600 font-semibold mb-1">{r.category}</p>
                    <p className="font-semibold text-gray-800 text-sm line-clamp-2">{r.title}</p>
                    <p className="text-xs text-mint-600 flex items-center gap-1 mt-2">Read more <ArrowRight className="w-3 h-3" /></p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
