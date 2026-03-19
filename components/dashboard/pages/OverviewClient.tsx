'use client'

import Link from 'next/link'
import { Eye, Mail, MessageSquare, FileText, FolderKanban, Plus, Newspaper, ArrowRight } from 'lucide-react'
import { StatCard, SectionCard, StatusBadge, DashTable } from '@/components/dashboard/DashUI'
import { useAuth } from '@/lib/dashboard/authContext'

export default function DashboardOverviewClient({
  stats, recentContacts,
}: {
  stats: { newContacts: number; newLeads: number; totalBlogs: number; totalProjects: number }
  recentContacts: any[]
}) {
  const { user, hasPermission } = useAuth()

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden p-6">
        <div className="absolute right-0 top-0 w-64 h-full opacity-5 pointer-events-none">
          <div className="absolute -right-10 -top-10 w-56 h-56 bg-mint-500 rounded-full" />
          <div className="absolute right-10 bottom-0 w-32 h-32 bg-teal-400 rounded-full" />
        </div>
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Welcome back 👋</p>
            <h2 className="text-xl font-bold text-gray-900 mt-0.5">{user?.name}</h2>
            <p className="text-sm text-gray-500 mt-1">
              You have <span className="font-semibold text-mint-600">{stats.newContacts} new contact submissions</span> and{' '}
              <span className="font-semibold text-mint-600">{stats.newLeads} new project leads</span> waiting.
            </p>
          </div>
          <Link href="/" target="_blank" className="hidden sm:flex items-center gap-2 bg-mint-600 hover:bg-mint-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition shadow-sm">
            <Eye className="w-4 h-4" /> View Website
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="New Contact Forms"    value={stats.newContacts}   icon={<Mail className="w-4 h-4" />}         accent="text-mint-600 bg-mint-50" />
        <StatCard title="New Project Leads"    value={stats.newLeads}      icon={<MessageSquare className="w-4 h-4" />} accent="text-purple-600 bg-purple-50" />
        <StatCard title="Published Blog Posts" value={stats.totalBlogs}    icon={<FileText className="w-4 h-4" />}      accent="text-amber-600 bg-amber-50" />
        <StatCard title="Total Projects"       value={stats.totalProjects} icon={<FolderKanban className="w-4 h-4" />}  accent="text-blue-600 bg-blue-50" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {hasPermission('view_contact_submissions') && (
          <div className="xl:col-span-2">
            <SectionCard
              title="Latest Contact Submissions"
              action={
                <Link href="/dashboard/contact" className="text-xs text-mint-600 hover:text-mint-700 flex items-center gap-1 font-medium">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              }
            >
              {recentContacts.length === 0 ? (
                <p className="text-center text-gray-400 py-10 text-sm">No submissions yet.</p>
              ) : (
                <DashTable headers={['Name', 'Subject', 'Date', 'Status']}>
                  {recentContacts.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-gray-800 text-sm">{s.first_name} {s.last_name}</p>
                        <p className="text-xs text-gray-400">{s.email}</p>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-500">{s.subject}</td>
                      <td className="px-5 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                        {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge status={s.status} /></td>
                    </tr>
                  ))}
                </DashTable>
              )}
            </SectionCard>
          </div>
        )}

        {/* Quick Actions */}
        <SectionCard title="Quick Actions">
          <div className="grid grid-cols-2 gap-3 p-4">
            {([
              { label: 'New Blog',     href: '/dashboard/blog/new',      icon: <FileText className="w-5 h-5" />,       color: 'bg-blue-50 text-blue-600 hover:bg-blue-100',     perm: 'edit_blog'                    },
              { label: 'New Project',  href: '/dashboard/projects/new',   icon: <FolderKanban className="w-5 h-5" />,   color: 'bg-green-50 text-green-600 hover:bg-green-100',  perm: 'edit_projects'                },
              { label: 'New News',     href: '/dashboard/news/new',       icon: <Newspaper className="w-5 h-5" />,      color: 'bg-purple-50 text-purple-600 hover:bg-purple-100', perm: 'edit_news'                  },
              { label: 'Inbox',        href: '/dashboard/contact',        icon: <Mail className="w-5 h-5" />,           color: 'bg-mint-50 text-mint-600 hover:bg-mint-100',     perm: 'view_contact_submissions'     },
            ] as const).filter((a) => hasPermission(a.perm)).map((a) => (
              <Link key={a.href} href={a.href} className={`flex flex-col items-center gap-2 py-4 px-3 rounded-2xl text-center transition ${a.color}`}>
                {a.icon}
                <span className="text-xs font-semibold">{a.label}</span>
              </Link>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
