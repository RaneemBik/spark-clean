'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import * as Icons from 'lucide-react'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { CTASection } from '@/components/shared/CTASection'
import { AnimatedBubble } from '@/components/shared/AnimatedBubble'

export default function AboutClient({ about }: { about: any }) {
  const values = (about?.values ?? []) as { icon: string; title: string; desc: string }[]

  return (
    <div className="overflow-hidden">
      <section className="pt-24 pb-16 bg-mint-50 relative">
        <AnimatedBubble size={200} color="bg-white/50" className="top-10 left-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              {about?.heading?.split('Spark Clean')[0]}<span className="text-mint-600">Spark Clean</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{about?.subheading}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>{about?.story_p1}</p>
                <p>{about?.story_p2}</p>
                <p>{about?.story_p3}</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} className="relative">
              <div className="absolute inset-0 bg-mint-200 rounded-3xl translate-x-4 translate-y-4" />
              <div className="relative rounded-3xl overflow-hidden shadow-lg h-[500px]">
                <Image src={about?.story_image ?? 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'} alt="Our team" fill className="object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading subtitle="Our Values" title="What Drives Us" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {values.map((val, i) => {
              const IconComp = (Icons as any)[val.icon] ?? Icons.Heart
              return (
                <motion.div key={i} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}
                  className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 rounded-2xl bg-mint-100 flex items-center justify-center mb-6">
                    <IconComp className="w-8 h-8 text-mint-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{val.title}</h3>
                  <p className="text-gray-600">{val.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
      <CTASection />
    </div>
  )
}
