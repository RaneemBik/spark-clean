'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'

type Props = {
  service: any
  open: boolean
  onClose: () => void
}

export default function AppointmentModal({ service, open, onClose }: Props) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', location: '', date: '', time: '' })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!open) return null

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const startIso = new Date(`${form.date}T${form.time}`).toISOString()
      const res = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: service.id,
          name: form.name,
          email: form.email,
          phone: form.phone,
          location: form.location,
          appointment_start: startIso,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || 'Booking failed')
        setLoading(false)
        return
      }
      setSuccess(true)
    } catch (err: any) {
      setError(err?.message ?? 'Network error')
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale:0.95, opacity:0 }} animate={{ scale:1, opacity:1 }} className="relative max-w-xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30">
          {/* decorative bubbles */}
          <div className="absolute -left-16 -top-10 w-64 h-64 bg-mint-200 rounded-full blur-3xl animate-pulse" />
          <div className="absolute right-[-40px] top-20 w-48 h-48 bg-mint-100 rounded-full blur-2xl opacity-80" />
        </div>
        <div className="p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">Book: {service.title}</h3>
          <p className="text-sm text-gray-600 mb-6">Choose a date and time and we will check availability.</p>

          {success ? (
            <div className="p-6 bg-green-50 rounded">
              <p className="text-green-700 font-semibold">Appointment requested — we'll confirm shortly.</p>
              <div className="mt-4 text-right"><Button onClick={onClose}>Close</Button></div>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input required placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} className="px-4 py-2 border rounded-md w-full" />
                <input required type="email" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} className="px-4 py-2 border rounded-md w-full" />
                <input placeholder="Phone" value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} className="px-4 py-2 border rounded-md w-full" />
                <input required placeholder="Location" value={form.location} onChange={(e)=>setForm({...form,location:e.target.value})} className="px-4 py-2 border rounded-md w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input required type="date" value={form.date} onChange={(e)=>setForm({...form,date:e.target.value})} className="px-4 py-2 border rounded-md w-full" />
                <input required type="time" value={form.time} onChange={(e)=>setForm({...form,time:e.target.value})} className="px-4 py-2 border rounded-md w-full" />
              </div>

              {error && <div className="text-sm text-red-600">{error}</div>}

              <div className="flex items-center justify-between">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Booking...' : 'Submit Booking'}
                  {/* little bubble animation on submit */}
                </Button>
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}
