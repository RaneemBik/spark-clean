'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Eye, Plus, Trash2 } from 'lucide-react'
import { upsertBlogPost } from '@/lib/supabase/actions'
import {
  SectionCard, FormField, DashInput, DashTextarea,
  DashSelect, PageHeader, ImageUploadField, SaveButton, Tabs,
} from '@/components/dashboard/DashUI'

function normalizeGallery(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean)
  if (typeof value !== 'string') return []
  const raw = value.trim()
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed.map((v) => String(v).trim()).filter(Boolean)
  } catch {}
  return raw.split(/\r?\n|,/).map((v) => v.trim()).filter(Boolean)
}

export default function BlogEditorPage({ post }: { post?: any }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('Content')

  const [form, setForm] = useState({
    title:    post?.title    ?? '',
    category: post?.category ?? 'How-To Guides',
    author:   post?.author   ?? '',
    excerpt:  post?.excerpt  ?? '',
    content:  post?.content  ?? '',
    image:    post?.image    ?? '',
    gallery:  normalizeGallery(post?.gallery),
    status:   post?.status   ?? 'published',
  })

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.title || !form.content) { setError('Title and content are required.'); return }
    setError('')
    startTransition(async () => {
      const result = await upsertBlogPost({ ...form, id: post?.id })
      if (result.success) {
        setSaved(true)
        setTimeout(() => { setSaved(false); router.push('/dashboard/blog') }, 1200)
      } else {
        setError(result.error ?? 'Save failed.')
      }
    })
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/blog" className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-800 transition">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <PageHeader title={post ? 'Edit Blog Post' : 'New Blog Post'} desc={post ? `Editing: ${post.title}` : 'Create a new article'} />
      </div>

      {error && <div className="mb-4 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">{error}</div>}

      <div className="mb-4">
        <Tabs tabs={['Content', 'Gallery Images']} active={activeTab} onChange={setActiveTab} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-5">
          {activeTab === 'Content' ? (
          <SectionCard title="Content">
            <div className="p-5 space-y-5">
              <FormField label="Title" required>
                <DashInput value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Enter an engaging title..." />
              </FormField>
              <FormField label="Excerpt" required hint="Short summary shown in the blog listing">
                <DashTextarea value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} rows={3} placeholder="Brief overview..." />
              </FormField>
              <FormField label="Body Content" required>
                <DashTextarea value={form.content} onChange={(e) => set('content', e.target.value)} rows={14} placeholder="Write the full article here..." className="font-mono text-xs leading-relaxed" />
              </FormField>
            </div>
          </SectionCard>
          ) : (
            <SectionCard title="Gallery Images">
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">These images appear in the public carousel.</p>
                  <button
                    onClick={() => set('gallery', [...form.gallery, ''])}
                    className="text-xs text-mint-600 hover:text-mint-700 flex items-center gap-1 font-medium"
                  >
                    <Plus className="w-3 h-3" /> Add image
                  </button>
                </div>
                {form.gallery.length === 0 && (
                  <p className="text-sm text-gray-400">No gallery images yet.</p>
                )}
                {form.gallery.map((img, i) => (
                  <div key={`blog-gallery-${i}`} className="rounded-xl border border-gray-100 p-3 bg-gray-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Image {i + 1}</p>
                      <button
                        onClick={() => set('gallery', form.gallery.filter((_, idx) => idx !== i))}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <ImageUploadField
                      value={img}
                      onChange={(v) => set('gallery', form.gallery.map((old, idx) => idx === i ? v : old))}
                    />
                  </div>
                ))}
              </div>
            </SectionCard>
          )}
        </div>

        <div className="space-y-5">
          <SectionCard title="Publish">
            <div className="p-5 space-y-4">
              <FormField label="Status">
                <DashSelect value={form.status} onChange={(e) => set('status', e.target.value)}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </DashSelect>
              </FormField>
              <SaveButton saved={saved} onClick={handleSave} label={isPending ? 'Saving...' : 'Save Post'} />
              {post && (
                <Link href={`/blog/${post.slug}`} target="_blank" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
                  <Eye className="w-4 h-4" /> Preview on Site
                </Link>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Post Details">
            <div className="p-5 space-y-4">
              <FormField label="Category">
                <DashSelect value={form.category} onChange={(e) => set('category', e.target.value)}>
                  <option>How-To Guides</option>
                  <option>Green Cleaning</option>
                  <option>Commercial Cleaning</option>
                  <option>Residential Tips</option>
                  <option>Industry News</option>
                </DashSelect>
              </FormField>
              <FormField label="Author Name">
                <DashInput value={form.author} onChange={(e) => set('author', e.target.value)} placeholder="e.g. Sarah Mitchell" />
              </FormField>
            </div>
          </SectionCard>

          <SectionCard title="Featured Image">
            <div className="p-5">
              <ImageUploadField value={form.image} onChange={(v) => set('image', v)} />
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
