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
      <section className="pt-24 pb-20 bg-mint-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Our <span className="text-mint-600">Services</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive cleaning solutions tailored to your specific needs.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-28">
            <Pagination items={services} itemsPerPage={5} renderItem={(service: any, i: number, globalIndex: number) => (
              <motion.div key={service.id} id={service.id}
                initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-100px' }}
                className={`flex flex-col ${globalIndex % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-14 items-center`}>
                <div className="w-full lg:w-1/2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-mint-100 rounded-3xl translate-x-4 translate-y-4 -z-10" />
                    <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-lg">
                      <Image src={IMAGES[globalIndex % IMAGES.length]} alt={service.title} fill className="object-cover" />
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-1/2">
                  <div className="inline-block px-4 py-1 rounded-full bg-mint-100 text-mint-700 font-semibold text-sm mb-4">{service.price_note}</div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">{service.title}</h2>
                  <p className="text-lg text-gray-600 mb-10">{service.description}</p>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">What's Included:</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {(service.features as string[]).map((f, j) => (
                      <li key={j} className="flex items-start text-gray-700">
                        <CheckCircle2 className="w-5 h-5 text-mint-500 mr-2 shrink-0 mt-0.5" /><span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button onClick={() => setOpenService(service)} icon={<ArrowRight className="w-4 h-4" />}>Book This Service</Button>
                </div>
              </motion.div>
            )} />
          </div>
        </div>
      </section>
      {openService && (
        <AppointmentModal service={openService} open={!!openService} onClose={() => setOpenService(null)} />
      )}

      <section className="py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading subtitle="Process" title="How It Works" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            {[
              { step:'01', title:'Request a Quote', desc:'Fill out our simple form or call us to discuss your specific cleaning needs.' },
              { step:'02', title:'Schedule Service', desc:'Choose a convenient time. We offer flexible scheduling to fit your busy life.' },
              { step:'03', title:'Enjoy Your Space', desc:'Our professionals arrive on time and leave your space sparkling clean.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.2 }} className="text-center">
                <div className="w-20 h-20 mx-auto bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-mint-50 mb-6">
                  <span className="text-2xl font-bold text-mint-600">{item.step}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </div>
  )
}
