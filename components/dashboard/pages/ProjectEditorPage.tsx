'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { upsertProject } from '@/lib/supabase/actions'
import { SectionCard, FormField, DashInput, DashTextarea, DashSelect, PageHeader, ImageUploadField, SaveButton } from '@/components/dashboard/DashUI'

export default function ProjectEditorPage({ project }: { project?: any }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title:            project?.title             ?? '',
    category:         project?.category          ?? 'Residential',
    location:         project?.location          ?? '',
    client_type:      project?.client_type       ?? '',
    completion_date:  project?.completion_date   ?? '',
    image:            project?.image             ?? '',
    summary:          project?.summary           ?? '',
    details:          project?.details           ?? '',
    before_after_notes: project?.before_after_notes ?? '',
    gallery:          (project?.gallery ?? []) as string[],
  })
  const [galleryInput, setGalleryInput] = useState('')

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const addGallery = () => {
    if (galleryInput.trim()) {
      setForm((f) => ({ ...f, gallery: [...f.gallery, galleryInput.trim()] }))
      setGalleryInput('')
    }
  }

  const handleSave = () => {
    if (!form.title || !form.summary) { setError('Title and summary are required.'); return }
    setError('')
    startTransition(async () => {
      const result = await upsertProject({ ...form, id: project?.id, slug: project?.slug })
      if (result.success) {
        setSaved(true)
        setTimeout(() => { setSaved(false); router.push('/dashboard/projects') }, 1200)
      } else {
        setError(result.error ?? 'Save failed.')
      }
    })
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/projects" className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-800 transition">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <PageHeader title={project ? 'Edit Project' : 'New Project'} desc={project ? `Editing: ${project.title}` : 'Add a new portfolio project'} />
      </div>

      {error && <div className="mb-4 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">{error}</div>}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-5">
          <SectionCard title="Project Information">
            <div className="p-5 space-y-5">
              <FormField label="Project Title" required>
                <DashInput value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Downtown Office Tower" />
              </FormField>
              <FormField label="Summary" required hint="Shown in the projects listing grid">
                <DashTextarea value={form.summary} onChange={(e) => set('summary', e.target.value)} rows={3} placeholder="Short description..." />
              </FormField>
              <FormField label="Full Project Details">
                <DashTextarea value={form.details} onChange={(e) => set('details', e.target.value)} rows={7} placeholder="Comprehensive description of work done..." />
              </FormField>
              <FormField label="Before & After Notes">
                <DashTextarea value={form.before_after_notes} onChange={(e) => set('before_after_notes', e.target.value)} rows={3} placeholder="Describe the transformation..." />
              </FormField>
            </div>
          </SectionCard>

          <SectionCard title="Gallery Images">
            <div className="p-5 space-y-4">
              {form.gallery.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {form.gallery.map((img, i) => (
                    <div key={i} className="relative h-32 rounded-xl overflow-hidden group bg-gray-100">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => setForm((f) => ({ ...f, gallery: f.gallery.filter((_, j) => j !== i) }))}
                        className="absolute top-2 right-2 w-7 h-7 bg-white rounded-lg shadow flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <DashInput value={galleryInput} onChange={(e) => setGalleryInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addGallery()} placeholder="Paste image URL and press Enter..." />
                <button onClick={addGallery} className="px-4 py-2.5 bg-mint-600 text-white rounded-xl hover:bg-mint-700 transition shrink-0">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <label className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-400 hover:border-mint-400 hover:text-mint-500 cursor-pointer transition">
                <span>↑</span> Upload gallery images
                <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => {
                  Array.from(e.target.files ?? []).forEach((file) => {
                    setForm((f) => ({ ...f, gallery: [...f.gallery, URL.createObjectURL(file)] }))
                  })
                }} />
              </label>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard title="Save">
            <div className="p-5">
              <SaveButton saved={saved} onClick={handleSave} label={isPending ? 'Saving...' : 'Save Project'} />
            </div>
          </SectionCard>
          <SectionCard title="Project Details">
            <div className="p-5 space-y-4">
              <FormField label="Category">
                <DashSelect value={form.category} onChange={(e) => set('category', e.target.value)}>
                  <option>Residential</option><option>Commercial</option><option>Industrial</option><option>Hospitality</option>
                </DashSelect>
              </FormField>
              <FormField label="Location">
                <DashInput value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="City, State" />
              </FormField>
              <FormField label="Client Type">
                <DashInput value={form.client_type} onChange={(e) => set('client_type', e.target.value)} placeholder="e.g. Corporate Office" />
              </FormField>
              <FormField label="Completion Date">
                <DashInput value={form.completion_date} onChange={(e) => set('completion_date', e.target.value)} placeholder="e.g. March 2024" />
              </FormField>
            </div>
          </SectionCard>
          <SectionCard title="Cover Image">
            <div className="p-5">
              <ImageUploadField value={form.image} onChange={(v) => set('image', v)} />
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
