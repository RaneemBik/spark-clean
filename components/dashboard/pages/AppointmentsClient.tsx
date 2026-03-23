'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Mail, Phone, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react'

const SLOT_START_HOUR = 8
const SLOT_END_HOUR = 18

function normalizePhone(value: string) {
  return (value || '').replace(/[^\d+]/g, '').replace(/^00/, '+')
}

export default function AppointmentsClient({ initialAppointments }: { initialAppointments: any[] }) {
  const [appointments] = useState(initialAppointments)
  const [selectedDate, setSelectedDate] = useState(formatDateKey(new Date()))
  const [visibleMonth, setVisibleMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(appointments.length / itemsPerPage)
  const paginatedAppointments = appointments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const appointmentsForSelectedDay = useMemo(() => {
    return appointments
      .filter((a: any) => formatDateKey(new Date(a.appointment_start)) === selectedDate)
      .sort((a: any, b: any) => new Date(a.appointment_start).getTime() - new Date(b.appointment_start).getTime())
  }, [appointments, selectedDate])

  const pendingByHour = useMemo(() => {
    const blocked = new Set<number>()
    for (const appt of appointmentsForSelectedDay) {
      if (appt.status !== 'pending') continue
      const start = new Date(appt.appointment_start)
      blocked.add(start.getHours())
    }
    return blocked
  }, [appointmentsForSelectedDay])

  const todayKey = formatDateKey(new Date())

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Appointments</h1>

      <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 border rounded bg-white">
          <h2 className="font-semibold text-gray-900 mb-3">Daily Availability Calendar</h2>
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setVisibleMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
              className="p-2 rounded border hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="font-medium">{visibleMonth.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</div>
            <button
              type="button"
              onClick={() => setVisibleMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
              className="p-2 rounded border hover:bg-gray-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-xs text-gray-500 font-medium mb-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {buildMonthGrid(visibleMonth).map((cell, i) => {
              if (!cell) return <div key={i} className="h-9" />

              const key = formatDateKey(cell)
              const isPast = key < todayKey
              const isSelected = key === selectedDate
              const dayAppointments = appointments.filter((a: any) => formatDateKey(new Date(a.appointment_start)) === key && a.status === 'pending')

              return (
                <button
                  key={key}
                  type="button"
                  disabled={isPast}
                  onClick={() => setSelectedDate(key)}
                  className={`h-9 rounded border text-sm relative ${
                    isSelected
                      ? 'bg-mint-600 text-white border-mint-600'
                      : isPast
                        ? 'text-gray-300 border-gray-100 bg-gray-50 cursor-not-allowed'
                        : 'border-gray-200 bg-white hover:bg-mint-50'
                  }`}
                >
                  {cell.getDate()}
                  {dayAppointments.length > 0 && !isPast && (
                    <span className={`absolute bottom-1 right-1 inline-block w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-red-500'}`} />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-4 border rounded bg-white">
          <h2 className="font-semibold text-gray-900 mb-1">Time Slots for {selectedDate}</h2>
          <p className="text-xs text-gray-500 mb-3">Pending appointments mark a time as unavailable.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Array.from({ length: SLOT_END_HOUR - SLOT_START_HOUR }, (_, i) => SLOT_START_HOUR + i).map((hour) => {
              const isBlocked = pendingByHour.has(hour)
              return (
                <div
                  key={hour}
                  className={`px-3 py-2 rounded border text-sm ${
                    isBlocked
                      ? 'border-red-200 bg-red-50 text-red-700'
                      : 'border-green-200 bg-green-50 text-green-700'
                  }`}
                >
                  {String(hour).padStart(2, '0')}:00 {isBlocked ? 'Booked' : 'Available'}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mb-10 p-4 border rounded bg-white">
        <h2 className="font-semibold text-gray-900 mb-3">Appointments On {selectedDate}</h2>
        {appointmentsForSelectedDay.length === 0 ? (
          <div className="text-gray-500 text-sm">No appointments for this day.</div>
        ) : (
          <div className="space-y-3">
            {appointmentsForSelectedDay.map((a: any) => (
              <div key={a.id} className="p-3 border rounded">
                <div className="font-medium">{new Date(a.appointment_start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {a.name}</div>
                <div className="text-sm text-gray-600">{a.email}{a.phone ? ` | ${a.phone}` : ''}</div>
                <div className="text-sm">Status: <span className="font-medium">{a.status}</span></div>
              </div>
            ))}
          </div>
        )}
      </div>

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
