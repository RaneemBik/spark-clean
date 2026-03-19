import { getAllUsers } from '@/lib/supabase/actions'
import UsersDashClient from '@/components/dashboard/pages/UsersDashClient'
export default async function UsersDashPage() {
  const users = await getAllUsers()
  return <UsersDashClient initialUsers={users} />
}
