'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PageHeader, SectionCard, FormField, DashInput, SaveButton, Tabs } from '@/components/dashboard/DashUI'
import { useAuth } from '@/lib/dashboard/authContext'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SettingsDashClient({ user, profile }: { user: any; profile: any }) {
  const supabase = createClient()
  const tabs = ['My Profile', 'Password']
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
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

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
      // After changing password, sign out so the user can login with the new password
      setPwSaved(true)
      setPwForm({ newPw: '', confirmPw: '' })
      try {
        await supabase.auth.signOut()
      } catch {}
      router.push('/login')
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
                <div className="flex gap-3">
                  <div className="w-40">
                    <SaveButton saved={profileSaved} onClick={handleProfileSave} label={isPending ? 'Saving...' : 'Update Profile'} />
                  </div>
                  <button type="button" onClick={() => setTab('Password')}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition">
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </SectionCard>
        )}

        {tab === 'Password' && (
          <SectionCard title="Change Password">
            <div className="p-5 space-y-4 max-w-md">
              <FormField label="New Password" hint="Minimum 8 characters">
                <div className="relative">
                  <DashInput type={showNew ? 'text' : 'password'} value={pwForm.newPw} onChange={(e) => setPwForm((f) => ({ ...f, newPw: e.target.value }))} placeholder="Enter new password" />
                  <button type="button" onClick={() => setShowNew((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </FormField>
              <FormField label="Confirm New Password">
                <div className="relative">
                  <DashInput type={showConfirm ? 'text' : 'password'} value={pwForm.confirmPw} onChange={(e) => setPwForm((f) => ({ ...f, confirmPw: e.target.value }))} placeholder="Repeat new password" />
                  <button type="button" onClick={() => setShowConfirm((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </FormField>
              <SaveButton saved={pwSaved} onClick={handlePasswordSave} label={isPending ? 'Updating...' : 'Update Password'} />
            </div>
          </SectionCard>
        )}
      </div>
    </div>
  )
}
