import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard/Sidebar'
import { DashboardTopbar } from '@/components/dashboard/Topbar'
import { AuthProvider } from '@/lib/dashboard/authContext'

export const metadata = { title: 'SparkClean Admin' }

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  console.log('📊 DashboardLayout: Starting...')
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  console.log('👤 DashboardLayout: User check:', user?.email || 'NO USER')
  
  if (!user) {
    console.log('❌ DashboardLayout: No user found, redirecting to login')
    redirect('/login')
  }

  console.log('✅ DashboardLayout: User found:', user.email)
  
  // Prefer `public.users` table for role/name, fallback to `profiles`
  let profileRow: any = null
  try {
    const { data: userRow } = await supabase.from('users').select('*').eq('id', user.id).single()
    profileRow = userRow
  } catch (e) {}

  if (!profileRow) {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    profileRow = profile
  }

  console.log('📋 DashboardLayout: User/profile row:', profileRow?.name || 'NO PROFILE')

  const authUser = {
    id:     user.id,
    name:   profileRow?.name ?? user.email?.split('@')[0] ?? 'Admin',
    email:  user.email ?? '',
    role:   profileRow?.role ?? 'content_manager',
    avatar: (profileRow?.name ?? user.email ?? 'A').slice(0,2).toUpperCase(),
  }

  return (
    <AuthProvider initialUser={authUser}>
      <div className="min-h-screen bg-gray-50/50 flex">
        <DashboardSidebar />
        <div className="flex-1 ml-64 flex flex-col min-h-screen">
          <DashboardTopbar />
          <main className="flex-1 p-6 max-w-screen-xl">{children}</main>
        </div>
      </div>
    </AuthProvider>
  )
}
