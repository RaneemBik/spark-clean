import { createClient } from '@/lib/supabase/server'
import { LEGACY_ROLE_PERMISSIONS, Permission } from '@/lib/auth/permissionCatalog'

async function resolvePermissionsForRole(supabase: ReturnType<typeof createClient>, role: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('role_permissions')
      .select('permission_name')
      .eq('role_name', role)

    if (!error && data && data.length > 0) {
      return data.map((row: { permission_name: string }) => row.permission_name)
    }
  } catch {}

  return LEGACY_ROLE_PERMISSIONS[role] ?? []
}

/**
 * Check if current user has required permission
 * Used in server actions to enforce role-based access control
 */
export async function checkPermission(requiredPermission: Permission): Promise<{
  allowed: boolean
  userId?: string
  userRole?: string
  error?: string
}> {
  const supabase = createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { allowed: false, error: 'Not authenticated' }
  }

  // Get user profile with role
  // Prefer `public.users` table (mirror of auth.users) for role lookup
  let userRole: string | undefined
  try {
    const { data: urow } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (urow && (urow as any).role) userRole = (urow as any).role
  } catch (e) {}

  // Fallback to profiles table if users row not present
  if (!userRole) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    if (profile && profile.role) userRole = profile.role
    if (profileError && !userRole) {
      return { allowed: false, error: 'Profile not found' }
    }
  }

  if (!userRole) return { allowed: false, error: 'Role not found' }

  const permissions = await resolvePermissionsForRole(supabase, userRole)
  const hasPermission = permissions.includes(requiredPermission)

  return {
    allowed: hasPermission,
    userId: user.id,
    userRole,
    error: hasPermission ? undefined : `Permission denied: ${requiredPermission}`,
  }
}

export async function getCurrentUserRoleAndPermissions(): Promise<{
  userId?: string
  role?: string
  permissions: string[]
}> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { permissions: [] }

  let role: string | undefined

  try {
    const { data: urow } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (urow && (urow as any).role) role = (urow as any).role
  } catch {}

  if (!role) {
    try {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (profile && (profile as any).role) role = (profile as any).role
    } catch {}
  }

  if (!role) return { userId: user.id, permissions: [] }

  return {
    userId: user.id,
    role,
    permissions: await resolvePermissionsForRole(supabase, role),
  }
}

/**
 * Assert user has permission, throw if not
 */
export async function requirePermission(
  requiredPermission: Permission
): Promise<{ userId: string; userRole: string }> {
  const result = await checkPermission(requiredPermission)
  if (!result.allowed) {
    throw new Error(result.error || 'Permission denied')
  }
  return {
    userId: result.userId!,
    userRole: result.userRole!,
  }
}
