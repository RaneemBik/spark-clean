'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CheckCircle2, Star, Shield, Clock, ThumbsUp, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { AnimatedBubble } from '@/components/shared/AnimatedBubble'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { WaveDivider } from '@/components/shared/WaveDivider'
import { CTASection } from '@/components/shared/CTASection'

interface Props {
  home: any
  services: any[]
  blogPosts: any[]
}

export default function HomeClient({ home, services, blogPosts }: Props) {
  const featured = services.slice(0, 3)
  const whyPoints = [
    { icon: <Shield className="w-6 h-6" />, title: home?.why_point1_title ?? 'Trusted & Vetted Staff',         desc: home?.why_point1_desc ?? '' },
    { icon: <Clock className="w-6 h-6" />,  title: home?.why_point2_title ?? 'Reliable & Punctual',            desc: home?.why_point2_desc ?? '' },
    { icon: <ThumbsUp className="w-6 h-6" />, title: home?.why_point3_title ?? '100% Satisfaction Guarantee',  desc: home?.why_point3_desc ?? '' },
  ]

  return (
    <div className="overflow-hidden">
      {/* ── Hero ── */}
      <section className="relative min-h-[90vh] flex items-center pt-10 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-mint-50 to-[#F0FDF4] -z-10" />
        <AnimatedBubble size={400} color="bg-mint-200/40"  className="-top-20 -left-20" duration={10} />
        <AnimatedBubble size={300} color="bg-teal-200/30"  className="top-40 right-10" delay={2} duration={8} />
        <AnimatedBubble size={200} color="bg-amber-100/40" className="bottom-20 left-1/3" delay={1} duration={7} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.6 }} className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-mint-100 text-mint-700 font-medium text-sm mb-6 shadow-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-mint-500" />
                </span>
                {home?.badge ?? 'Premium Cleaning Services'}
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
                {home?.hero_title ?? 'Fresh, Clean &'} <br />
                <span className="text-gradient">{home?.hero_gradient ?? 'Perfectly Yours.'}</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                {home?.hero_subtitle ?? 'Experience the highest standard of cleanliness with our eco-friendly, meticulous residential and commercial cleaning services.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact"><Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>{home?.hero_cta ?? 'Book a Cleaning'}</Button></Link>
                <Link href="/services"><Button variant="outline" size="lg">View Services</Button></Link>
              </div>
              <div className="mt-10 flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map((i) => (
                    <Image key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Customer" width={40} height={40} className="w-10 h-10 rounded-full border-2 border-white" />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex text-amber-400">{[1,2,3,4,5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}</div>
                  <span className="font-medium text-gray-700">4.9/5</span> from 500+ reviews
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.6, delay:0.2 }} className="relative lg:h-[600px] flex justify-center items-center">
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 bg-gradient-to-tr from-mint-300 to-teal-400 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] animate-blob opacity-20" />
                <div className="absolute inset-4 bg-gradient-to-tr from-mint-200 to-teal-300 rounded-[60%_40%_30%_70%/50%_60%_40%_50%] animate-blob opacity-40" style={{ animationDelay:'2s' }} />
                <div className="absolute inset-8 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] overflow-hidden shadow-2xl border-4 border-white">
                  <Image src={home?.hero_image ?? 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800'} alt="Professional Cleaner" fill className="object-cover" />
                </div>
                <motion.div animate={{ y:[-10,10,-10] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }} className="absolute -right-4 top-20 glass-panel px-4 py-3 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Shield className="w-5 h-5" /></div>
                  <div><div className="font-bold text-gray-900">100%</div><div className="text-xs text-gray-500">Insured & Bonded</div></div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        <WaveDivider fill="#ffffff" />
      </section>

      {/* ── Services ── */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading subtitle="What We Do" title="Professional Cleaning for Every Need" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {featured.map((service, index) => (
              <motion.div key={service.id} initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:index*0.1 }}>
                <Card hover className="h-full p-8 border border-mint-50">
                  <div className="w-14 h-14 rounded-2xl bg-mint-100 text-mint-600 flex items-center justify-center mb-6"><Sparkles className="w-7 h-7" /></div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <ul className="space-y-2 mb-8">
                    {(service.features as string[]).slice(0,3).map((f, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-600"><CheckCircle2 className="w-4 h-4 text-mint-500 mr-2 shrink-0" />{f}</li>
                    ))}
                  </ul>
                  <Link href="/services" className="text-mint-600 font-semibold flex items-center hover:text-mint-700 transition-colors">
                    Learn more <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12"><Link href="/services"><Button variant="outline">View All Services</Button></Link></div>
        </div>
      </section>

      {/* ── Why Us ── */}
      <section className="py-24 bg-mint-50 relative overflow-hidden">
        <AnimatedBubble size={250} color="bg-white/40" className="top-10 left-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}>
              <div className="relative w-full h-[480px] rounded-3xl overflow-hidden shadow-2xl">
                <Image src={home?.why_image ?? 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800'} alt="Why Spark Clean" fill className="object-cover" />
              </div>
            </motion.div>
            <motion.div initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}>
              <SectionHeading subtitle="Why Spark Clean" title={home?.why_title ?? 'The Spark Clean Difference'} centered={false} />
              <p className="text-gray-600 mb-8 text-lg">{home?.why_subtitle ?? "We don't just clean; we care for your space."}</p>
              <div className="space-y-6">
                {whyPoints.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-mint-600 shrink-0">{item.icon}</div>
                    <div><h4 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h4><p className="text-gray-600">{item.desc}</p></div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Blog Preview ── */}
      {blogPosts.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading subtitle="From the Blog" title="Cleaning Tips & Insights" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              {blogPosts.slice(0,3).map((post, i) => (
                <motion.div key={post.id} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}>
                  <Link href={`/blog/${post.slug}`}>
                    <Card hover className="h-full flex flex-col overflow-hidden">
                      <div className="relative h-48"><Image src={post.image} alt={post.title} fill className="object-cover" /></div>
                      <div className="p-6 flex flex-col flex-grow">
                        <span className="text-mint-600 text-xs font-semibold mb-2">{post.category}</span>
                        <h3 className="font-bold text-gray-900 mb-2 flex-grow">{post.title}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center text-mint-600 font-medium text-sm mt-4">Read more <ArrowRight className="w-3 h-3 ml-1" /></div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-12"><Link href="/blog"><Button variant="outline">View All Articles</Button></Link></div>
          </div>
        </section>
      )}

      <CTASection />
    </div>
  )
}
