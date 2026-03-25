'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Search, FileText, RotateCcw } from 'lucide-react'
import { deleteBlogPost, restoreBlogPost } from '@/lib/supabase/actions'
import { PageHeader, SectionCard, StatusBadge, ConfirmModal, EmptyState, Tabs } from '@/components/dashboard/DashUI'
import { PermissionGuard } from '@/components/dashboard/PermissionGuard'
import { useRouter, useSearchParams } from 'next/navigation'

export default function BlogDashClient({ initialPosts }: { initialPosts: any[] }) {
  const [posts, setPosts] = useState(initialPosts)
  const searchParams = useSearchParams()
  const search = searchParams?.get('q') ?? ''
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [restoreId, setRestoreId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState<'active' | 'trash'>('active')

  const filtered = posts.filter((p) => {
    const inCurrentTab = activeTab === 'trash' ? p.is_trashed : !p.is_trashed
    if (!inCurrentTab) return false
    return (
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
    )
  })

  const handleDelete = () => {
    if (!deleteId) return
    startTransition(async () => {
      const result = await deleteBlogPost(deleteId)
      if (result.success) {
        setPosts((prev) => prev.filter((p) => p.id !== deleteId))
        router.refresh()
      }
      setDeleteId(null)
    })
  }

  const handleRestore = () => {
    if (!restoreId) return
    startTransition(async () => {
      const result = await restoreBlogPost(restoreId)
      if (result.success) {
        setPosts((prev) => prev.map((p) => (p.id === restoreId ? { ...p, is_trashed: false, status: 'published' } : p)))
        router.refresh()
      }
      setRestoreId(null)
    })
  }

  return (
    <PermissionGuard permission="edit_blog">
      <div>
      <PageHeader
        title="Blog Posts"
        desc={`${posts.length} articles`}
        action={
          <Link href="/dashboard/blog/new" className="flex items-center gap-2 bg-mint-600 hover:bg-mint-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-sm shadow-mint-500/20">
            <Plus className="w-4 h-4" /> New Post
          </Link>
        }
      />
      <SectionCard>
        <div className="p-4 border-b border-gray-50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Tabs tabs={['Active', 'Trash']} active={activeTab === 'active' ? 'Active' : 'Trash'} onChange={(tab) => setActiveTab(tab === 'Trash' ? 'trash' : 'active')} />
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400" />
            <input value={search} onChange={(e) => {
                const val = e.target.value
                const params = new URLSearchParams(window.location.search)
                if (val) params.set('q', val)
                else params.delete('q')
                router.replace(window.location.pathname + (params.toString() ? `?${params.toString()}` : ''))
              }}
              placeholder="Search posts..." className="bg-transparent text-sm text-gray-600 placeholder-gray-300 outline-none flex-1" />
            </div>
          </div>
        </div>
        {filtered.length === 0
          ? <EmptyState icon={<FileText className="w-6 h-6" />} title={activeTab === 'trash' ? 'Trash is empty' : 'No posts found'} desc={activeTab === 'trash' ? 'Deleted posts can be restored from here.' : 'Create your first blog post to get started.'} />
          : (
            <div className="divide-y divide-gray-50">
              {filtered.map((post) => (
                <div key={post.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/60 group transition-colors">
                  <div className="relative w-14 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    <Image src={post.image} alt={post.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{post.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                      <span>{post.category}</span>
                      <span>&middot;</span>
                      <span>{post.author}</span>
                    </div>
                  </div>
                  <StatusBadge status={post.status} />
                  {activeTab === 'active' ? (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/dashboard/blog/${post.id}`} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-mint-600 hover:bg-mint-50 transition">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button onClick={() => setDeleteId(post.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setRestoreId(post.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition">
                      <RotateCcw className="w-3.5 h-3.5" /> Restore
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
      </SectionCard>
      <ConfirmModal open={!!deleteId} title="Move Blog Post to Trash?" desc="You can restore it later from Trash."
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      <ConfirmModal open={!!restoreId} title="Restore Blog Post?" desc="This post will appear on public pages again."
        onConfirm={handleRestore} onCancel={() => setRestoreId(null)} confirmLabel="Restore" />
    </div>
    </PermissionGuard>
  )
}
