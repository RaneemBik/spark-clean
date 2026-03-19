'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Calendar, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { CTASection } from '@/components/shared/CTASection'

export default function ProjectsClient({ projects }: { projects: any[] }) {
  return (
    <div className="overflow-hidden bg-white">
      <section className="pt-24 pb-16 bg-mint-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Our <span className="text-mint-600">Projects</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our portfolio of transformed spaces.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {projects.length === 0 ? (
            <p className="text-center text-gray-400 py-20">No projects yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div key={project.id} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:index*0.1 }}>
                  <Link href={`/projects/${project.slug}`} className="block h-full">
                    <Card hover className="h-full flex flex-col">
                      <div className="relative h-64 overflow-hidden">
                        <Image src={project.image} alt={project.title} fill className="object-cover transition-transform duration-500 hover:scale-110" />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-mint-700">{project.category}</div>
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                        <div className="flex items-center text-sm text-gray-500 mb-4 gap-4">
                          <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{project.location}</span>
                          <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{project.completion_date}</span>
                        </div>
                        <p className="text-gray-600 mb-6 flex-grow line-clamp-3">{project.summary}</p>
                        <div className="flex items-center text-mint-600 font-semibold mt-auto">
                          View Details <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      <CTASection />
    </div>
  )
}
