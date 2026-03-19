'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Calendar, Newspaper } from 'lucide-react'
import { deleteNewsItem } from '@/lib/supabase/actions'
import { PageHeader, SectionCard, ConfirmModal, EmptyState, StatusBadge } from '@/components/dashboard/DashUI'
import { PermissionGuard } from '@/components/dashboard/PermissionGuard'
import { useRouter } from 'next/navigation'

export default function NewsDashClient({ initialNews }: { initialNews: any[] }) {
  const router = useRouter()
  const [items, setItems] = useState(initialNews)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

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
        {items.length === 0
          ? <EmptyState icon={<Newspaper className="w-6 h-6" />} title="No news items yet" desc="Create your first announcement." />
          : (
            <div className="divide-y divide-gray-50">
              {items.map((item) => (
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
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/dashboard/news/${item.id}`} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-mint-600 hover:bg-mint-50 transition">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => setDeleteId(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
      </SectionCard>
      <ConfirmModal open={!!deleteId} title="Delete News Article?" desc="This cannot be undone."
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
    </PermissionGuard>
  )
}
