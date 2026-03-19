'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AnimatedBubble } from './AnimatedBubble'

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-mint-600"></div>

      <AnimatedBubble size={300} color="bg-white/10"      className="-top-20 -left-20"  duration={8} />
      <AnimatedBubble size={200} color="bg-teal-400/20"   className="bottom-10 right-10" delay={2} duration={7} />
      <AnimatedBubble size={150} color="bg-amber-400/20"  className="top-20 right-1/4"  delay={1} duration={6} />

      <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel rounded-3xl p-10 md:p-16 bg-white/10 border-white/20"
        >
          <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready for a Spotless Space?
          </h2>
          <p className="text-mint-50 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Experience the Spark Clean difference today. Get a free, no-obligation
            quote for your home or business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact">
              <Button variant="secondary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                Get Your Free Quote
              </Button>
            </Link>
            <Link href="/services">
              <Button
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/10 hover:text-white border border-white/30"
              >
                Explore Services
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
