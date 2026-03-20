import { getAllUsers } from '@/lib/supabase/actions'
import UsersDashClient from '@/components/dashboard/pages/UsersDashClient'

export default async function UsersDashPage() {
  try {
    const users = await getAllUsers()
    return <UsersDashClient initialUsers={users} />
  } catch (err: any) {
    // Provide a helpful server-rendered error instead of a generic 404
    console.error('UsersDashPage error:', err)
    return (
      <div className="p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Unable to load users</h2>
        <p className="text-sm text-gray-500">Server error: {err?.message ?? String(err)}</p>
      </div>
    )
  }
}
