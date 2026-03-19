'use client'

import { Bell, Search, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/dashboard/authContext'
import { ROLES } from '@/lib/dashboard/mockDashData'

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
  const { user } = useAuth()

  const crumbs = Object.entries(breadcrumbs).find(([key]) =>
    pathname === key || (key !== '/dashboard' && pathname.startsWith(key))
  )?.[1] ?? ['Dashboard']

  const roleLabel = ROLES.find((r) => r.name === user?.role)?.label ?? ''

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

      {/* Search */}
      <div className="hidden lg:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-48">
        <Search className="w-3.5 h-3.5 text-gray-400" />
        <input type="text" placeholder="Search..." className="bg-transparent text-sm text-gray-600 placeholder-gray-300 outline-none w-full" />
      </div>

      {/* View Site */}
      <Link href="/" target="_blank" className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-mint-600 transition px-3 py-2 rounded-xl hover:bg-mint-50 border border-transparent hover:border-mint-100">
        <ExternalLink className="w-3.5 h-3.5" /> View Site
      </Link>

      {/* Notifications */}
      <button className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-mint-200 hover:text-mint-600 transition">
        <Bell className="w-4 h-4" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-mint-500 rounded-full border-2 border-white" />
      </button>

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
