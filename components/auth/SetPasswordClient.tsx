'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

export default function SetPasswordClient({ token }: { token: string | null }) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [inviteEmail, setInviteEmail] = useState<string | null>(null)
  const [inviteName, setInviteName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  if (!token) return <div className="p-6">Invalid or missing token.</div>

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`/api/invitations/validate?token=${encodeURIComponent(token)}`)
        const data = await res.json()
        if (!data.success) {
          setError(data.error || 'Invalid invitation')
        } else {
          setInviteEmail(data.email || null)
          setInviteName(data.name || null)
        }
      } catch (err: any) {
        setError(err?.message || 'Network error')
      } finally { setLoading(false) }
    })()
  }, [token])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setError(null)
    if (password.length < 8) return setError('Password must be at least 8 characters')
    if (password !== confirm) return setError('Passwords do not match')

    try {
      const res = await fetch('/api/invitations/accept', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, password })
      })
      const data = await res.json()
      if (data.success) {
        setSuccess(true)
      } else {
        setError(data.error || 'Failed to set password')
      }
    } catch (err: any) {
      setError(err?.message || 'Network error')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      {loading ? (
        <div>Loading invitation…</div>
      ) : !success ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-bold">Set your password</h2>
          {inviteName && <div className="text-sm text-gray-700">Hi <strong>{inviteName}</strong></div>}
          {inviteEmail && <div className="text-sm text-gray-500">Invited email: <strong>{inviteEmail}</strong></div>}
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div>
            <label className="text-sm">New password</label>
            <div className="relative mt-1">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full border rounded-lg px-3 py-2" />
              <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm">Confirm password</label>
            <div className="relative mt-1">
              <input type={showConfirm ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} className="block w-full border rounded-lg px-3 py-2" />
              <button type="button" onClick={() => setShowConfirm((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}>
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-mint-600 text-white px-4 py-2 rounded-lg">Set password</button>
          </div>
        </form>
      ) : (
        <div className="p-4 bg-green-50 text-green-700 rounded-lg">
          <div className="font-semibold">Password set successfully.</div>
          <div className="text-sm mt-1">You can now log in with your account.</div>
          <div className="mt-3">
            <button onClick={() => router.push('/login')} className="bg-mint-600 text-white px-4 py-2 rounded-lg">Go to login</button>
          </div>
        </div>
      )}
    </div>
  )
}
