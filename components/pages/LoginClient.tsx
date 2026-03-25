'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Droplets, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { signIn } from '@/lib/supabase/actions'

export default function LoginClient() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🔐 Sign in attempt:', { email, password: '***' })
    setError('')
    startTransition(async () => {
      try {
        console.log('📡 Calling server sign-in...')
        const result = await signIn(email, password)

        if (!result.success) {
          console.log('❌ Login failed:', result.error)
          setError(result.error || 'Invalid email or password. Please check your credentials.')
        } else {
          console.log('✅ Server sign-in success, resolving role:', result.role)
          const path = (result as any).landingPath || '/dashboard'
          await new Promise(resolve => setTimeout(resolve, 250))
          window.location.href = path
        }
      } catch (err) {
        console.error('💥 Unexpected error:', err)
        setError('An unexpected error occurred. Check console for details.')
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-mint-400 to-teal-500 flex items-center justify-center shadow-xl shadow-mint-500/25 mb-4">
            <Droplets className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">SparkClean Admin</h1>
          <p className="text-sm text-gray-400 mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />{error}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="you@sparkclean.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-mint-400 focus:border-transparent transition" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                  placeholder="Your password"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-mint-400 focus:border-transparent transition" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isPending}
              className="w-full py-3 rounded-xl bg-mint-600 hover:bg-mint-700 text-white font-semibold text-sm transition shadow-sm shadow-mint-500/20 disabled:opacity-60 disabled:cursor-not-allowed mt-2">
              {isPending ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
