'use client'

import { ReactNode, useEffect, useState } from 'react'
import { DashboardSidebar } from '@/components/dashboard/Sidebar'
import { DashboardTopbar } from '@/components/dashboard/Topbar'

export default function DashboardShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const body = document.body
    if (sidebarOpen) {
      body.style.overflow = 'hidden'
    } else {
      body.style.overflow = ''
    }

    return () => {
      body.style.overflow = ''
    }
  }, [sidebarOpen])

  return (
    <div className="min-h-screen bg-gray-50/50 flex">
      <DashboardSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen min-w-0">
        <DashboardTopbar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 p-4 sm:p-5 lg:p-6 max-w-screen-xl w-full">{children}</main>
      </div>
    </div>
  )
}