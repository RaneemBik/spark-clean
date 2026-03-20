import { createClient } from '@/lib/supabase/server'
import { Permission } from '@/lib/dashboard/mockDashData'

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

  // Super admin has all permissions
  if (userRole === 'super_admin') {
    return { allowed: true, userId: user.id, userRole }
  }

  // Define role permissions
  const rolePermissions: Record<string, Permission[]> = {
    super_admin: [
      'manage_users',
      'edit_home',
      'edit_about',
      'edit_services',
      'edit_projects',
      'edit_blog',
      'edit_news',
      'view_contact_submissions',
      'view_project_submissions',
      'view_appointments',
      'reply_messages',
      'manage_settings',
    ],
    content_manager: [
      'edit_home',
      'edit_about',
      'edit_services',
      'edit_projects',
      'edit_blog',
      'edit_news',
    ],
    communications: [
      'view_contact_submissions',
      'view_appointments',
      'reply_messages',
    ],
  }

  const permissions = rolePermissions[userRole] || []
  const hasPermission = permissions.includes(requiredPermission)

  return {
    allowed: hasPermission,
    userId: user.id,
    userRole,
    error: hasPermission ? undefined : `Permission denied: ${requiredPermission}`,
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
