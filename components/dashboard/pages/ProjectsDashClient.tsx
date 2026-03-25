'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Trash2, MapPin, Calendar, FolderKanban, RotateCcw } from 'lucide-react'
import { deleteProject, restoreProject } from '@/lib/supabase/actions'
import { PageHeader, SectionCard, ConfirmModal, EmptyState, Tabs } from '@/components/dashboard/DashUI'
import { PermissionGuard } from '@/components/dashboard/PermissionGuard'
import { useRouter } from 'next/navigation'

export default function ProjectsDashClient({ initialProjects }: { initialProjects: any[] }) {
  const router = useRouter()
  const [projects, setProjects] = useState(initialProjects)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [restoreId, setRestoreId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState<'active' | 'trash'>('active')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const visibleProjects = projects.filter((project) => activeTab === 'trash' ? project.is_trashed : !project.is_trashed)
  const totalPages = Math.ceil(visibleProjects.length / itemsPerPage)
  const paginatedProjects = visibleProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleDelete = () => {
    if (!deleteId) return
    startTransition(async () => {
      const result = await deleteProject(deleteId)
      if (result.success) {
        setProjects((prev) => prev.filter((p) => p.id !== deleteId))
        router.refresh()
      }
      setDeleteId(null)
    })
  }

  const handleRestore = () => {
    if (!restoreId) return
    startTransition(async () => {
      const result = await restoreProject(restoreId)
      if (result.success) {
        setProjects((prev) => prev.map((p) => (p.id === restoreId ? { ...p, is_trashed: false } : p)))
        router.refresh()
      }
      setRestoreId(null)
    })
  }

  return (
    <PermissionGuard permission="edit_projects">
      <div>
      <PageHeader
        title="Projects"
        desc={`${visibleProjects.length} projects in ${activeTab === 'trash' ? 'trash' : 'portfolio'}`}
        action={
          <Link href="/dashboard/projects/new" className="flex items-center gap-2 bg-mint-600 hover:bg-mint-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-sm shadow-mint-500/20">
            <Plus className="w-4 h-4" /> New Project
          </Link>
        }
      />
      <div className="mb-4">
        <Tabs tabs={['Active', 'Trash']} active={activeTab === 'active' ? 'Active' : 'Trash'} onChange={(tab) => {
          setCurrentPage(1)
          setActiveTab(tab === 'Trash' ? 'trash' : 'active')
        }} />
      </div>
      {visibleProjects.length === 0 ? (
        <SectionCard><EmptyState icon={<FolderKanban className="w-6 h-6" />} title={activeTab === 'trash' ? 'Trash is empty' : 'No projects yet'} desc={activeTab === 'trash' ? 'Deleted projects can be restored from here.' : 'Add your first portfolio project.'} /></SectionCard>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {paginatedProjects.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                <div className="relative h-44">
                  <Image src={p.image} alt={p.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-white/95 text-mint-700 text-xs font-bold px-2.5 py-1 rounded-full">{p.category}</span>
                  </div>
                  {activeTab === 'active' ? (
                    <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/dashboard/projects/${p.id}`} className="w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center text-gray-600 hover:text-mint-600 transition">
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <button onClick={() => setDeleteId(p.id)} className="w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center text-gray-600 hover:text-red-500 transition">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setRestoreId(p.id)} className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition">
                      <RotateCcw className="w-3.5 h-3.5" /> Restore
                    </button>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1.5">{p.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.location}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{p.completion_date}</span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{p.summary}</p>
                </div>
              </div>
            ))}
          </div>
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
      <ConfirmModal open={!!deleteId} title="Move Project to Trash?" desc="You can restore it later from Trash."
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      <ConfirmModal open={!!restoreId} title="Restore Project?" desc="This project will appear on public pages again."
        onConfirm={handleRestore} onCancel={() => setRestoreId(null)} confirmLabel="Restore" />
    </div>
    </PermissionGuard>
  )
}
