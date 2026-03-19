'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Permission, ROLES } from '@/lib/dashboard/mockDashData'
import { signOut } from '@/lib/supabase/actions'
import { useRouter } from 'next/navigation'

export type AuthUser = {
  id: string
  name: string
  email: string
  role: string
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
    const role = ROLES.find((r) => r.name === user.role)
    return role?.permissions.includes(permission) ?? false
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
