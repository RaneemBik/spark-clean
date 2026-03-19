'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { upsertNewsItem } from '@/lib/supabase/actions'
import { SectionCard, FormField, DashInput, DashTextarea, PageHeader, ImageUploadField, SaveButton } from '@/components/dashboard/DashUI'

export default function NewsEditorPage({ item }: { item?: any }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title:   item?.title   ?? '',
    summary: item?.summary ?? '',
    content: item?.content ?? '',
    image:   item?.image   ?? '',
    status:  item?.status  ?? 'published',
  })

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.title || !form.content) { setError('Title and content are required.'); return }
    setError('')
    startTransition(async () => {
      const result = await upsertNewsItem({ ...form, id: item?.id })
      if (result.success) {
        setSaved(true)
        setTimeout(() => { setSaved(false); router.push('/dashboard/news') }, 1200)
      } else {
        setError(result.error ?? 'Save failed.')
      }
    })
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/news" className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-800 transition">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <PageHeader title={item ? 'Edit News Article' : 'New News Article'} desc={item ? `Editing: ${item.title}` : 'Publish a company announcement'} />
      </div>

      {error && <div className="mb-4 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">{error}</div>}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-5">
          <SectionCard title="Article Content">
            <div className="p-5 space-y-5">
              <FormField label="Title" required>
                <DashInput value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Announcement title..." />
              </FormField>
              <FormField label="Summary" hint="Short intro shown in the news listing">
                <DashTextarea value={form.summary} onChange={(e) => set('summary', e.target.value)} rows={3} placeholder="Brief overview..." />
              </FormField>
              <FormField label="Full Content" required>
                <DashTextarea value={form.content} onChange={(e) => set('content', e.target.value)} rows={12} placeholder="Full article body..." />
              </FormField>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard title="Publish">
            <div className="p-5">
              <SaveButton saved={saved} onClick={handleSave} label={isPending ? 'Saving...' : 'Publish Article'} />
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
