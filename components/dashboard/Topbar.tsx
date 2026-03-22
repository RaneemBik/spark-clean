'use client'

import { Bell, Search, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/dashboard/authContext'
import { ROLES } from '@/lib/dashboard/mockDashData'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

const breadcrumbs: Record<string, string[]> = {
  '/dashboard':             ['Dashboard'],
  '/dashboard/home':        ['Dashboard', 'Home Page'],
  '/dashboard/about':       ['Dashboard', 'About'],
  '/dashboard/services':    ['Dashboard', 'Services'],
  '/dashboard/projects':    ['Dashboard', 'Projects'],
  '/dashboard/blog':        ['Dashboard', 'Blog'],
  '/dashboard/news':        ['Dashboard', 'News'],
  '/dashboard/contact':     ['Dashboard', 'Contact Forms'],
  '/dashboard/submissions': ['Dashboard', 'Project Leads'],
  '/dashboard/users':       ['Dashboard', 'Users'],
  '/dashboard/settings':    ['Dashboard', 'Settings'],
}

export function DashboardTopbar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const query = searchParams?.get('q') ?? ''
  const router = useRouter()
  const { user, hasPermission } = useAuth()
  const supabaseRef = useRef<any | null>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)

  const crumbs = Object.entries(breadcrumbs).find(([key]) =>
    pathname === key || (key !== '/dashboard' && pathname.startsWith(key))
  )?.[1] ?? ['Dashboard']

  const roleLabel = ROLES.find((r) => r.name === user?.role)?.label ?? ''

  const unreadCount = notifications.filter(n => (
    (n.type === 'appointment' && n.status === 'pending') ||
    (n.type === 'contact' && n.status === 'new')
  )).length

  function timeAgo(dateStr: string) {
    const d = new Date(dateStr).getTime()
    const s = Math.floor((Date.now() - d) / 1000)
    if (s < 60) return `${s}s ago`
    const m = Math.floor(s / 60)
    if (m < 60) return `${m}m ago`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h ago`
    const days = Math.floor(h / 24)
    return `${days}d ago`
  }

  function playBeep() {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext()
      const ctx = audioCtxRef.current
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'
      o.frequency.value = 880
      g.gain.value = 0.03
      o.connect(g); g.connect(ctx.destination)
      o.start()
      setTimeout(() => { try { o.stop(); } catch (e) {} }, 150)
    } catch (e) {
      // ignore audio errors
    }
  }

  useEffect(() => {
    let mounted = true
    async function loadInitial() {
      try {
        if (!supabaseRef.current) supabaseRef.current = createClient()
        const sb = supabaseRef.current
        const { data: appts } = await sb.from('appointments').select('*').order('created_at', { ascending: false }).limit(6)
        const { data: contacts } = await sb.from('contact_submissions').select('*').order('created_at', { ascending: false }).limit(6)
        if (!mounted) return
        const items = [
          ...(appts || []).map((a: any) => ({
            id: a.id, type: 'appointment', title: a.name, subtitle: a.email, status: a.status, created_at: a.created_at
          })),
          ...(contacts || []).map((c: any) => ({
            id: c.id, type: 'contact', title: `${c.first_name} ${c.last_name}`, subtitle: c.subject, status: c.status, created_at: c.created_at
          }))
        ].sort((x, y) => new Date(y.created_at).getTime() - new Date(x.created_at).getTime()).slice(0, 6)
        setNotifications(items)
      } catch (e) {
        console.error('Notification load error', e)
      }
    }

    loadInitial()

    // subscribe to inserts for real-time notifications
    let apptSub: any = null
    let contactSub: any = null
    try {
      if (!supabaseRef.current) supabaseRef.current = createClient()
      const sb = supabaseRef.current
      apptSub = sb.channel('public:appointments').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'appointments' }, (payload: any) => {
        const a = payload.new
        const note = { id: a.id, type: 'appointment', title: a.name, subtitle: a.email, status: a.status, created_at: a.created_at }
        setNotifications((prev) => [note, ...prev].slice(0, 6))
        playBeep()
      }).subscribe()

      contactSub = sb.channel('public:contact_submissions').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contact_submissions' }, (payload: any) => {
        const c = payload.new
        const note = { id: c.id, type: 'contact', title: `${c.first_name} ${c.last_name}`, subtitle: c.subject, status: c.status, created_at: c.created_at }
        setNotifications((prev) => [note, ...prev].slice(0, 6))
        playBeep()
      }).subscribe()
    } catch (e) {
      console.error('Realtime subscribe error', e)
    }

    return () => {
      mounted = false
      try { if (supabaseRef.current && apptSub) supabaseRef.current.removeChannel(apptSub) } catch (e) {}
      try { if (supabaseRef.current && contactSub) supabaseRef.current.removeChannel(contactSub) } catch (e) {}
      if (audioCtxRef.current) try { audioCtxRef.current.close() } catch (e) {}
    }
  }, [])

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center gap-4 px-6 sticky top-0 z-30">
      {/* Breadcrumb */}
      <div className="flex-1 flex items-center gap-2 text-sm">
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-gray-300">/</span>}
            <span className={i === crumbs.length - 1 ? 'font-semibold text-gray-900' : 'text-gray-400'}>
              {crumb}
            </span>
          </span>
        ))}
      </div>



      {/* View Site */}
      <Link href="/" target="_blank" className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-mint-600 transition px-3 py-2 rounded-xl hover:bg-mint-50 border border-transparent hover:border-mint-100">
        <ExternalLink className="w-3.5 h-3.5" /> View Site
      </Link>

      {/* Notifications (only for users with inbox/manage permissions) */}
      {(hasPermission && (hasPermission('manage_users') || hasPermission('view_contact_submissions'))) && (
        <div className="relative">
        <button onClick={() => setOpen(!open)} aria-expanded={open} className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-mint-200 hover:text-mint-600 transition">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[18px] h-4 px-1 text-[10px] leading-4 flex items-center justify-center bg-mint-500 rounded-full border-2 border-white text-white">
              {unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-xl shadow-lg z-40">
            <div className="p-3 border-b border-gray-100 flex items-center justify-between">
              <div className="text-sm font-semibold">Notifications</div>
              <div className="text-xs text-gray-400">Recent</div>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {notifications.length === 0 && (
                <div className="p-4 text-sm text-gray-500">No notifications</div>
              )}
              {notifications.map((n) => (
                <button key={`${n.type}-${n.id}`} onClick={() => {
                    setOpen(false)
                    if (n.type === 'appointment') router.push(`/dashboard/appointments/${n.id}`)
                    else router.push('/dashboard/contact')
                  }} className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center text-gray-600 text-sm font-semibold">{n.type === 'appointment' ? 'A' : 'M'}</div>
                  <div className="flex-1">
                    <div className={`text-sm truncate ${((n.type === 'appointment' && n.status === 'pending') || (n.type === 'contact' && n.status === 'new')) ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                      {n.title}
                    </div>
                    <div className="text-xs text-gray-400 truncate">{n.subtitle}</div>
                  </div>
                  <div className="text-[11px] text-gray-300 pl-2">{timeAgo(n.created_at)}</div>
                </button>
              ))}
            </div>
            <div className="p-2 border-t border-gray-100 text-center text-xs">
              <Link href="/dashboard/appointments" className="text-mint-600 font-medium">View all appointments</Link>
            </div>
          </div>
        )}
        </div>
      )}

      {/* User chip */}
      <div className="flex items-center gap-2.5 pl-3 border-l border-gray-100">
        <div className="w-8 h-8 rounded-full bg-mint-100 flex items-center justify-center text-mint-700 font-bold text-xs">
          {user?.avatar}
        </div>
        <div className="hidden md:block">
          <p className="text-xs font-semibold text-gray-800 leading-tight">{user?.name}</p>
          <p className="text-[11px] text-gray-400 leading-tight">{roleLabel}</p>
        </div>
      </div>
    </header>
  )
}
