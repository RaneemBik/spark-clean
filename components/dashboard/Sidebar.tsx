'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, FileText, Newspaper, FolderKanban,
  Wrench, Home, Info, Mail, Users, Settings,
  Droplets, LogOut, MessageSquare, ChevronRight, X,
} from 'lucide-react'
import { useAuth } from '@/lib/dashboard/authContext'
import { Permission } from '@/lib/dashboard/mockDashData'

type NavItem = {
  label: string
  href: string
  icon: React.ReactNode
  permission?: Permission
}

const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Home Page',  href: '/dashboard/home',     icon: <Home className="w-4 h-4" />,          permission: 'edit_home'      },
      { label: 'About',      href: '/dashboard/about',    icon: <Info className="w-4 h-4" />,          permission: 'edit_about'     },
      { label: 'Services',   href: '/dashboard/services', icon: <Wrench className="w-4 h-4" />,        permission: 'edit_services'  },
      { label: 'Projects',   href: '/dashboard/projects', icon: <FolderKanban className="w-4 h-4" />,  permission: 'edit_projects'  },
      { label: 'Blog',       href: '/dashboard/blog',     icon: <FileText className="w-4 h-4" />,      permission: 'edit_blog'      },
      { label: 'News',       href: '/dashboard/news',     icon: <Newspaper className="w-4 h-4" />,     permission: 'edit_news'      },
    ],
  },
  {
    title: 'Inbox',
    items: [
      { label: 'Contact Forms',  href: '/dashboard/contact',     icon: <Mail className="w-4 h-4" />,         permission: 'view_contact_submissions'  },
      { label: 'Project Leads',  href: '/dashboard/submissions', icon: <MessageSquare className="w-4 h-4" />, permission: 'view_project_submissions'   },
      { label: 'Appointments',   href: '/dashboard/appointments', icon: <LayoutDashboard className="w-4 h-4" />, permission: 'view_appointments' },
    ],
  },
      {
        title: 'System',
        items: [
          { label: 'Users',    href: '/dashboard/users',    icon: <Users className="w-4 h-4" />,    permission: 'manage_users'    },
          { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="w-4 h-4" /> },
        ],
      },
]

export function DashboardSidebar({ mobileOpen = false, onClose }: { mobileOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname()
  const { user, logout, hasPermission } = useAuth()

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-[1px] z-40 transition-opacity lg:hidden ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside className={`w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-50 shadow-sm overflow-hidden transform transition-transform duration-200 ease-out lg:translate-x-0 lg:z-40 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5 group" onClick={onClose}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-mint-400 to-teal-500 flex items-center justify-center shadow-md shadow-mint-500/20 group-hover:scale-105 transition-transform">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm leading-tight">SparkClean</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest">Admin Panel</div>
            </div>
          </Link>
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onClose}
            className="lg:hidden w-8 h-8 inline-flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
        {navGroups.map((group) => {
          const visible = group.items.filter((i) => !i.permission || hasPermission(i.permission))
          if (!visible.length) return null
          return (
            <div key={group.title}>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-1.5">
                {group.title}
              </p>
              <ul className="space-y-0.5">
                {visible.map((item) => {
                  const active = isActive(item.href)
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                          active
                            ? 'bg-mint-50 text-mint-700 shadow-sm shadow-mint-100'
                            : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                        }`}
                      >
                        <span className={active ? 'text-mint-600' : 'text-gray-400 group-hover:text-gray-600'}>
                          {item.icon}
                        </span>
                        <span className="flex-1">{item.label}</span>
                        {active && <ChevronRight className="w-3.5 h-3.5 text-mint-400" />}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </nav>

      {/* User Footer */}
      <div className="px-3 pb-4 pt-3 border-t border-gray-100 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50">
          <div className="w-8 h-8 rounded-full bg-mint-100 flex items-center justify-center text-mint-700 font-bold text-xs shrink-0">
            {user?.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-800 text-xs font-semibold truncate">{user?.name}</p>
            <p className="text-gray-400 text-[11px] truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => {
            onClose?.()
            logout()
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-xs font-medium">Sign Out</span>
        </button>
      </div>
      </aside>
    </>
  )
}
