'use client'

import { useState, useTransition } from 'react'
import { Users, Plus, X, Check, Trash2 } from 'lucide-react'
import { inviteUser, updateUserRole, createUser, deleteUser } from '@/lib/supabase/actions'
import { PageHeader, SectionCard, RoleBadge, StatusBadge, DashTable, FormField, DashInput, DashSelect } from '@/components/dashboard/DashUI'
import { PermissionGuard } from '@/components/dashboard/PermissionGuard'
import { ROLES } from '@/lib/dashboard/mockDashData'
import { useAuth } from '@/lib/dashboard/authContext'
import { useRouter } from 'next/navigation'

export default function UsersDashClient({ initialUsers }: { initialUsers: any[] }) {
  const { isSuperAdmin } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState(initialUsers)
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [inviteError, setInviteError] = useState('')
  const [inviteSentMessage, setInviteSentMessage] = useState<string | null>(null)
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'content_manager', password: '' })

  if (!isSuperAdmin()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-400 mb-4">
          <Users className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Access Restricted</h2>
        <p className="text-gray-400 text-sm max-w-xs">Only Super Admins can manage users.</p>
      </div>
    )
  }

  const handleInvite = () => {
    if (!newUser.name || !newUser.email) { setInviteError('Name and email are required.'); return }
    setInviteError('')
    startTransition(async () => {
      // If password provided, create user immediately; otherwise invite
      const result = newUser.password && newUser.password.length >= 8
        ? await createUser(newUser.email, newUser.name, newUser.role, newUser.password)
        : await createUser(newUser.email, newUser.name, newUser.role)

      if (result.success) {
        setInviteSentMessage(newUser.password && newUser.password.length >= 8 ? 'User account created successfully!' : 'Invite email sent successfully!')
        setShowForm(false)
        setNewUser({ name: '', email: '', role: 'content_manager', password: '' })
        router.refresh()
        setTimeout(() => setInviteSentMessage(null), 3000)
      } else {
        setInviteError(result.error ?? 'Operation failed.')
      }
    })
  }

  const handleRoleChange = (userId: string, role: string) => {
    startTransition(async () => {
      await updateUserRole(userId, role)
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, profile: { ...u.profile, role } } : u))
    })
  }

  return (
    <PermissionGuard permission="manage_users">
      <div>
        <PageHeader
          title="User Management"
          desc={`${users.length} team members`}
          action={
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-mint-600 hover:bg-mint-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-sm shadow-mint-500/20">
            <Plus className="w-4 h-4" /> Invite User
          </button>
        }
      />

      {inviteSentMessage && (
        <div className="mb-4 bg-green-50 text-green-700 text-sm px-4 py-3 rounded-xl border border-green-100 flex items-center gap-2">
          <Check className="w-4 h-4" /> {inviteSentMessage}
        </div>
      )}

      {/* Role Reference */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {ROLES.map((role) => (
          <SectionCard key={role.id}>
            <div className="p-4 flex items-start gap-3">
              <RoleBadge role={role.name} />
              <p className="text-xs text-gray-500 mt-1">
                {role.permissions.slice(0, 3).map((p) => p.replace(/_/g, ' ')).join(', ')}
                {role.permissions.length > 3 && ` +${role.permissions.length - 3} more`}
              </p>
            </div>
          </SectionCard>
        ))}
      </div>

      <SectionCard title="All Users">
        <DashTable headers={['User', 'Role', 'Last Sign In', 'Actions']}>
          {users.map((u) => {
            const profile = u.profile
            const role = profile?.role ?? 'content_manager'
            return (
              <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-mint-100 flex items-center justify-center text-mint-700 font-bold text-xs shrink-0">
                      {(profile?.name ?? u.email ?? 'U').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{profile?.name ?? '—'}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <select value={role} onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 focus:outline-none focus:ring-1 focus:ring-mint-400">
                    {ROLES.map((r) => <option key={r.id} value={r.name}>{r.label}</option>)}
                  </select>
                </td>
                <td className="px-5 py-4 text-xs text-gray-400">
                  {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Never'}
                </td>
                <td className="px-5 py-4 flex items-center gap-2">
                  <StatusBadge status={u.email_confirmed_at ? 'active' : 'inactive'} />
                  <button title="Delete user" onClick={() => {
                    if (!confirm('Delete this user? This action cannot be undone.')) return
                    startTransition(async () => {
                      const res = await deleteUser(u.id)
                      if (res.success) {
                        setUsers((prev) => prev.filter((x) => x.id !== u.id))
                      } else {
                        alert(res.error || 'Delete failed')
                      }
                    })
                  }} className="text-red-500 hover:text-red-600 p-2 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            )
          })}
        </DashTable>
      </SectionCard>

      {/* Invite Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 text-lg">Invite New User</h3>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition">
                <X className="w-4 h-4" />
              </button>
            </div>
            {inviteError && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-xl mb-4">{inviteError}</p>}
            <div className="space-y-4">
              <FormField label="Full Name" required>
                <DashInput value={newUser.name} onChange={(e) => setNewUser((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Jane Smith" />
              </FormField>
              <FormField label="Email Address" required>
                <DashInput type="email" value={newUser.email} onChange={(e) => setNewUser((f) => ({ ...f, email: e.target.value }))} placeholder="jane@sparkclean.com" />
              </FormField>
              <FormField label="Role" required>
                <DashSelect value={newUser.role} onChange={(e) => setNewUser((f) => ({ ...f, role: e.target.value }))}>
                  {ROLES.map((r) => <option key={r.id} value={r.name}>{r.label}</option>)}
                </DashSelect>
              </FormField>
              <FormField label="Password (optional)">
                <DashInput type="password" value={newUser.password} onChange={(e) => setNewUser((f) => ({ ...f, password: e.target.value }))} placeholder="Set a password to create user immediately" />
              </FormField>
            </div>
            <p className="text-xs text-gray-400 mt-3">{newUser.password && newUser.password.length >= 8 ? 'An account will be created now — the user can sign in with the provided password.' : 'An invitation email will be sent so they can set their own password.'}</p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleInvite} disabled={isPending} className="flex-1 py-2.5 rounded-xl bg-mint-600 text-white text-sm font-semibold hover:bg-mint-700 disabled:opacity-60 transition">
                {isPending ? 'Sending...' : (newUser.password && newUser.password.length >= 8 ? 'Create Account' : 'Send Invite')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </PermissionGuard>
  )
}
