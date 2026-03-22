'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Search, FileText } from 'lucide-react'
import { deleteBlogPost } from '@/lib/supabase/actions'
import { PageHeader, SectionCard, StatusBadge, ConfirmModal, EmptyState } from '@/components/dashboard/DashUI'
import { PermissionGuard } from '@/components/dashboard/PermissionGuard'
import { useRouter, useSearchParams } from 'next/navigation'

export default function BlogDashClient({ initialPosts }: { initialPosts: any[] }) {
  const [posts, setPosts] = useState(initialPosts)
  const searchParams = useSearchParams()
  const search = searchParams?.get('q') ?? ''
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginatedFiltered = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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

  const handleSearch = (val: string) => {
    setCurrentPage(1)
    const params = new URLSearchParams(window.location.search)
    if (val) params.set('q', val)
    else params.delete('q')
    router.replace(window.location.pathname + (params.toString() ? `?${params.toString()}` : ''))
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
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-72">
            <Search className="w-4 h-4 text-gray-400" />
            <input value={search} onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search posts..." className="bg-transparent text-sm text-gray-600 placeholder-gray-300 outline-none flex-1" />
          </div>
        </div>
        {filtered.length === 0
          ? <EmptyState icon={<FileText className="w-6 h-6" />} title="No posts found" desc="Create your first blog post to get started." />
          : (
            <>
              <div className="divide-y divide-gray-50">
                {paginatedFiltered.map((post) => (
                  <div key={post.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/60 group transition-colors">
                    <div className="relative w-14 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      <Image src={post.image} alt={post.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{post.title}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                        <span>{post.category}</span>
                        <span>·</span>
                        <span>{post.author}</span>
                      </div>
                    </div>
                    <StatusBadge status={post.status} />
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/dashboard/blog/${post.id}`} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-mint-600 hover:bg-mint-50 transition">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button onClick={() => setDeleteId(post.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
      <ConfirmModal open={!!deleteId} title="Delete Blog Post?" desc="This cannot be undone."
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
    </PermissionGuard>
  )
}
