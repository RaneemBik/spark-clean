import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AuthProvider } from '@/lib/dashboard/authContext'
import DashboardShell from '@/components/dashboard/DashboardShell'

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

  // If there's no profile/mirror row, try to use role from Supabase auth user metadata
  const metadataRole = (user.user_metadata as any)?.role ?? null
  if (!profileRow && metadataRole) {
    profileRow = { name: user.email?.split('@')[0] ?? 'Admin', role: metadataRole }
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
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  )
}
