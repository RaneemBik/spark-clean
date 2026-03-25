'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Calendar, Newspaper, RotateCcw } from 'lucide-react'
import { deleteNewsItem, restoreNewsItem } from '@/lib/supabase/actions'
import { PageHeader, SectionCard, ConfirmModal, EmptyState, StatusBadge, Tabs } from '@/components/dashboard/DashUI'
import { PermissionGuard } from '@/components/dashboard/PermissionGuard'
import { useRouter } from 'next/navigation'

export default function NewsDashClient({ initialNews }: { initialNews: any[] }) {
  const router = useRouter()
  const [items, setItems] = useState(initialNews)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [restoreId, setRestoreId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState<'active' | 'trash'>('active')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const visibleItems = items.filter((item) => activeTab === 'trash' ? item.is_trashed : !item.is_trashed)
  const totalPages = Math.ceil(visibleItems.length / itemsPerPage)
  const paginatedItems = visibleItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleDelete = () => {
    if (!deleteId) return
    startTransition(async () => {
      const result = await deleteNewsItem(deleteId)
      if (result.success) {
        setItems((prev) => prev.filter((n) => n.id !== deleteId))
        router.refresh()
      }
      setDeleteId(null)
    })
  }

  const handleRestore = () => {
    if (!restoreId) return
    startTransition(async () => {
      const result = await restoreNewsItem(restoreId)
      if (result.success) {
        setItems((prev) => prev.map((n) => (n.id === restoreId ? { ...n, is_trashed: false, status: 'published' } : n)))
        router.refresh()
      }
      setRestoreId(null)
    })
  }

  return (
    <PermissionGuard permission="edit_news">
      <div>
      <PageHeader
        title="News"
        desc={`${items.length} articles`}
        action={
          <Link href="/dashboard/news/new" className="flex items-center gap-2 bg-mint-600 hover:bg-mint-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-sm shadow-mint-500/20">
            <Plus className="w-4 h-4" /> New Article
          </Link>
        }
      />
      <SectionCard>
        <div className="p-4 border-b border-gray-50">
          <Tabs tabs={['Active', 'Trash']} active={activeTab === 'active' ? 'Active' : 'Trash'} onChange={(tab) => {
            setCurrentPage(1)
            setActiveTab(tab === 'Trash' ? 'trash' : 'active')
          }} />
        </div>
        {visibleItems.length === 0
          ? <EmptyState icon={<Newspaper className="w-6 h-6" />} title={activeTab === 'trash' ? 'Trash is empty' : 'No news items yet'} desc={activeTab === 'trash' ? 'Deleted news can be restored from here.' : 'Create your first announcement.'} />
          : (
            <>
              <div className="divide-y divide-gray-50">
                {paginatedItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/60 group transition-colors">
                    <div className="relative w-14 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{item.title}</p>
                      <p className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <StatusBadge status={item.status} />
                    {activeTab === 'active' ? (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/dashboard/news/${item.id}`} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-mint-600 hover:bg-mint-50 transition">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button onClick={() => setDeleteId(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setRestoreId(item.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition">
                        <RotateCcw className="w-3.5 h-3.5" /> Restore
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-50">
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
      </SectionCard>
      <ConfirmModal open={!!deleteId} title="Move News Article to Trash?" desc="You can restore it later from Trash."
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      <ConfirmModal open={!!restoreId} title="Restore News Article?" desc="This article will appear on public pages again."
        onConfirm={handleRestore} onCancel={() => setRestoreId(null)} confirmLabel="Restore" />
    </div>
    </PermissionGuard>
  )
}
