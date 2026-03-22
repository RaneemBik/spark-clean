import { requirePermission } from '@/lib/auth/permissions'
import { getAllAppointments } from '@/lib/supabase/actions'
import AppointmentsClient from '@/components/dashboard/pages/AppointmentsClient'

export default async function AppointmentsPage() {
  try {
    await requirePermission('view_appointments')
  } catch (e: any) {
    return <div className="p-8">Permission denied</div>
  }

  const appointments = await getAllAppointments()

  return <AppointmentsClient initialAppointments={appointments} />
}
