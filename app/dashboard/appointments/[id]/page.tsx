import { requirePermission } from '@/lib/auth/permissions'
import { createServiceClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

type Props = { params: { id: string } }

export default async function AppointmentEdit({ params }: Props) {
  try {
    await requirePermission('view_appointments')
  } catch (e: any) {
    return <div className="p-8">Permission denied</div>
  }

  const supabase = createServiceClient()
  const { data } = await supabase.from('appointments').select('*').eq('id', params.id).single()
  if (!data) return notFound()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Edit Appointment</h1>
      <div className="p-6 bg-white rounded shadow">
        <div className="mb-2 font-semibold">{data.name} — {data.email}</div>
        <div className="text-sm text-gray-600">{data.location}</div>
        <div className="text-sm mt-1">{new Date(data.appointment_start).toLocaleString()} — {new Date(data.appointment_end).toLocaleString()}</div>

        <form className="mt-4" action={`/api/appointments/update`} method="post">
          <input type="hidden" name="id" value={data.id} />
          <label className="block text-sm font-medium mb-1">Status</label>
          <select name="status" defaultValue={data.status} className="px-3 py-2 border rounded w-48">
            <option value="pending">pending</option>
            <option value="completed">completed</option>
            <option value="cancelled">cancelled</option>
          </select>
          <div className="mt-4">
            <button type="submit" className="px-4 py-2 bg-mint-600 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}
