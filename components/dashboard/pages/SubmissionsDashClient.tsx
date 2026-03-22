'use client'

import { useState, useTransition } from 'react'
import { MessageSquare, Phone, Mail, CheckCheck, Eye } from 'lucide-react'
import { updateProjectSubmissionStatus } from '@/lib/supabase/actions'
import { PageHeader, SectionCard, StatusBadge, EmptyState } from '@/components/dashboard/DashUI'
import { PermissionGuard } from '@/components/dashboard/PermissionGuard'

export default function SubmissionsDashClient({ initialSubmissions }: { initialSubmissions: any[] }) {
  const [submissions, setSubmissions] = useState(initialSubmissions)
  const [selected, setSelected] = useState<any | null>(null)
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'contacted'>('all')
  const [isPending, startTransition] = useTransition()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const filtered = submissions.filter((s) => filter === 'all' || s.status === filter)
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginatedFiltered = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const counts = {
    all:       submissions.length,
    new:       submissions.filter((s) => s.status === 'new').length,
    read:      submissions.filter((s) => s.status === 'read').length,
    contacted: submissions.filter((s) => s.status === 'contacted').length,
  }

  const markStatus = (id: string, status: string) => {
    startTransition(async () => {
      await updateProjectSubmissionStatus(id, status)
      setSubmissions((prev) => prev.map((s) => s.id === id ? { ...s, status } : s))
      if (selected?.id === id) setSelected((s: any) => s ? { ...s, status } : null)
    })
  }

  const handleSelect = (s: any) => {
    setSelected(s)
    if (s.status === 'new') markStatus(s.id, 'read')
  }

  const handleFilterChange = (f: typeof filter) => {
    setCurrentPage(1)
    setFilter(f)
  }

  return (
    <PermissionGuard permission="view_project_submissions">
      <div>
      <PageHeader title="Project Leads" desc={`${counts.new} new leads from project pages`} />

      <div className="flex gap-2 mb-5 flex-wrap">
        {(['all', 'new', 'read', 'contacted'] as const).map((f) => (
          <button key={f} onClick={() => handleFilterChange(f)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition ${
              filter === f ? 'bg-mint-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'
            }`}>
            <span className="capitalize">{f}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${filter === f ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {selected ? (
        /* Full-width detail view when submission selected */
        <>
          <button onClick={() => setSelected(null)} className="mb-4 text-mint-600 font-medium hover:text-mint-700">
            ← Back to list
          </button>
          <SectionCard title="Lead Details">
            <div className="p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selected.name}</h3>
                  <p className="text-sm text-gray-500">Submitted via project page</p>
                </div>
                <StatusBadge status={selected.status} />
              </div>

              <div className="inline-flex items-center gap-2 bg-mint-50 text-mint-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                <MessageSquare className="w-3.5 h-3.5" /> Project: {selected.project_title}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Email</p>
                  <a href={`mailto:${selected.email}`} className="text-sm font-medium text-mint-600 hover:text-mint-700 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />{selected.email}
                  </a>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Phone</p>
                  <a href={`tel:${selected.phone}`} className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />{selected.phone || '—'}
                  </a>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Service Requested</p>
                <p className="font-semibold text-gray-800 text-sm">{selected.service}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-2">Message</p>
                <p className="text-gray-700 leading-relaxed bg-white border border-gray-100 rounded-xl p-4 text-sm">{selected.message}</p>
              </div>

              <p className="text-xs text-gray-400">
                Received: {new Date(selected.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>

              <div className="flex gap-3 pt-2 border-t border-gray-100 flex-wrap">
                <button onClick={() => markStatus(selected.id, 'contacted')} disabled={isPending || selected.status === 'contacted'}
                  className="flex items-center gap-2 bg-mint-600 hover:bg-mint-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition">
                  <CheckCheck className="w-4 h-4" /> Mark as Contacted
                </button>
                {selected.status === 'new' && (
                  <button onClick={() => markStatus(selected.id, 'read')} disabled={isPending}
                    className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                    <Eye className="w-4 h-4" /> Mark as Read
                  </button>
                )}
              </div>
            </div>
          </SectionCard>
        </>
      ) : (
        /* List view with pagination */
        <>
          <div className="space-y-4">
            {paginatedFiltered.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No leads found.</div>
            ) : (
              paginatedFiltered.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSelect(s)}
                  className="w-full text-left p-4 border rounded-lg bg-white hover:bg-gray-50 transition"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className={`text-sm ${s.status === 'new' ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                      {s.name}
                    </p>
                    <StatusBadge status={s.status} />
                  </div>
                  <p className="text-xs text-mint-600 font-medium truncate">{s.project_title}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </button>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-lg font-medium transition ${
                    currentPage === page
                      ? 'bg-mint-600 text-white'
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
    </PermissionGuard>
  )
}
