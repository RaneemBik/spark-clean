'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin, Calendar, Building, ArrowLeft, CheckCircle2, CheckCircle } from 'lucide-react'
import { submitProjectInterest } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Card } from '@/components/ui/Card'

export default function ProjectDetailsClient({ project }: { project: any }) {
  const [isPending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const gallery: string[] = Array.isArray(project.gallery) ? project.gallery : []

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    fd.set('projectId', project.id)
    fd.set('projectTitle', project.title)
    startTransition(async () => {
      const result = await submitProjectInterest(fd)
      if (result.success) {
        setSubmitted(true)
      } else {
        setError(result.error ?? 'Something went wrong. Please try again.')
      }
    })
  }

  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <div className="relative h-[50vh] min-h-[400px] w-full">
        <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gray-900/60" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <Link href="/projects" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
            </Link>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-block px-3 py-1 rounded-full bg-mint-500 text-white text-sm font-semibold mb-4">
                {project.category}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-3xl">
                {project.title}
              </h1>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Project Overview</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">{project.details}</p>
              <div className="bg-mint-50 p-6 rounded-2xl border border-mint-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <CheckCircle2 className="w-6 h-6 text-mint-500 mr-2" /> Before & After Notes
                </h3>
                <p className="text-gray-700">{project.before_after_notes}</p>
              </div>
            </section>

            {gallery.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Gallery</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {gallery.map((img, i) => (
                    <div key={i} className="h-64 rounded-2xl overflow-hidden shadow-sm">
                      <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Project Meta */}
            <Card className="p-6 bg-gray-50 border-none">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Project Details</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 text-mint-600 mr-3 shrink-0 mt-0.5" />
                  <div><span className="block text-sm text-gray-500">Location</span><span className="font-medium text-gray-900">{project.location}</span></div>
                </li>
                <li className="flex items-start">
                  <Building className="w-5 h-5 text-mint-600 mr-3 shrink-0 mt-0.5" />
                  <div><span className="block text-sm text-gray-500">Client Type</span><span className="font-medium text-gray-900">{project.client_type}</span></div>
                </li>
                <li className="flex items-start">
                  <Calendar className="w-5 h-5 text-mint-600 mr-3 shrink-0 mt-0.5" />
                  <div><span className="block text-sm text-gray-500">Completed</span><span className="font-medium text-gray-900">{project.completion_date}</span></div>
                </li>
              </ul>
            </Card>

            {/* Interest Form */}
            <Card className="p-6 glass-panel">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Want similar results?</h3>
              <p className="text-gray-600 text-sm mb-6">Request a quote for your space.</p>

              {submitted ? (
                <div className="flex flex-col items-center text-center py-6">
                  <CheckCircle className="w-12 h-12 text-mint-500 mb-3" />
                  <p className="font-semibold text-gray-900 mb-1">Request Sent!</p>
                  <p className="text-sm text-gray-500">We'll be in touch within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-xl">{error}</p>}
                  <Input label="Full Name" name="name" placeholder="John Doe" required />
                  <Input label="Email" name="email" type="email" placeholder="john@example.com" required />
                  <Input label="Phone" name="phone" type="tel" placeholder="(555) 123-4567" />
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-sm font-medium text-gray-700 ml-1">Service Needed</label>
                    <select name="service" className="px-4 py-3 rounded-2xl border border-mint-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-mint-500">
                      <option>Residential Cleaning</option>
                      <option>Commercial Cleaning</option>
                      <option>Deep Cleaning</option>
                      <option>Move-In / Move-Out</option>
                    </select>
                  </div>
                  <Textarea label="Message" name="message" placeholder="Tell us about your space..." />
                  <Button className="w-full" type="submit" disabled={isPending}>
                    {isPending ? 'Sending...' : 'Request Quote'}
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
