'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PageHeader, SectionCard, FormField, DashInput, SaveButton, Tabs } from '@/components/dashboard/DashUI'
import { useAuth } from '@/lib/dashboard/authContext'

export default function SettingsDashClient({ user, profile }: { user: any; profile: any }) {
  const { isSuperAdmin } = useAuth()
  const supabase = createClient()
  const tabs = isSuperAdmin() ? ['My Profile', 'Password'] : ['My Profile', 'Password']
  const [tab, setTab] = useState('My Profile')
  const [isPending, startTransition] = useTransition()
  const [profileSaved, setProfileSaved] = useState(false)
  const [pwSaved, setPwSaved] = useState(false)
  const [error, setError] = useState('')

  const [profileForm, setProfileForm] = useState({
    name: profile?.name ?? '',
    email: user?.email ?? '',
  })
  const [pwForm, setPwForm] = useState({ newPw: '', confirmPw: '' })

  const handleProfileSave = () => {
    setError('')
    startTransition(async () => {
      // Update name in profiles table
      await supabase.from('profiles').update({ name: profileForm.name }).eq('id', user.id)
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 1500)
    })
  }

  const handlePasswordSave = () => {
    if (pwForm.newPw !== pwForm.confirmPw) { setError('Passwords do not match.'); return }
    if (pwForm.newPw.length < 8) { setError('Password must be at least 8 characters.'); return }
    setError('')
    startTransition(async () => {
      const { error } = await supabase.auth.updateUser({ password: pwForm.newPw })
      if (error) { setError(error.message); return }
      setPwSaved(true)
      setPwForm({ newPw: '', confirmPw: '' })
      setTimeout(() => setPwSaved(false), 1500)
    })
  }

  return (
    <div>
      <PageHeader title="Settings" desc="Manage your account" />
      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {error && <div className="mt-4 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">{error}</div>}

      <div className="mt-5 space-y-5">
        {tab === 'My Profile' && (
          <SectionCard title="Profile Information">
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-mint-100 flex items-center justify-center text-mint-700 font-bold text-xl">
                  {(profile?.name ?? user?.email ?? 'A').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{profile?.name}</p>
                  <p className="text-sm text-gray-400 capitalize">{profile?.role?.replace(/_/g, ' ')}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Full Name">
                  <DashInput value={profileForm.name} onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))} />
                </FormField>
                <FormField label="Email Address" hint="Contact Supabase admin to change email">
                  <DashInput value={profileForm.email} disabled className="opacity-60 cursor-not-allowed" />
                </FormField>
              </div>
              <div className="flex justify-end">
                <div className="w-40">
                  <SaveButton saved={profileSaved} onClick={handleProfileSave} label={isPending ? 'Saving...' : 'Update Profile'} />
                </div>
              </div>
            </div>
          </SectionCard>
        )}

        {tab === 'Password' && (
          <SectionCard title="Change Password">
            <div className="p-5 space-y-4 max-w-md">
              <FormField label="New Password" hint="Minimum 8 characters">
                <DashInput type="password" value={pwForm.newPw} onChange={(e) => setPwForm((f) => ({ ...f, newPw: e.target.value }))} placeholder="Enter new password" />
              </FormField>
              <FormField label="Confirm New Password">
                <DashInput type="password" value={pwForm.confirmPw} onChange={(e) => setPwForm((f) => ({ ...f, confirmPw: e.target.value }))} placeholder="Repeat new password" />
              </FormField>
              <SaveButton saved={pwSaved} onClick={handlePasswordSave} label={isPending ? 'Updating...' : 'Update Password'} />
            </div>
          </SectionCard>
        )}
      </div>
    </div>
  )
}
