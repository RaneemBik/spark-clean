'use client'

import { useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, MessageSquare, CheckCircle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { AnimatedBubble } from '@/components/shared/AnimatedBubble'
import { submitContactForm } from '@/lib/supabase/actions'

export default function ContactClient() {
  const [isPending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await submitContactForm(fd)
      if (result.success) {
        setSubmitted(true)
      } else {
        setError(result.error ?? 'Something went wrong. Please try again.')
      }
    })
  }

  return (
    <div className="bg-white overflow-hidden">
      <section className="pt-24 pb-16 bg-mint-50 relative">
        <AnimatedBubble size={250} color="bg-white/40" className="-top-10 -right-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Get in <span className="text-mint-600">Touch</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ready for a cleaner space? Have questions about our services? We're here to help.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }} className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Information</h2>
                <p className="text-gray-600 mb-8 text-lg">
                  Reach out via the form or contact us directly. Our team is ready to assist you.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: <Phone className="w-8 h-8 text-mint-600" />, title:'Phone', text:'70 900 000' },
                  { icon: <Mail className="w-8 h-8 text-mint-600" />, title:'Email', text:'hello@sparkclean.com' },
                  { icon: <MapPin className="w-8 h-8 text-mint-600" />, title:'Office', text:'123 Sparkle Ave, Saida, Main Street, ST 12' },
                  { icon: <Clock className="w-8 h-8 text-mint-600" />, title:'Hours', text:'Mon-Fri: 8am - 6pm\nSat: 9am - 2pm' },
                ].map((item) => (
                  <Card key={item.title} className="p-6 bg-mint-50 border-none">
                    {item.icon}
                    <h3 className="font-bold text-gray-900 mb-1 mt-4">{item.title}</h3>
                    <p className="text-gray-600 whitespace-pre-line">{item.text}</p>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}>
              <Card className="p-8 md:p-10 glass-panel">
                {submitted ? (
                  <div className="flex flex-col items-center text-center py-12">
                    <CheckCircle className="w-16 h-16 text-mint-500 mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-500">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                    <button onClick={() => setSubmitted(false)} className="mt-6 text-mint-600 font-medium hover:text-mint-700 transition">Send another message</button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 rounded-full bg-mint-100 flex items-center justify-center text-mint-600">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Send us a message</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {error && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-2xl">{error}</p>}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Input label="First Name" name="firstName" placeholder="John" required />
                        <Input label="Last Name"  name="lastName"  placeholder="Doe"  required />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Input label="Email Address" name="email" type="email" placeholder="john@example.com" required />
                        <Input label="Phone Number"  name="phone" type="tel"   placeholder="(555) 123-4567" />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 ml-1">Subject</label>
                        <select name="subject" className="px-4 py-3 rounded-2xl border border-mint-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-mint-500">
                          <option>Request a Quote</option>
                          <option>General Inquiry</option>
                          <option>Feedback</option>
                          <option>Careers</option>
                        </select>
                      </div>
                      <Textarea label="Your Message" name="message" placeholder="How can we help you today?" required />
                      <Button size="lg" className="w-full" type="submit" disabled={isPending}>
                        {isPending ? 'Sending...' : 'Send Message'}
                      </Button>
                    </form>
                  </>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
