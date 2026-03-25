//this file provides a simple authentication context for the dashboard, allowing components to access the current user, check permissions, and log out. It uses React's Context API and is designed to be used with Next.js.
//also includes a logout function that calls the signOut action from the supabase library and redirects the user to the login page.
// The hasPermission function checks if the current user has a specific permission based on their role, and isSuperAdmin checks if the user is a super admin.
//i will use this file in the dashboard layout to wrap the entire dashboard with the AuthProvider, ensuring that all components have access to the authentication context.
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Permission } from '@/lib/auth/permissionCatalog'
import { signOut } from '@/lib/supabase/actions'
import { useRouter } from 'next/navigation'

export type AuthUser = {
  id: string
  name: string
  email: string
  role: string
  roleLabel?: string
  permissions: string[]
  avatar: string
}

type AuthContextType = {
  user: AuthUser | null
  logout: () => void
  hasPermission: (permission: Permission) => boolean
  isSuperAdmin: () => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode
  initialUser?: AuthUser | null
}) {
  const [user] = useState<AuthUser | null>(initialUser ?? null)
  const router = useRouter()

  const logout = async () => {
    await signOut()
    router.push('/login')
  }

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false
    return user.permissions.includes(permission)
  }

  const isSuperAdmin = () => user?.role === 'super_admin'

  return (
    <AuthContext.Provider value={{ user, logout, hasPermission, isSuperAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
