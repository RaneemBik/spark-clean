'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

type Props = {
  service: any
  open: boolean
  onClose: () => void
}

export default function AppointmentModal({ service, open, onClose }: Props) {
  const [loading, setLoading] = useState(false)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', location: '' })
  const [selectedDate, setSelectedDate] = useState('')
  const [visibleMonth, setVisibleMonth] = useState(new Date())
  const [slots, setSlots] = useState<Array<{ start_iso: string; end_iso: string; label: string }>>([])
  const [selectedSlot, setSelectedSlot] = useState<{ start_iso: string; end_iso: string; label: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const today = new Date()
  const todayKey = useMemo(() => formatDateKey(today), [open])

  useEffect(() => {
    if (!open) return
    const next = new Date()
    setVisibleMonth(new Date(next.getFullYear(), next.getMonth(), 1))
    setSelectedDate(formatDateKey(next))
  }, [open])

  useEffect(() => {
    if (!open || !selectedDate || !service?.id) return

    let ignore = false
    async function loadSlots() {
      setLoadingSlots(true)
      setError(null)
      setSelectedSlot(null)
      try {
        const params = new URLSearchParams({
          service_id: service.id,
          date: selectedDate,
          timezone_offset_minutes: String(new Date().getTimezoneOffset()),
        })
        const res = await fetch(`/api/appointments/availability?${params.toString()}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Failed to load available times')
        if (!ignore) setSlots(data.slots || [])
      } catch (e: any) {
        if (!ignore) {
          setSlots([])
          setError(e?.message ?? 'Failed to load available times')
        }
      } finally {
        if (!ignore) setLoadingSlots(false)
      }
    }

    loadSlots()
    return () => {
      ignore = true
    }
  }, [open, selectedDate, service?.id])

  if (!open) return null

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedSlot) {
      setError('Please choose an available time slot')
      return
    }

    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: service.id,
          name: form.name,
          email: form.email,
          phone: form.phone,
          location: form.location,
          appointment_start: selectedSlot.start_iso,
          appointment_end: selectedSlot.end_iso,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale:0.95, opacity:0 }}
        animate={{ scale:1, opacity:1 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
      >
        <div className="absolute inset-0 -z-10 opacity-30">
          {/* decorative bubbles */}
          <div className="absolute -left-16 -top-10 w-64 h-64 bg-mint-200 rounded-full blur-3xl animate-pulse" />
          <div className="absolute right-[-40px] top-20 w-48 h-48 bg-mint-100 rounded-full blur-2xl opacity-80" />
        </div>
        <div className="p-5 sm:p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-1">Book: {service.title}</h3>
          <p className="text-sm text-gray-600 mb-6">Pick a day to see only available times. Past days are disabled.</p>

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

              <div className="border rounded-xl p-3 sm:p-4 bg-gray-50 space-y-4">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setVisibleMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                    className="p-2 rounded border bg-white hover:bg-gray-100"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="font-semibold text-gray-800">
                    {visibleMonth.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
                  </div>
                  <button
                    type="button"
                    onClick={() => setVisibleMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                    className="p-2 rounded border bg-white hover:bg-gray-100"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-7 text-center text-xs text-gray-500 font-medium">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <div key={d} className="py-1">{d}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {buildMonthGrid(visibleMonth).map((cell, i) => {
                    if (!cell) return <div key={i} className="h-9" />

                    const dateKey = formatDateKey(cell)
                    const isPast = dateKey < todayKey
                    const isSelected = selectedDate === dateKey

                    return (
                      <button
                        key={dateKey}
                        type="button"
                        disabled={isPast}
                        onClick={() => setSelectedDate(dateKey)}
                        className={`h-9 rounded text-sm border transition ${
                          isSelected
                            ? 'bg-mint-600 text-white border-mint-600'
                            : isPast
                              ? 'text-gray-300 border-gray-100 cursor-not-allowed bg-gray-50'
                              : 'bg-white border-gray-200 hover:bg-mint-50'
                        }`}
                      >
                        {cell.getDate()}
                      </button>
                    )
                  })}
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Available times for {selectedDate || 'selected day'}
                  </p>
                  {loadingSlots ? (
                    <p className="text-sm text-gray-500">Loading times...</p>
                  ) : slots.length === 0 ? (
                    <p className="text-sm text-gray-500">No available times for this day.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {slots.map((slot) => (
                        <button
                          key={slot.start_iso}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`px-3 py-2 text-sm rounded border transition ${
                            selectedSlot?.start_iso === slot.start_iso
                              ? 'bg-mint-600 text-white border-mint-600'
                              : 'bg-white border-gray-200 hover:bg-mint-50'
                          }`}
                        >
                          {slot.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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

function formatDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function buildMonthGrid(monthDate: Date) {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const grid: Array<Date | null> = []
  for (let i = 0; i < firstDay.getDay(); i++) {
    grid.push(null)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    grid.push(new Date(year, month, day))
  }

  return grid
}
