import { requirePermission } from '@/lib/auth/permissions'
import { getAllAppointments } from '@/lib/supabase/actions'
import Link from 'next/link'

export default async function AppointmentsPage() {
  try {
    await requirePermission('view_appointments')
  } catch (e: any) {
    return <div className="p-8">Permission denied</div>
  }

  const appointments = await getAllAppointments()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Appointments</h1>
      <div className="space-y-4">
        {appointments.length === 0 && <div>No appointments yet</div>}
        {appointments.map((a: any) => (
          <div key={a.id} className="p-4 border rounded bg-white">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{a.name} — {a.email}</div>
                <div className="text-sm text-gray-600">{a.location}</div>
                <div className="text-sm mt-1">{new Date(a.appointment_start).toLocaleString()} — {new Date(a.appointment_end).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-sm">Status: {a.status}</div>
                <Link href={`/dashboard/appointments/${a.id}`} className="text-mint-600 text-sm">Edit</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
