'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { CTASection } from '@/components/shared/CTASection'
import { Button } from '@/components/ui/Button'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import Pagination from '@/components/ui/Pagination'

const AppointmentModal = dynamic(() => import('@/components/ui/AppointmentModal'))

const IMAGES = [
  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800',
]

export default function ServicesClient({ services }: { services: any[] }) {
  const [openService, setOpenService] = useState<any | null>(null)
  return (
    <div className="overflow-hidden bg-white">
      <section className="pt-32 pb-20 bg-gradient-to-b from-mint-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint-500 to-mint-600">Services</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive cleaning solutions tailored to your specific needs. From homes to offices, we deliver excellence every time.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-32">
            <Pagination items={services} itemsPerPage={5} renderItem={(service: any, i: number, globalIndex: number) => (
              <motion.div key={service.id} id={service.id}
                initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-100px' }}
                className={`flex flex-col ${globalIndex % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-16 items-center py-12 lg:py-16 px-6 lg:px-8 bg-white rounded-2xl shadow-sm border border-gray-100`}>
                <div className="w-full lg:w-1/2 flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-mint-100 to-mint-50 rounded-3xl translate-x-4 translate-y-4 -z-10" />
                    <div className="relative h-[350px] sm:h-[400px] lg:h-[420px] rounded-3xl overflow-hidden shadow-xl border-2 border-white">
                      <Image src={IMAGES[globalIndex % IMAGES.length]} alt={service.title} fill className="object-cover" />
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-1/2 space-y-6">
                  <div className="inline-block px-4 py-2 rounded-full bg-mint-100 text-mint-700 font-semibold text-sm">{service.price_note}</div>
                  <div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">{service.title}</h2>
                    <p className="text-lg text-gray-600 leading-relaxed mb-8">{service.description}</p>
                  </div>
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <CheckCircle2 className="w-6 h-6 text-mint-600" />
                      What's Included
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                      {(service.features as string[]).map((f, j) => (
                        <li key={j} className="flex items-start gap-3 text-gray-700 leading-relaxed">
                          <div className="w-5 h-5 rounded-full bg-mint-100 flex items-center justify-center shrink-0 mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-mint-600" />
                          </div>
                          <span className="text-base">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-4">
                    <Button onClick={() => setOpenService(service)} icon={<ArrowRight className="w-4 h-4" />}>Book This Service</Button>
                  </div>
                </div>
              </motion.div>
            )} />
          </div>
        </div>
      </section>
      {openService && (
        <AppointmentModal service={openService} open={!!openService} onClose={() => setOpenService(null)} />
      )}

      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading subtitle="Our Process" title="How It Works" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mt-20">
            {[
              { step:'01', title:'Request a Quote', desc:'Fill out our simple form or call us to discuss your specific cleaning needs and get a personalized quote.' },
              { step:'02', title:'Schedule Service', desc:'Choose a convenient time that works for you. We offer flexible scheduling to fit your busy lifestyle.' },
              { step:'03', title:'Enjoy Your Space', desc:'Our professionals arrive on time and leave your space sparkling clean with attention to every detail.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.2 }} className="text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-mint-50 to-mint-100 rounded-full shadow-lg flex items-center justify-center border-4 border-white relative z-10">
                  <span className="text-3xl font-bold text-mint-600">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-20 pt-20 border-t border-gray-200">
            <div className="bg-white rounded-2xl p-8 md:p-12 text-center shadow-sm border border-gray-100">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
              <p className="text-gray-600 text-lg mb-8">Choose any service above and book your appointment today.</p>
            </div>
          </div>
        </div>
      </section>
      <CTASection />
    </div>
  )
}
