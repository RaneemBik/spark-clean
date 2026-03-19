'use client'

import { ReactNode } from 'react'
import { useAuth } from '@/lib/dashboard/authContext'
import { Permission } from '@/lib/dashboard/mockDashData'
import { AlertCircle } from 'lucide-react'

interface PermissionGuardProps {
  children: ReactNode
  permission: Permission
  fallback?: ReactNode
}

/**
 * Client-side permission guard component
 * Checks if current user has required permission
 * Shows error message if not authorized
 */
export function PermissionGuard({
  children,
  permission,
  fallback,
}: PermissionGuardProps) {
  const { hasPermission, user } = useAuth()

  if (!hasPermission(permission)) {
    return (
      fallback || (
        <div className="w-full p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 text-red-500 mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-4">
            Your role ({user?.role || 'Unknown'}) does not have permission to
            access this page.
          </p>
          <p className="text-sm text-gray-500">
            Required permission: <code className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{permission}</code>
          </p>
        </div>
      )
    )
  }

  return <>{children}</>
}
