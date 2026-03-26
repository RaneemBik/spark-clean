'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MapPin, Calendar, ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { CTASection } from '@/components/shared/CTASection'
import Pagination from '@/components/ui/Pagination'
import MediaCarousel from '@/components/shared/MediaCarousel'

export default function ProjectsClient({ projects }: { projects: any[] }) {
  const fallbackGallery = [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
  ]

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
            <Pagination items={projects} itemsPerPage={5} renderItem={(project: any, i: number, globalIndex: number) => (
              <motion.div key={project.id} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:(globalIndex % 5) * 0.05 }}>
                <Link href={`/projects/${project.slug}`} className="block h-full">
                  <Card hover className="h-full flex flex-col">
                    <div className="p-3 pb-0">
                      <MediaCarousel
                        images={(Array.isArray(project.gallery) ? project.gallery : [project.image, ...fallbackGallery])
                          .filter((img: unknown): img is string => typeof img === 'string' && img.length > 0)
                          .slice(0, 5)}
                        altBase={project.title}
                        className="h-64 rounded-xl"
                        showThumbs={false}
                      />
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
            )} />
          )}
        </div>
      </section>
      <CTASection />
    </div>
  )
}
