'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, User, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { SectionHeading } from '@/components/shared/SectionHeading'

export default function BlogClient({ posts }: { posts: any[] }) {
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
                  <Image src={featured.image} alt={featured.title} fill className="object-cover" />
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rest.map((post, i) => (
                  <motion.div key={post.id} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}>
                    <Link href={`/blog/${post.slug}`} className="block h-full">
                      <Card hover className="h-full flex flex-col">
                        <div className="h-48 relative overflow-hidden">
                          <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-500 hover:scale-110" />
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
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
