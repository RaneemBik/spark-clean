'use client'

import { useState, useTransition } from 'react'
import { Mail, MessageCircle, Phone, Send } from 'lucide-react'
import { replyToAppointment } from '@/lib/supabase/actions'

type Props = {
  appointment: {
    id: string
    name: string
    email: string
    phone?: string | null
  }
}

function normalizePhone(value: string) {
  return (value || '').replace(/[^\d+]/g, '').replace(/^00/, '+')
}

export default function AppointmentReplyCard({ appointment }: Props) {
  const [subject, setSubject] = useState(`Regarding your appointment with Spark Clean`)
  const [message, setMessage] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const phone = normalizePhone(appointment.phone || '')

  const onSend = () => {
    if (!subject.trim() || !message.trim()) {
      setFeedback('Subject and message are required.')
      return
    }

    startTransition(async () => {
      const result = await replyToAppointment(appointment.id, subject.trim(), message.trim())
      if (result.success) {
        setFeedback('Reply sent successfully.')
        setMessage('')
      } else {
        setFeedback(result.error || 'Failed to send reply.')
      }
    })
  }

  return (
    <div className="mt-6 p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-lg font-bold">Communication Actions</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <a href={`mailto:${appointment.email}`} className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 px-3 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
          <Mail className="w-4 h-4" /> Email
        </a>
        {phone && (
          <a href={`tel:${phone}`} className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 px-3 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
            <Phone className="w-4 h-4" /> Call
          </a>
        )}
        {phone && (
          <a
            href={`https://wa.me/${phone.replace(/^\+/, '')}?text=${encodeURIComponent('Hello, this is Spark Clean regarding your appointment.')}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-green-200 text-green-700 px-3 py-2 rounded-xl text-sm font-medium hover:bg-green-50 transition"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
        )}
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
        <p className="text-sm font-semibold text-gray-800">Reply by Email</p>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          className="w-full px-3 py-2 border rounded-lg text-sm"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="Write your reply..."
          className="w-full px-3 py-2 border rounded-lg text-sm"
        />
        {feedback && (
          <p className={`text-sm ${feedback.toLowerCase().includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {feedback}
          </p>
        )}
        <button
          type="button"
          onClick={onSend}
          disabled={isPending}
          className="inline-flex items-center gap-2 bg-mint-600 hover:bg-mint-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
        >
          <Send className="w-4 h-4" /> Send Reply
        </button>
      </div>
    </div>
  )
}
