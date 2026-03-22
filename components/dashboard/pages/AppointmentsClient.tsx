'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Phone, MessageCircle } from 'lucide-react'

function normalizePhone(value: string) {
  return (value || '').replace(/[^\d+]/g, '').replace(/^00/, '+')
}

export default function AppointmentsClient({ initialAppointments }: { initialAppointments: any[] }) {
  const [appointments] = useState(initialAppointments)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(appointments.length / itemsPerPage)
  const paginatedAppointments = appointments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Appointments</h1>
      <div className="space-y-4">
        {appointments.length === 0 && <div>No appointments yet</div>}
        {paginatedAppointments.map((a: any) => (
          <div key={a.id} className="p-4 border rounded bg-white">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{a.name} — {a.email}</div>
                {a.phone && <div className="text-sm text-gray-700">Phone: {a.phone}</div>}
                <div className="text-sm text-gray-600">{a.location}</div>
                <div className="text-sm mt-1">{new Date(a.appointment_start).toLocaleString()} — {new Date(a.appointment_end).toLocaleString()}</div>
                <div className="mt-3 flex items-center gap-2">
                  <a
                    href={`mailto:${a.email}`}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                    title="Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                  {a.phone && (
                    <a
                      href={`tel:${normalizePhone(a.phone)}`}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                      title="Call"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  )}
                  {a.phone && (
                    <a
                      href={`https://wa.me/${normalizePhone(a.phone).replace(/^\+/, '')}?text=${encodeURIComponent('Hello, this is Spark Clean regarding your appointment.')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-green-200 text-green-700 hover:bg-green-50"
                      title="Message on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm">Status: {a.status}</div>
                <Link href={`/dashboard/appointments/${a.id}`} className="text-mint-600 text-sm">Edit</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                currentPage === page
                  ? 'bg-mint-600 text-white'
                  : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
