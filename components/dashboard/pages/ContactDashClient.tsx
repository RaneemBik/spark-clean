'use client'

import { useState, useTransition } from 'react'
import { Mail, Reply, Eye, CheckCheck } from 'lucide-react'
import { updateContactStatus } from '@/lib/supabase/actions'
import { PageHeader, SectionCard, StatusBadge, EmptyState } from '@/components/dashboard/DashUI'
import { PermissionGuard } from '@/components/dashboard/PermissionGuard'

export default function ContactDashClient({ initialSubmissions }: { initialSubmissions: any[] }) {
  const [submissions, setSubmissions] = useState(initialSubmissions)
  const [selected, setSelected] = useState<any | null>(null)
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all')
  const [isPending, startTransition] = useTransition()

  const filtered = submissions.filter((s) => filter === 'all' || s.status === filter)

  const counts = {
    all:     submissions.length,
    new:     submissions.filter((s) => s.status === 'new').length,
    read:    submissions.filter((s) => s.status === 'read').length,
    replied: submissions.filter((s) => s.status === 'replied').length,
  }

  const markStatus = (id: string, status: string) => {
    startTransition(async () => {
      await updateContactStatus(id, status)
      setSubmissions((prev) => prev.map((s) => s.id === id ? { ...s, status } : s))
      if (selected?.id === id) setSelected((s: any) => s ? { ...s, status } : null)
    })
  }

  const handleSelect = (s: any) => {
    setSelected(s)
    if (s.status === 'new') markStatus(s.id, 'read')
  }

  return (
    <PermissionGuard permission="view_contact_submissions">
      <div>
      <PageHeader title="Contact Submissions" desc={`${counts.new} new messages`} />

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {(['all', 'new', 'read', 'replied'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
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

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* List */}
        <div className="xl:col-span-2">
          <SectionCard>
            {filtered.length === 0
              ? <EmptyState icon={<Mail className="w-6 h-6" />} title="No submissions" desc="Contact form submissions will appear here." />
              : (
                <div className="divide-y divide-gray-50">
                  {filtered.map((s) => (
                    <button key={s.id} onClick={() => handleSelect(s)}
                      className={`w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors ${selected?.id === s.id ? 'bg-mint-50 border-l-2 border-mint-500' : ''}`}>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className={`text-sm truncate ${s.status === 'new' ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                          {s.first_name} {s.last_name}
                        </p>
                        <StatusBadge status={s.status} />
                      </div>
                      <p className="text-xs text-gray-500 truncate">{s.subject}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </button>
                  ))}
                </div>
              )}
          </SectionCard>
        </div>

        {/* Detail Panel */}
        <div className="xl:col-span-3">
          {selected ? (
            <SectionCard title="Message Details">
              <div className="p-6 space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{selected.first_name} {selected.last_name}</h3>
                    <p className="text-sm text-gray-500">{selected.email} · {selected.phone}</p>
                  </div>
                  <StatusBadge status={selected.status} />
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 mb-1">Subject</p>
                  <p className="font-semibold text-gray-800">{selected.subject}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 mb-2">Message</p>
                  <p className="text-gray-700 leading-relaxed bg-white border border-gray-100 rounded-xl p-4 text-sm">
                    {selected.message}
                  </p>
                </div>

                <p className="text-xs text-gray-400">
                  Received: {new Date(selected.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>

                <div className="flex gap-3 pt-2 border-t border-gray-100 flex-wrap">
                  <button onClick={() => markStatus(selected.id, 'replied')} disabled={isPending || selected.status === 'replied'}
                    className="flex items-center gap-2 bg-mint-600 hover:bg-mint-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition">
                    <Reply className="w-4 h-4" /> Mark as Replied
                  </button>
                  {selected.status !== 'read' && selected.status !== 'replied' && (
                    <button onClick={() => markStatus(selected.id, 'read')} disabled={isPending}
                      className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                      <Eye className="w-4 h-4" /> Mark as Read
                    </button>
                  )}
                  {selected.status === 'replied' && (
                    <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                      <CheckCheck className="w-4 h-4" /> Replied
                    </div>
                  )}
                </div>
              </div>
            </SectionCard>
          ) : (
            <SectionCard>
              <EmptyState icon={<Mail className="w-6 h-6" />} title="Select a message" desc="Click any submission on the left to read it." />
            </SectionCard>
          )}
        </div>
      </div>
    </div>
    </PermissionGuard>
  )
}
